import { prisma } from "@lib/db";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const tags = await prisma.tags.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return res.status(200).send(tags);
};
export default handler;
