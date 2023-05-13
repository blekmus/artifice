import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import prisma from "@/prisma"

import type { NextApiRequest, NextApiResponse } from 'next';
import { Layout } from '@/types/content';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return
  }

  const { body } = req
  const layouts: Layout[] = body

  await prisma.mainLayout.deleteMany({
    where: {
      layout: {
        botched: true
      }
    }
  })
  await prisma.subLayout.deleteMany({
    where: {
      layout: {
        botched: true
      }
    }
  })
  await prisma.layout.deleteMany({
    where: {
      botched: true
    }
  })

  // // loop through layouts and update
  for (const layout of layouts) {
    await prisma.layout.create({
      data: {
        image: layout.image,
        botched: true,
        mainLayout: {
          create: {
            w: layout.mainLayout.w,
            h: layout.mainLayout.h,
            x: layout.mainLayout.x,
            y: layout.mainLayout.y
          }
        },
        subLayout: {
          create: {
            w: layout.subLayout.w,
            h: layout.subLayout.h,
            x: layout.subLayout.x,
            y: layout.subLayout.y
          }
        }
      }
    })
  }

  res.status(200).json({ message: 'layouts update done!' });
}