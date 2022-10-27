(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
import { stringToSlug } from "@helpers/slugify";
import { prisma } from "@lib/db";
import { verify } from "jsonwebtoken";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const token = req.cookies.token as string;
  if (!token)
    return res.status(401).json({
      message: "No Auth Token found",
    });
  const { title, content } = req.body;
  const channelId = req.query.id as string
  if (!title)
    return res.status(400).json({ message: "Title of post is required" });
  if (!content)
    return res.status(400).json({ message: "Content of post is required" });
  if (!channelId)
    return res.status(400).json({ message: "ChannelId is required" });

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
  const newPost = await prisma.posts.create({
    data: {
      content,
      downvotes: 0,
      slugifiedTitle: `${stringToSlug(title)}-${Date.now()}`,
      title: title,
      upvotes: 0,
      Channels: {
        connect: {
          id: channelId,
        },
      },
      User: {
        connect: {
          username: jwtPayload.username,
        },
      },
    },
    select: {
      slugifiedTitle: true,
    },
  });
  return res.status(200).json({
    message: "New Post Created",
    title: newPost.slugifiedTitle,
  });
};

export default handler;
