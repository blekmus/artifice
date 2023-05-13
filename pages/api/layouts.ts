import prisma from "@/prisma"

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const layouts = await prisma.layout.findMany({
    where: {
      botched: false || null,
    },
    include: {
      mainLayout: true,
      subLayout: true,
    }
  })

  res.status(200).json(layouts);
}