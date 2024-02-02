import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { prisma } from '@repo/db';
import { auth } from '@repo/auth/server';

const f = createUploadthing({
  /**
   * Log out more information about the error, but don't return it to the client
   * @see https://docs.uploadthing.com/errors#error-formatting
   */
  errorFormatter: (err) => {
    console.log('Error uploading file', err.message);
    console.log('  - Above error caused by:', err.cause);

    return { message: err.message };
  },
});

type ValidFileTypes = 'audio' | 'blob' | 'image' | 'video';
type FileRouterInput =
  | Record<
      ValidFileTypes,
      {
        maxFileSize: '4MB';
        maxFileCount: number;
      }
    >
  | ValidFileTypes[];

// control the file sizes for all image types
const DEFAULT_IMAGE_UPLOAD_PARAMS: FileRouterInput = {
  audio: { maxFileSize: '4MB', maxFileCount: 1 },
  blob: { maxFileSize: '4MB', maxFileCount: 1 },
  image: { maxFileSize: '4MB', maxFileCount: 1 },
  video: { maxFileSize: '4MB', maxFileCount: 1 },
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    'image/png': DEFAULT_IMAGE_UPLOAD_PARAMS.image,
    'image/jpeg': DEFAULT_IMAGE_UPLOAD_PARAMS.image,
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session?.user?.id) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // save to db
      await prisma.imageUpload.create({
        data: {
          url: file.url,
          user: { connect: { id: metadata.userId } },
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
