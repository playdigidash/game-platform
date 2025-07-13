// import { LexicalComposerContextWithEditor, useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SELECTION_CHANGE_COMMAND } from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import ImageIcon from '@mui/icons-material/Image';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
} from '@lexical/selection';
import LinkIcon from '@mui/icons-material/Link';
// import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
// import { createPortal } from 'react-dom';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
// import {
//   $createHeadingNode,
//   $createQuoteNode,
//   $isHeadingNode,
// } from '@lexical/rich-text';
// import {
//   $createCodeNode,
//   $isCodeNode,
//   getDefaultCodeLanguage,
//   getCodeLanguages,
// } from '@lexical/code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {
  AppBar,
  Box,
  Button,
  Card,
  IconButton,
  Input,
  Modal,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { mergeRegister } from '@lexical/utils';
import {
  LexicalComposerContextWithEditor,
  useLexicalComposerContext,
} from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './linkeditor.less';
import { useTheme } from '@mui/material';
import { INSERT_IMAGE_COMMAND, InsertImagePayload } from './ImagePlugin';
import { INSERT_YOUTUBE_COMMAND } from './YouTubePlugin';
// import { AppBar, IconButton } from '@mui/material';
const LowPriority = 1;
// const supportedBlockTypes = new Set([
//   'paragraph',
//   'quote',
//   'code',
//   'h1',
//   'h2',
//   'ul',
//   'ol',
// ]);
// const blockTypeToBlockName = {
//   code: 'Code Block',
//   h1: 'Large Heading',
//   h2: 'Small Heading',
//   h3: 'Heading',
//   h4: 'Heading',
//   h5: 'Heading',
//   ol: 'Numbered List',
//   paragraph: 'Normal',
//   quote: 'Quote',
//   ul: 'Bulleted List',
// };
// function Divider() {
//   return <div className="divider" />;
// }
const positionEditorElement = (editor: any, rect: any) => {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
};
interface IFloatingLinkEditor {
  editor: LexicalEditor;
}
const FloatingLinkEditor = ({ editor }: IFloatingLinkEditor) => {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);
  const linkAttribute = {
    target: '_blank', // Open link in new tab
  };
  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;
    if (editorElem === null) {
      return;
    }
    const rootElement = editor.getRootElement();
    if (
      nativeSelection &&
      selection !== null &&
      // !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          //@ts-ignore
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }
      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      //@ts-ignore
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }
    return true;
  }, [editor]);
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);
  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);
  useEffect(() => {
    if (isEditMode && inputRef.current) {
      //@ts-ignore
      inputRef.current.focus();
    }
  }, [isEditMode]);
  return (
    <Box
      id="floating-link-editor"
      component="div"
      ref={editorRef}
      sx={{
        minWidth: 250,
        position: 'absolute',
        zIndex: 10000,
      }}
    >
      <Card
        sx={{
          padding: 1,
        }}
      >
        <Input
          ref={inputRef}
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
                    url: linkUrl,
                    ...linkAttribute,
                  });
                }
                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      </Card>
    </Box>
  );
};
const getSelectedNode = (selection: any) => {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
};
interface IYouTubeModal {
  editor: LexicalEditor;
  open: boolean;
  onClose: () => void;
}
const YouTubeModal: React.FC<IYouTubeModal> = ({ editor, open, onClose }) => {
  const [url, setUrl] = useState('');

  const handleEmbedClick = () => {
    if (!url) {
      alert('No URL entered. Please type a URL first.');
      return;
    }
    const match =
      /^.*(youtu\.be\/|v\/|v\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match && match?.[2]?.length === 11 ? match?.[2] : null;
    if (!id) return;
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, id);

    setUrl('');
    onClose();
  };

  return (
    <Modal
      id="youtube-modal"
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        component="div"
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 1,
          width: '30vw',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Embed YouTube Video
        </Typography>
        <Card sx={{ padding: 1, mb: 2, alignSelf: 'flex-start' }}>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
          />
        </Card>
        <Button
          variant="contained"
          onClick={handleEmbedClick}
          sx={{ alignSelf: 'flex-start' }}
        >
          Embed
        </Button>
      </Box>
    </Modal>
  );
};
// interface IToolbarPlugin {
//   editor:LexicalComposerContextWithEditor
// }
// export const ToolbarPlugin:React.FC<IToolbarPlugin> = ({editor})=> {
//   const toolbarRef = useRef(null);
//   // const [canUndo, setCanUndo] = useState(false);
//   // const [canRedo, setCanRedo] = useState(false);
//   const [blockType, setBlockType] = useState('paragraph');
//   const [selectedElementKey, setSelectedElementKey] = useState(null);
//   // const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
//     useState(false);
//   const [codeLanguage, setCodeLanguage] = useState('');
//   // const [isRTL, setIsRTL] = useState(false);
//   // const [isBold, setIsBold] = useState(false);
//   // const [isItalic, setIsItalic] = useState(false);
//   // const [isUnderline, setIsUnderline] = useState(false);
//   // const [isStrikethrough, setIsStrikethrough] = useState(false);
//   // const [isCode, setIsCode] = useState(false);
//   const updateToolbar = useCallback(() => {
//     const selection = $getSelection();
//     if ($isRangeSelection(selection)) {
//       const anchorNode = selection.anchor.getNode();
//       const element =
//         anchorNode.getKey() === 'root'
//           ? anchorNode
//           : anchorNode.getTopLevelElementOrThrow();
//       const elementKey = element.getKey();
//       const elementDOM = editor.getElementByKey(elementKey);
//       if (elementDOM !== null) {
//         // setSelectedElementKey(elementKey);
//         if ($isListNode(element)) {
//           const parentList = $getNearestNodeOfType(anchorNode, ListNode);
//           const type = parentList ? parentList.getTag() : element.getTag();
//           setBlockType(type);
//         } else {
//           const type = $isHeadingNode(element)
//             ? element.getTag()
//             : element.getType();
//           setBlockType(type);
//           if ($isCodeNode(element)) {
//             setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
//           }
//         }
//       }
//       // Update text format
//       // setIsBold(selection.hasFormat('bold'));
//       // setIsItalic(selection.hasFormat('italic'));
//       // setIsUnderline(selection.hasFormat('underline'));
//       // setIsStrikethrough(selection.hasFormat('strikethrough'));
//       // setIsCode(selection.hasFormat('code'));
//       // setIsRTL($isParentElementRTL(selection));
//       // Update links
//       const node = getSelectedNode(selection);
//       const parent = node.getParent();
//       if ($isLinkNode(parent) || $isLinkNode(node)) {
//         setIsLink(true);
//       } else {
//         setIsLink(false);
//       }
//     }
//   }, [editor]);
//   useEffect(() => {
//     return mergeRegister(
//       editor.registerUpdateListener(({ editorState }) => {
//         editorState.read(() => {
//           updateToolbar();
//         });
//       }),
//       editor.registerCommand(
//         SELECTION_CHANGE_COMMAND,
//         (_payload, newEditor) => {
//           updateToolbar();
//           return false;
//         },
//         LowPriority
//       ),
//       // editor.registerCommand(
//       //   CAN_UNDO_COMMAND,
//       //   (payload) => {
//       //     setCanUndo(payload);
//       //     return false;
//       //   },
//       //   LowPriority
//       // ),
//       // editor.registerCommand(
//       //   CAN_REDO_COMMAND,
//       //   (payload) => {
//       //     setCanRedo(payload);
//       //     return false;
//       //   },
//       //   LowPriority
//       // )
//     );
//   }, [editor, updateToolbar]);
//   return (
//     <AppBar position="fixed">
//       <Toolbar
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           gap: 2,
//         }}
//       >
//         <IconButton
//           onClick={() => {
//             editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
//           }}
//           aria-label="Format Bold"
//         >
//           <FormatBoldIcon />
//         </IconButton>
//         <IconButton
//           onClick={insertLink}
//         >
//           <LinkIcon/>
//         </IconButton>
//         <IconButton
//           onClick={()=>{
//             editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
//           }}
//         >
//           <FormatListBulletedIcon/>
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// }
interface IToolbarPlugin {
  saveDetails?: (editor: any) => void;
  detail: string;
  editor: LexicalEditor;
  showDone?: boolean;
  renderModal?: (
    open: boolean,
    onClose: () => void,
    onReturn: (imageFile: File) => void
  ) => JSX.Element; // Function to render image modal
  modalOpen: boolean;
  handleModalOpen: (value: boolean) => void;
}
export const ToolbarPlugin: React.FC<IToolbarPlugin> = ({
  saveDetails,
  editor,
  showDone,
  renderModal,
  modalOpen,
  handleModalOpen,
}) => {
  const theme = useTheme();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isLink, setIsLink] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const isContent = editorContent.length >= 3;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [openYouTube, setOpenYouTube] = useState(false);

  const handleModalClick = () => {
    handleModalOpen(true);
  };

  const handleModalClose = () => {
    handleModalOpen(false);
  };

  const handleImageReturn = (imageFile: File) => {
    setImageFile(imageFile);
    handleModalOpen(false); // Close the modal after receiving the image
  };

  // Save image file to the editor when returned from image modal
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = function () {
        if (typeof reader.result === 'string') {
          insertImg({
            src: reader.result,
            altText: 'question-help',
          });
        }
      };

      reader.onerror = function () {
        console.error(
          'An error occurred while reading the file:',
          reader.error
        );
      };
    }
  }, [imageFile]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!selection) return;
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsUnderline(selection.hasFormat('underline'));
    }
    // Update links
    const node = getSelectedNode(selection);
    const parent = node.getParent();
    if ($isLinkNode(parent) || $isLinkNode(node)) {
      setIsLink(true);
    } else {
      setIsLink(false);
    }
  }, [editor]);
  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);
  const insertImg = (payload: InsertImagePayload) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
          setEditorContent(JSON.stringify(editorState));
          // if (saveDetails) {
          //   saveDetails(JSON.stringify(editorState));
          // }
        });
      })
    );
  }, [updateToolbar, editor]);
  return (
    <>
      <Box
        component="div"
        sx={{
          mt: 2,
          width: '325px',
          borderRadius: '5px',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0,
            backgroundColor: 'white',
            padding: 0, // Remove padding
          }}
        >
          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            aria-label="Format Bold"
            sx={{
              width: 40, // Or any other value
              height: 10, // Should be the same as width
              borderRadius: '50%',
              padding: 0,
              color: theme.palette.primary.dark,
            }}
          >
            <FormatBoldIcon />
          </IconButton>
          <IconButton
            onClick={insertLink}
            sx={{
              width: 40, // Or any other value
              height: 40, // Should be the same as width
              borderRadius: '50%',
              padding: 0,
              color: theme.palette.primary.dark,
            }}
          >
            <LinkIcon />
          </IconButton>
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            color="inherit"
            onClick={handleModalClick}
            startIcon={
              <ImageIcon
                sx={{
                  width: 40, // Or any other value
                  height: 40, // Should be the same as width
                  borderRadius: '50%',
                  padding: 0,
                  color: theme.palette.primary.dark,
                }}
              />
            }
          >
            {/* <VisuallyHiddenInput 
              type="file"
              accept={'image/*'} 
              onChange={(e) => {
                if (!e.target.files) return;
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                  if(typeof reader.result === 'string') {
                    insertImg({
                    src: reader.result,
                    altText: 'question-help',
                  })
                };
                
                reader.onerror = function () {
                  console.error('An error occurred while reading the file:', reader.error);
                };
              }}}
            /> */}
          </Button>
          {/* Render the image modal */}
          {modalOpen &&
            renderModal &&
            renderModal(modalOpen, handleModalClose, handleImageReturn)}

          <IconButton
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
            }}
            sx={{
              width: 40, // Or any other value
              height: 40, // Should be the same as width
              borderRadius: '50%',
              padding: 0,
              color: theme.palette.primary.dark,
            }}
          >
            <FormatListBulletedIcon />
          </IconButton>
          <IconButton
            onClick={() => setOpenYouTube(true)}
            sx={{
              width: 40, // Or any other value
              height: 40, // Should be the same as width
              borderRadius: '50%',
              padding: 0,
              color: 'red',
            }}
          >
            <YouTubeIcon />
          </IconButton>
          <YouTubeModal
            editor={editor}
            open={openYouTube}
            onClose={() => setOpenYouTube(false)}
          />
        </Toolbar>
      </Box>
      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
    </>
  );
};
