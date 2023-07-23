import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const auth = (_req: Request) => Promise.resolve({ id: 'fakeId' });

type ValidFileTypes = 'image' | 'video' | 'audio' | 'blob';
type FileRouterInput =
  | ValidFileTypes[]
  | {
      // @ts-ignore fixed by typehero god
      [key: ValidFileTypes]: {
        maxFileSize?: string;
        maxFileCount?: number;
      };
    };

// control the file sizes for all image types
const DEFAULT_IMAGE_UPLOAD_PARAMS: FileRouterInput = { maxFileSize: '4MB', maxFiles: 1 };

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    'image/png': DEFAULT_IMAGE_UPLOAD_PARAMS,
    'image/jpeg': DEFAULT_IMAGE_UPLOAD_PARAMS,
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
