(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
import { prisma } from "@lib/db";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const id = req.body.id as string;
  const posts = await prisma.posts.findMany({
    where: {
      channelsId: id,
    },
    select: {
      upvotes: true,
      downvotes: true,
      slugifiedTitle: true,
      User: {
        select: {
          username: true,
        },
      },
      title: true,
      id: true,
    },
  });
  return res.status(200).json(posts);
};

export default handler;