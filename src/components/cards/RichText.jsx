import { BubbleMenu, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "react-bootstrap";
import Superscript from "@tiptap/extension-superscript";

export default function RichText({ content }) {
  const extensions = [
    StarterKit,
    Superscript,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ];
  return (
    <EditorProvider extensions={extensions} content={content}>
      <MenuBar />
    </EditorProvider>
  );
}

function MenuBar() {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null;
  }
  return (
    <BubbleMenu>
      <div className='bubble-menu d-flex gap-1'>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}>
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}>
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}>
          Strike
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}>
          Left
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}>
          Center
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}>
          Right
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}>
          Justify
        </Button>
      </div>
    </BubbleMenu>
  );
}
