import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { Box, Typography } from "@mui/material";
import { LexicalEditor } from "lexical";
import { observer } from "mobx-react";
import { useEffect } from "react";

interface IReadOnlyPlugin {
    detail: string
    editor:LexicalEditor
}

export const ReadOnlyPlugin:React.FC<IReadOnlyPlugin> = observer(({detail, editor})=>{
    useEffect(() => {
        if(detail && detail.length > 0){
            try {
                const editorState = editor.parseEditorState(detail);
                editor.update(() => {
                    editor.setEditorState(editorState);
                });   
            } catch (error) {
                console.error("Error setting readonly editor state:", error);
            }
        }
    }, [detail, editor]);

    return null;
})