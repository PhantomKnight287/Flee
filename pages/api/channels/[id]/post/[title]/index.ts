import { prisma } from "@lib/db";
import { NextApiHandler } from "next";

const hanlder: NextApiHandler = async (req, res) => {
  const { id, title } = req.query;

  const post = await prisma.posts.findFirst({
    where: {
      Channels: {
        id: id as string,
      },
      slugifiedTitle: title as string,
    },
    select: {
      content: true,
      downvotes: true,
      upvotes: true,
      title: true,
      User: {
        select: {
          username: true,
        },
      },
      tags: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  if (!post)
    return res.status(404).json({
      message: "No Post found",
    });
  return res.status(200).json(post);
};

export default hanlder;
