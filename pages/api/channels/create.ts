import { prisma } from "@lib/db";
import { verify } from "jsonwebtoken";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { token } = req.cookies;
  const { name } = req.body;
  if (!token)
    return res.status(401).json({
      message: "Auth Token not found",
    });
  if (!name)
    return res.status(400).json({
      message: "Name of channel wasn't supplied.",
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
  const oldChannel = await prisma.channels.findFirst({
    where: {
      name: name as string,
    },
  });
  if (oldChannel)
    return res.status(400).json({
      message: "A Channel with this name already exists.",
    });
  const channel = await prisma.channels.create({
    data: {
      name: name as string,
      owner: {
        connect: {
          username: jwtPayload.username,
        },
      },
    },
    select: {
      name: true,
      id: true,
    },
  });
  return res.status(200).json({
    ...channel,
    posts: 0,
  });
};

export default handler;
