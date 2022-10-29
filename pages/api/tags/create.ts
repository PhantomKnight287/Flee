import { prisma } from "@lib/db";
import { verify } from "jsonwebtoken";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({
      message: "Only post requests are allowed on this route.",
    });
  const token = req.cookies.token as string;
  if (!token)
    return res.status(401).json({
      message: "No Auth Token found",
    });
  const { name } = req.body;
  if (!name)
    return res.status(400).json({
      message: "name of a tag is required",
    });
  const oldTag = await prisma.tags.findFirst({
    where: {
      name,
    },
  });
  if (oldTag)
    return res.status(400).json({
      message: "Tag with this name already exists.",
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
  const tag = await prisma.tags.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return res.status(200).json(tag);
};
export default handler;
