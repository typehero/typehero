import { useTheme } from 'next-themes';
import { useContext, useEffect } from 'react';

import MDEditor, { commands, type ICommand, EditorContext } from '@uiw/react-md-editor';

const PreviewToggle = () => {
  console.warn(commands);
  const { preview, dispatch } = useContext(EditorContext);
  const click = () => {
    dispatch?.({
      preview: preview === 'edit' ? 'preview' : 'edit',
    });
  };
  if (preview === 'edit') {
    return (
      // TODO: styles don't work for some reason
      <button
        className="mr-2 w-10 px-2 font-bold"
        style={{
          width: '4rem !important',
          padding: '0.25rem 1rem !important',
          fontWeight: 'bold !important',
        }}
        type="button"
        onClick={click}
      >
        Preview
      </button>
    );
  }
  return (
    // TODO: styles don't work for some reason
    <button
      className="mr-2 w-10 px-2 font-bold"
      style={{
        width: '4rem !important',
        padding: '0.25rem 1rem !important',
        fontWeight: 'bold !important',
      }}
      type="button"
      onClick={click}
    >
      Edit
    </button>
  );
};

const codePreview: ICommand = {
  name: 'preview',
  keyCommand: 'preview',
  value: 'preview',
  icon: <PreviewToggle />,
};

interface Props {
  value: string;
  onChange: (v: string) => void;
  dismissPreview?: boolean;
}

export function RichMarkdownEditor({ dismissPreview, value, onChange }: Props) {
  const { theme } = useTheme();
  useEffect(() => {
    theme == 'dark'
      ? document.documentElement.setAttribute('data-color-mode', 'dark')
      : document.documentElement.setAttribute('data-color-mode', 'light');
  }, [theme]);

  const extraCommands = [...(dismissPreview ? [] : [codePreview, commands.fullscreen])];

  return (
    <div className="h-full flex-1">
      <MDEditor
        height="100%"
        value={value}
        // non-split-screen by default
        preview="edit"
        visibleDragbar={false}
        extraCommands={extraCommands}
        // @ts-ignore
        onChange={onChange}
        components={{
          toolbar: (command) => {
            // toolbar: (command, disabled, executeCommand) => {
            // re-render these to nothing
            if (
              command.keyCommand === 'hr' ||
              command.keyCommand === 'link' ||
              command.keyCommand === 'quote' ||
              command.keyCommand === 'image' ||
              command.keyCommand === 'comment' ||
              command.keyCommand === 'list' ||
              // TODO: these aren't under command.keyCommand?
              command.keyCommand === 'unordered-list' ||
              command.keyCommand === 'ordered-list' ||
              command.keyCommand === 'checked-list'
            ) {
              return <></>;
            }
          },
        }}
      />
    </div>
  );
}
