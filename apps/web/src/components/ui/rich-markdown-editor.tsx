import { useTheme } from 'next-themes';
import { useContext, useEffect, useRef, useState } from 'react';

import MDEditor, { EditorContext, commands, type ICommand } from '@uiw/react-md-editor';
import { insertText } from '~/utils/domUtils';
import { useUploadThing } from '~/utils/useUploadthing';
import { toast } from './use-toast';

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
  /**
   * This will allow images to be uploaded to CDN
   *
   * @default false
   */
  allowImageUpload?: boolean;
}

export function RichMarkdownEditor({
  dismissPreview,
  value,
  onChange,
  allowImageUpload = false,
}: Props) {
  const editorRef = useRef<typeof MDEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const handleFileChange = () => {};

  const { theme } = useTheme();
  useEffect(() => {
    theme == 'dark'
      ? document.documentElement.setAttribute('data-color-mode', 'dark')
      : document.documentElement.setAttribute('data-color-mode', 'light');
  }, [theme]);

  const extraCommands = [...(dismissPreview ? [] : [codePreview, commands.fullscreen])];

  const uploadImage: ICommand = {
    name: 'Upload Image',
    keyCommand: 'image',
    buttonProps: { 'aria-label': 'Insert title3' },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        ></path>
      </svg>
    ),
    execute: async () => {
      const ref = fileInputRef.current!;

      if (!ref) return;

      // @ts-ignore
      ref.value = null;
      ref.click();
    },
  };

  const myCommands = [
    commands.bold,
    commands.link,
    commands.italic,
    commands.strikethrough,
    commands.codeBlock,
    commands.code,
    ...(allowImageUpload ? [uploadImage] : []),
  ];

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      if (!res) return;
      // fist file in the array
      const uploadedFile = res[0];

      // insert string at cursor position by calling on change
      insertText(
        `![${uploadedFile?.fileKey}](${uploadedFile?.fileUrl})`,
        // @ts-ignore
        editorRef.current.textarea,
      );

      setIsImageUploading(false);

      toast({
        title: 'Image was uploaded successfully',
        variant: 'success',
      });
    },
    onUploadError: (err) => {
      console.error(err);

      setIsImageUploading(false);

      toast({
        title: 'Image failed to upload',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    const ref = fileInputRef.current!;
    if (!ref || !allowImageUpload) return;

    const handler = async () => {
      if (!ref.files?.[0]) return;
      setIsImageUploading(true);

      await startUpload([ref.files[0]]);
    };

    ref.addEventListener('change', handler);

    return () => {
      ref.removeEventListener('change', handler);
    };
  }, [startUpload, allowImageUpload]);

  const handlePasta = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // only allow image if it's enabled
    if (!allowImageUpload) return;

    const items = event.clipboardData?.items;
    if (!items) return;
    // upload the image to and endpoint
    for (const item of items) {
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        if (!blob) return;

        // update state for the loading spinner
        setIsImageUploading(true);

        // upload to the endpoint
        await startUpload([blob]);
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
        commands={myCommands}
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
      {isImageUploading && (
        <div className="absolute bottom-0 flex w-full items-center bg-neutral-100 p-2 pl-3 dark:bg-zinc-700 dark:text-white">
          <div role="status">
            <svg
              aria-hidden="true"
              className="mr-3 h-5 w-5 animate-spin fill-black text-gray-300 dark:fill-white dark:text-neutral-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          <div>Uploading image...</div>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
    </div>
  );
}

function PreviewToggle() {
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
}
