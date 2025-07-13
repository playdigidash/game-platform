import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalNode
} from "lexical";
import { useEffect } from "react";

import { $createYouTubeNode, YouTubeNode } from "../nodes/YouTubeNode";

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_YOUTUBE_COMMAND"
);

export default function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode as any])) {
      throw new Error("YouTubePlugin: YouTubeNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<string>(
        INSERT_YOUTUBE_COMMAND,
        (payload) => {
          const youTubeNode = $createYouTubeNode(payload);
          $insertNodes([youTubeNode]);
          if ($isRootOrShadowRoot(youTubeNode.getParentOrThrow())) {
            ($wrapNodeInElement as any)(youTubeNode as unknown as any, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}

