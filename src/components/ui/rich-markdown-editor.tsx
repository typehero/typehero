import { useTheme } from 'next-themes';
import { useContext, useEffect, useRef } from 'react';

import MDEditor, { commands, type ICommand, EditorContext } from '@uiw/react-md-editor';
import { useUploadThing } from '~/utils/useUploadthing';

const PreviewToggle = () => {
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
  // @ts-ignore someone fix the types, #GFI
  const editorRef = useRef < MDEditor > (null);

  const { theme } = useTheme();
  useEffect(() => {
    theme == 'dark'
      ? document.documentElement.setAttribute('data-color-mode', 'dark')
      : document.documentElement.setAttribute('data-color-mode', 'light');
  }, [theme]);

  const extraCommands = [...(dismissPreview ? [] : [codePreview, commands.fullscreen])];

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      console.log('client upload complete');
    },
    onUploadError: (err) => {
      console.log(err);
    },
  });

  const handlePasta = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    {
      const items = event.clipboardData?.items;
      if (!items) return;
      // upload the image to and endpoint
      for (const item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          if (!blob) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const src = event.target?.result;
            if (!src) return;
          };

          // upload to the endpoint
          const uploadedFilesResult = await startUpload([blob]);

          if (!uploadedFilesResult) return;

          // get the textarea
          const textarea = editorRef.current?.textarea;

          // fist file in the array
          const uploadedFile = uploadedFilesResult[0];

          // insert string at cursor position by calling on change
          onChange(
            `${value.slice(0, textarea.selectionStart)}![${uploadedFile?.fileKey}](${uploadedFile?.fileUrl
            })${value.slice(textarea.selectionEnd)}`,
          );
        }
      }
    }
  };

  return (
    <div className="h-full flex-1">
      <MDEditor
        ref={editorRef}
        height="100%"
        value={value}
        // non-split-screen by default
        preview="edit"
        visibleDragbar={false}
        extraCommands={extraCommands}
        // @ts-ignore
        onChange={onChange}
        // @ts-ignore
        onPaste={(event) => handlePasta(event)}
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
