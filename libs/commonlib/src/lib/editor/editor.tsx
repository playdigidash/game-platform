import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { Alert, Box, Button, Typography } from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import {
  LexicalComposerContextWithEditor,
  useLexicalComposerContext,
} from '@lexical/react/LexicalComposerContext';
import { ReadOnlyPlugin } from './plugins/ReadOnlyPlugin';
import { useTranslation } from 'react-i18next';
import { msTranslate, msTranslateRichText } from '@lidvizion/commonlib';
import { ImageNode } from './nodes/ImageNode';
import ImagesPlugin from './plugins/ImagePlugin';
import { YouTubeNode } from './nodes/YouTubeNode';
import YouTubePlugin from './plugins/YouTubePlugin';
import { $getRoot } from 'lexical';

// Define CSS for the editor including placeholder
const editorStyles = `
.editor-input {
  min-height: 150px;
  resize: none;
  font-size: 15px;
  position: relative;
  tab-size: 1;
  outline: 0;
  padding: 10px;
  width: 100%;
}

.editor-input:empty:before {
  content: 'Enter some text...';
  color: #aaa;
  position: absolute;
  pointer-events: none;
}
`;

interface IEditor {
  saveDetails?: (editor: any) => void;
  cancelDetails?: (editor: any) => void;
  detail: string;
  localDetail?: string;
  readOnly: boolean;
  showToolbar: boolean;
  namespace: string;
  classStyles?: any;
  showDone?: boolean;
  renderModal?: (
    open: boolean,
    onClose: () => void,
    onReturn: (imageFile: File) => void
  ) => JSX.Element; // Function to render image modal
}

interface ITextLoader {
  detail: string;
  localDetail?: string;
  readOnly: boolean;
  showToolbar: boolean;
  saveDetails?: (editor: any) => void;
  showDone?: boolean;
  isFocused: boolean;
  updateUnsavedChanges: (value: boolean) => void; // Function to update unsaved changes in the editor
  renderModal?: (
    open: boolean,
    onClose: () => void,
    onReturn: (imageFile: File) => void
  ) => JSX.Element; // Function to render image modal
  modalOpen: boolean;
  handleModalOpen: (value: boolean) => void;
}

const TextLoader: React.FC<ITextLoader> = ({
  detail,
  localDetail,
  readOnly,
  showToolbar,
  saveDetails,
  showDone,
  isFocused,
  updateUnsavedChanges,
  renderModal,
  modalOpen,
  handleModalOpen,
}) => {
  const [editor] = useLexicalComposerContext();
  const [content, setContent] = useState(detail);

  useEffect(() => {
    if (readOnly) {
      editor.setEditable(false);
    } else {
      editor.setEditable(true);
    }
  }, [editor, readOnly]);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      // This callback is called within a synchronous context for editor updates
      editorState.read(() => {
        // Capture the state as a serialized string
        const currentContent = JSON.stringify(editorState);
        setContent(currentContent);
      });
    });
    
    return () => unregister();
  }, [editor]);

  // Handle content changes and update parent components
  useEffect(() => {
    if (content !== detail) {
      updateUnsavedChanges(true);
      if (saveDetails) {
        saveDetails(content);
      }
    } else {
      updateUnsavedChanges(false);
    }
  }, [content, detail, updateUnsavedChanges, saveDetails]);

  useEffect(() => {
    if (localDetail) {
      try {
        const parsed = editor.parseEditorState(localDetail);
        editor.update(() => {
          editor.setEditorState(parsed);
        });
      } catch (error) {
        console.error('Error setting editor state:', error);
        // Create a basic empty state if there's an error
        editor.update(() => {
          const emptyState = editor.parseEditorState('{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}');
          editor.setEditorState(emptyState);
        });
      }
    }
  }, [editor, localDetail]);

  return (
    <>
      {showToolbar && isFocused && (
        <ToolbarPlugin
          editor={editor as any}
          detail={detail}
          saveDetails={saveDetails}
          showDone={showDone}
          renderModal={renderModal}
          modalOpen={modalOpen}
          handleModalOpen={handleModalOpen}
        />
      )}
      {!showToolbar && <ReadOnlyPlugin editor={editor as any} detail={detail} />}
    </>
  );
};

export const Editor: React.FC<IEditor> = ({
  saveDetails,
  detail,
  localDetail,
  readOnly,
  showToolbar,
  namespace,
  showDone,
  classStyles = {},
  renderModal,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = (value: boolean) => {
    setModalOpen(value);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (modalOpen) {
      return; // If the image modal is open, stop tracking focus
    }
    if (
      e.currentTarget.contains(e.relatedTarget) ||
      document.getElementById('floating-link-editor')?.contains(e.relatedTarget) || 
      document.getElementById('youtube-modal')?.contains(e.relatedTarget)
    ) {
      return; // Do nothing if focus is within Editor, FloatingLinkEditor, or YouTubeModal
    }
    setIsFocused(false); // Otherwise, mark Editor as not focused
  };

  const updateUnsavedChanges = useCallback(
    (value: boolean) => {
      if (alertRef.current) {
        // Force the alert to update using native DOM
        if (value && !readOnly) {
          alertRef.current.style.display = 'flex';
        } else {
          alertRef.current.style.display = 'none';
        }
      }
    },
    [readOnly]
  );

  const editorConfig = useMemo(
    () => ({
      namespace,
      theme: {
        // Default theme styling overrides
        text: {
          bold: 'font-weight-bold',
          italic: 'font-style-italic',
          underline: 'underline',
          strikethrough: 'line-through',
        },
      },
      // Lexical uses this to detect changes
      editorState: detail.length > 0 ? undefined : '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
      onError(error: any) {
        console.error('Lexical Editor Error:', error);
      },
      readOnly,
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        ImageNode,
        YouTubeNode,
      ] as any,
    }),
    [namespace, readOnly, detail] // Include detail in the dependencies now
  );
  return (
    <LexicalComposer initialConfig={editorConfig as any}>
      <Box
        onFocus={() => setIsFocused(true)} // Outer box on focus
        onBlur={handleBlur}
        tabIndex={-1} // Allow the Box to receive focus
        component="div"
        className="lexical-composer-child"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flex: 1,
          // paddingLeft: '20px',
          // borderRadius: '8px',
          // backgroundColor: '#FFFFFF',
          // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          // transition: 'box-shadow 0.3s ease-in-out',
          // '&:hover': {
          //   boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.2)',
          // },
          ...classStyles,
        }}
      >
        <ListPlugin />
        <LinkPlugin />
        <ImagesPlugin />
        <YouTubePlugin />
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <TextLoader
          showToolbar={showToolbar}
          detail={detail}
          localDetail={localDetail}
          saveDetails={saveDetails}
          readOnly={readOnly}
          showDone={showDone}
          isFocused={isFocused}
          updateUnsavedChanges={updateUnsavedChanges}
          renderModal={renderModal}
          modalOpen={modalOpen}
          handleModalOpen={handleModalOpen}
        />
        <Box
          component="div"
          marginBottom={showToolbar ? '.1rem' : ''}
          display={'flex'}
          flexDirection="column"
          flex={1}
          sx={{
            '.editor-toolbar': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.25rem 0.5rem', // Compact padding
              backgroundColor: (theme) => theme.palette.background.default,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            },
            '.editor-toolbar .toolbar-icon': {
              margin: '0 0.25rem', // Tighter spacing between icons
              color: (theme) => theme.palette.text.secondary,
              '&:hover': {
                color: (theme) => theme.palette.primary.main,
              },
            }
          }}
        >
          {/* Inject CSS styles for editor placeholder */}
          <style>{editorStyles}</style>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                contentEditable={!readOnly}
                className="editor-input"
              />
            }
            ErrorBoundary={LexicalErrorBoundary as any}
            placeholder={null}
          />
        </Box>

        <div ref={alertRef} style={{ display: 'none' }}>
          <Alert severity="error" variant="outlined">
            Unsaved changes
          </Alert>
        </div>
      </Box>
    </LexicalComposer>
  );
};

// helper functions
function isJSON(string: string) {
  try {
    let parsed = JSON.parse(string);
    if (parsed && typeof parsed === 'object') {
      return true;
    }
  } catch (e) {
    /* return false if try does not return */
  }
  return false;
}
