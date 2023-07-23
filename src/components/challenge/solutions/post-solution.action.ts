'use server';
import { prisma } from '~/server/db';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '~/env.mjs';

interface Args {
  challengeId: number;
  description: string;
  title: string;
  userId: string;
}

export async function postSolution({ challengeId, description, title, userId }: Args) {
  await prisma.sharedSolution.create({
    data: {
      challengeId,
      description,
      title,
      userId,
    },
  });
}

// TODO: move this to it's own server action
export async function addSolutionImage(formData: FormData) {
  const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_ACCESS_KEY,
    },
  });

  // get file extension from formData and append to filename
  // @ts-ignore
  const fileExtension = formData.get('file').type.split('/')[1];

  // random filename
  const fileName = Math.random().toString(36).substring(7);

  // full file fileName
  const fullFileName = `${fileName}.${fileExtension}`;

  // convert formData to blob
  const file = formData.get('file');
  if (!file) {
    return {
      url: '',
    };
  }

  const formDataBlob = new Blob([file], { type: 'image/png' });
  // convert blob to buffer
  const formDataBuffer = await formDataBlob.arrayBuffer();
  // convert arrayBuffer to Uint8Array
  const formDataUint8Array = new Uint8Array(formDataBuffer);

  // take the formdata and upload it to S3Client
  const putObjectCommand = new PutObjectCommand({
    Bucket: 'typehero',
    Key: `${fileName}.${fileExtension}`,
    Body: formDataUint8Array,
  });

  // do upload
  await S3.send(putObjectCommand);

  // return the url of the uploaded fileName
  return {
    fileName: fileName,
    url: `https://pub-1d693eec4982461da4e454b5c1e3dcf9.r2.dev/${fullFileName}`,
  };
}

