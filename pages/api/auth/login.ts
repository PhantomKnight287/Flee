import { compare } from "bcrypt";
import { NextApiHandler } from "next";
import { prisma } from "../../../lib/db";
import { sign } from "jsonwebtoken";

const handler: NextApiHandler = async (req, res) => {
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
  if (!user)
    return res.status(400).json({
      message: "No user found with provided username",
    });
  const isPasswordSame = await compare(password, user.password);
  if (isPasswordSame === false)
    return res.status(403).json({
      message: "Incorrect Password",
    });
  const token = sign(
    {
      username: user.username,
      id: user.id,
    },
    process.env.JWT_SECRET!
  );
  return res.status(200).json({
    token,
    username: user.username,
    id: user.id,
  });
};

export default handler;
