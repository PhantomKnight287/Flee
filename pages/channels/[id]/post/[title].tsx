import { GetFilteredHTML } from "@helpers/filter";
import { Avatar, Container, Group, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconArrowDown, IconArrowUp } from "@tabler/icons";
import axios from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PostPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { query } = useRouter();
  const [upvotes, setUpVotes] = useState(BigInt(props.upvotes));
  const [downvotes, setDownVotes] = useState(BigInt(props.downvotes));

  const upvote = () => {
    axios
      .post(`/api/channels/${query.id}/post/${query.title}/upvote`)
      .then(() => {
        setUpVotes((d) => d + BigInt(1));
        showNotification({
          message: "Thanks for Upvoting",
          color: "green",
        });
      })
      .catch((err) => {
        showNotification({
          message:
            err.response?.data?.message ||
            "An Error Occured while Upvoting this post, Please Try again later.",
        });
      });
  };
  const downvote = () => {
    axios
      .post(`/api/channels/${query.id}/post/${query.title}/downvote`)
      .then(() => {
        setDownVotes((d) => d + BigInt(1));
        showNotification({
          message: "Thanks for Downvoting",
          color: "green",
        });
      })
      .catch((err) => {
        showNotification({
          message:
            err.response?.data?.message ||
            "An Error Occured while Downvoting this post, Please Try again later.",
        });
      });
  };

  return (
    <div>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Container my="xl">
        <Title align="center" className="text-md">{props.title}</Title>
        <div className="flex flex-row flex-1 justify-center">
          <Group position="center" m="xl">
            <Avatar
              src={`https://avatars.dicebear.com/api/big-smile/${props.User.username}.svg`}
              radius="xl"
            />
            <Text>{props.User.username}</Text>
          </Group>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: GetFilteredHTML(props.content),
          }}
        ></div>
        <Group position="center">
          <div className="flex flex-row flex-wrap">
            <>
              {upvotes.toString()}
              <IconArrowUp
                size={24}
                className="cursor-pointer"
                onClick={upvote}
              />
            </>
          </div>
          <div className="flex flex-row flex-wrap">
            <>
              {downvotes.toString()}
              <IconArrowDown
                size={24}
                className="cursor-pointere"
                onClick={downvote}
              />
            </>
          </div>
        </Group>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  title: string;
  content: string;
  downvotes: bigint;
  upvotes: bigint;
  User: {
    username: string;
  };
}> = async (context) => {
  const { title, id } = context.params!;
  const data = await axios
    .get(
      `${process.env.NODE_ENV === "development" ? "http" : "https"}://${
        context.req.headers.host
      }/api/channels/${id}/post/${title}`
    )
    .catch((err) => null);
  if (data === null)
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  return {
    props: {
      ...data.data,
    },
  };
};
export default PostPage;
