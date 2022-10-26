import { prisma } from "@lib/db";
import { verify } from "jsonwebtoken";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { token } = req.cookies;
  const { id, title } = req.query;
  if (!token)
    return res.status(401).json({
      message: "No Auth token found",
    });
  let jwtPayload: { username: string; id: string };
  try {
    jwtPayload = (await verify(token, process.env.JWT_SECRET!)) as unknown as {
      username: string;
      id: string;
    };
  } catch {
    return res.status(403).json({
      message: "Invalid Authentication Token",
    });
  }
  const user = await prisma.user.findFirst({
    where: {
      username: jwtPayload.username,
    },
  });
  if (!user)
    return res.status(400).json({
      message: "No User Account found associated with auth token",
    });
  const post = await prisma.posts.findFirst({
    where: {
      Channels: {
        id: id as string,
      },
      slugifiedTitle: title as string,
    },
  });
  if (!post)
    return res.status(404).json({
      message: "No post found with provided details",
    });
  const isUserVoted = await prisma.posts.findFirst({
    where: {
      usersVotes: {
        has: jwtPayload.id,
      },
    },
  });
  if (isUserVoted)
    return res.status(400).json({
      message: "You've already voted for this post.",
    });
  await prisma.posts.update({
    where: {
      id: post.id,
    },
    data: {
      upvotes: {
        increment: 1,
      },
      usersVotes:{
        push:jwtPayload.id
      }
    },
  });

  return res.status(204).end();
};
export default handler;
