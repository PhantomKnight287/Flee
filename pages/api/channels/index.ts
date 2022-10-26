import { prisma } from "@lib/db";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const limit = parseInt((req.query.cursor as string) || "10");
  console.log(prisma.channels);
  const c = await prisma.channels.findMany({
    select: {
      name: true,
      posts: true,
      id: true,
    },
    take: limit,
  });
  await prisma.$disconnect();
  const channels = c.map((c) => ({ ...c, posts: c.posts.length }));
  const response: Record<string, any> = { data: channels };
  if (c.length === 0) {
    response["nextCursor"] = limit + 3;
  }
  return res.status(200).json({ data: channels });
};

export default handler;
