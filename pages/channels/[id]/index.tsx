import { useUser } from "@hooks/user";
import {
  Avatar,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons";
import axios from "axios";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DynamicChannelsPage() {
  const { query, isReady, asPath, push } = useRouter();
  const { username } = useUser();
  const [posts, setPosts] = useState<
    {
      id: string;
      User: {
        username: string;
      };
      title: string;
      upvotes: bigint;
      downvotes: bigint;
      slugifiedTitle: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchPosts = () => {
    setLoading(true);
    axios
      .get(`/api/channels/${query.id}`)
      .then((d) => d.data)
      .then((d) => {
        setPosts((old) => [...old, ...d]);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!query.id) return;
    fetchPosts();
  }, [isReady]);

  return (
    <>
    <Head>
      <title>
        All Posts
      </title>
    </Head>
      <div className="flex flex-col h-screen justify-center -z-10 ">
        <Container className="overflow-y-scroll">
          {loading === true ? (
            <Loader variant="bars" color="green" />
          ) : (
            <>
              {posts.length > 0 ? (
                <SimpleGrid
                  cols={4}
                  spacing="lg"
                  breakpoints={[
                    { maxWidth: 980, cols: 3, spacing: "md" },
                    { maxWidth: 755, cols: 2, spacing: "sm" },
                    { maxWidth: 600, cols: 1, spacing: "sm" },
                  ]}
                >
                  {posts.map((post) => (
                    <Paper
                      p="md"
                      withBorder
                      radius={"md"}
                      mt="xl"
                      className="cursor-pointer hover:scale-110 duration-[110ms]"
                      key={post.id}
                      onClick={() => {
                        push(
                          `/channels/${query.id}/post/${post.slugifiedTitle}`
                        );
                      }}
                    >
                      <Text size={"md"} className="font-bold">
                        {post.title}
                      </Text>
                      <Group position="left">
                        <Avatar
                          src={`https://avatars.dicebear.com/api/big-smile/${post.User.username}.svg`}
                          radius="xl"
                        />
                        <Text color="gray">{post.User.username}</Text>
                      </Group>
                      <Group position="center">
                        <div className="flex flex-row flex-wrap">
                          <>
                            {post.upvotes}
                            <IconArrowUp size={24} />
                          </>
                        </div>
                        <div className="flex flex-row flex-wrap">
                          <>
                            {post.downvotes}
                            <IconArrowDown size={24} />
                          </>
                        </div>
                      </Group>
                    </Paper>
                  ))}
                </SimpleGrid>
              ) : (
                "No Posts Found"
              )}
            </>
          )}
          <Group position="center" mt="xl" mb="xl">
            <Button
              color="dark"
              variant="filled"
              type="submit"
              className={clsx(
                "hover:scale-110 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
              )}
              loading={loading}
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
              onClick={() => {
                if (username) return push(`${asPath}/create`);
                return push("/auth");
              }}
            >
              Create New Post
            </Button>
          </Group>
        </Container>
      </div>
    </>
  );
}
