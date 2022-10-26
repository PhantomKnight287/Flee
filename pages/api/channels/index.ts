import { prisma } from "@lib/db";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const c = await prisma.channels.findMany({
    select: {
      name: true,
      posts: true,
      id: true,
    },
  });
  await prisma.$disconnect();
  const channels = c.map((c) => ({ ...c, posts: c.posts.length }));
  const response: Record<string, any> = { data: channels };
  return res.status(200).json({ data: channels });
};

export default handler;
