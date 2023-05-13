import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import formidable from 'formidable'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return
  }

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: 'Error parsing form data' })
      return
    }

    // if files.file is of type formidable.File[] return
    if (Array.isArray(files.file)) {
      res.status(400).json({ message: 'Only one file allowed' })
      return
    }

    const imageInfo = files.file

    // generate random string for filename
    const randomString = Math.random().toString(36).substring(2, 15)
    const filename = 'testing/' + randomString + '_' + imageInfo.originalFilename

    // connnect to B2
    const client = new S3Client({
      endpoint: process.env.B2_ENDPOINT,
      region: process.env.B2_REGION,
    })

    const bucket = process.env.B2_BUCKET || ''
    const imageBlob = readFileSync(imageInfo.filepath)

    // create command
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: imageBlob,
    })

    res.status(200).json({ url: filename })

    // upload file to bucket
    try {
      await client.send(command)
    } catch (err) {
      console.log('Failed uploading image to b2' + files.file.originalFilename)
      console.error(err)
    }
  })
}