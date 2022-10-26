import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/db";

export default async function SignUpRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body;
  if (!username)
    return res.status(400).json({
      message: "Username wasn't provided",
    });
  if (!password)
    return res.status(400).json({
      message: "Password wasn't provided",
    });
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  if (user)
    return res.status(400).json({
      message: "A user with this username already exists",
    });
  const pass = await hash(password, 12);
  const newUser = await prisma.user.create({
    data: {
      password: pass,
      username,
    },
    select: {
      username: true,
      id: true,
    },
  });
  const token = sign(
    {
      username: newUser.username,
      id: newUser.id,
    },
    process.env.JWT_SECRET!
  );
  return res.status(200).json({
    token,
    username: newUser.username,
    id: newUser.id,
  });
}
