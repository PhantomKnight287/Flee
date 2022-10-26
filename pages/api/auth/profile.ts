import { prisma } from "@lib/db";
import { verify } from "jsonwebtoken";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(204).end();
  let jwtPayload: { id: string; username: string };
  try {
    jwtPayload = (await verify(token, process.env.JWT_SECRET!)) as unknown as {
      id: string;
      username: string;
    };
  } catch {
    return res.status(403).json({
      message: "Invalid Auth Token",
    });
  }
  const user = await prisma.user.findFirst({
    where: {
      username: jwtPayload.username,
    },
    select: {
      username: true,
      id: true,
    },
  });
  if (!user)
    return res.status(404).json({
      message: "No user found with provided Auth Token",
    });
  return res.status(200).json(user);
};
export default handler;
