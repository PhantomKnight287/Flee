import { prisma } from "@lib/db";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const skip = parseInt((req.query.skip as string) || "0");

  const c = await prisma.channels.findMany({
    select: {
      name: true,
      posts: true,
      id: true,
    },
    take:10,
    skip,
  });
  await prisma.$disconnect();
  const channels = c.map((c) => ({ ...c, posts: c.posts.length }));
  return res.status(200).json({ data: channels });
};

export default handler;
