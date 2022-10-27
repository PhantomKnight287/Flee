import { useUser } from "@hooks/user";
import {
  Button,
  Container,
  Group,
  Loader,
  Modal,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";

export default function AllChannels() {
  const [channels, setChannels] = useState<
    { id: string; posts: number; name: string }[]
  >([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchChannels = (s: number) => {
    setLoading(true);
    axios
      .get(`/api/channels?skip=${s}`)
      .then((d) => d.data)
      .then((d) => {
        if (d.data.length) setChannels(d.data);
        setSkip((d) => d + 10);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };
  const [newChannelModalOpen, setNewChannelModalOpened] = useState(false);
  const { id } = useUser();
  const { push } = useRouter();
  useEffect(() => {
    fetchChannels(skip);
  }, []);
  const formState = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (n) => (n.length === 0 ? "Name of channel is required" : null),
    },
  });

  const createChannel = (data: typeof formState.values) => {
    const { name } = data;
    axios
      .post(
        "/api/channels/create",
        {
          name,
        },
        { withCredentials: true }
      )
      .then((d) => d.data)
      .then((data) => {
        fetchChannels(skip);
        setNewChannelModalOpened(false);
        formState.reset();
      })
      .catch((err) => {
        showNotification({
          color: "red",
          message: err.response?.data?.message || "An Error Occured.",
        });
      });
  };

  return (
    <>
      <Head>
        <title>Channels</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen">
        {loading ? (
          <>
            <Loader variant="bars" color="green" />
          </>
        ) : (
          <>
            {channels.length > 0 ? (
              <Container
                p="xl"
                m="md"
                className="w-[100%] md:w-[35%] lg:w-[35%] xl:w-[35%] 2xl:w-[35%]"
              >
                <Title align="center" mb="xl">
                  Channels
                </Title>
                <Table
                  horizontalSpacing="xs"
                  verticalSpacing="xs"
                  fontSize="md"
                  width={""}
                >
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <Link
                            href={`/channels/${c.id}`}
                            className="text-blue-600 cursor-pointer"
                          >
                            {" "}
                            {c.name}
                          </Link>
                        </td>
                        <td>{c.posts}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {channels.length > 0 && channels.length % 10 === 0 ? (
                  <>
                    <Group position="center" my="xl">
                      <Button
                        color="dark"
                        variant="filled"
                        className={clsx(
                          "hover:scale-110 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
                        )}
                        loading={loading}
                        sx={(t) => ({
                          fontFamily: `Greycliff CF, ${t.fontFamily}`,
                        })}
                        onClick={() => {
                          fetchChannels(skip);
                        }}
                      >
                        Load More
                      </Button>
                    </Group>
                  </>
                ) : null}
                <Group position="center" mt="xl">
                  <Button
                    color="dark"
                    variant="filled"
                    className={clsx(
                      "hover:scale-110 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
                    )}
                    loading={loading}
                    sx={(t) => ({
                      fontFamily: `Greycliff CF, ${t.fontFamily}`,
                    })}
                    onClick={() => {
                      if (!id) return push("/auth");
                      setNewChannelModalOpened(true);
                    }}
                  >
                    Create New Channel
                  </Button>
                </Group>
              </Container>
            ) : (
              <Group position="center">
                <div className="flex flex-row items-center justify-center">
                  <Text mr="md">No Channels Found.</Text>
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
                      if (!id) return push("/auth");
                      setNewChannelModalOpened(true);
                    }}
                  >
                    Create One
                  </Button>
                </div>
              </Group>
            )}
          </>
        )}
      </div>
      <Modal
        onClose={() => setNewChannelModalOpened((o) => !o)}
        opened={newChannelModalOpen}
        title="Create New Channel"
        centered
      >
        <form onSubmit={formState.onSubmit((e) => createChannel(e))}>
          <TextInput
            label="Name"
            required
            placeholder="Lovely Channel"
            {...formState.getInputProps("name")}
          />
          <Button
            fullWidth
            mt="xl"
            color="dark"
            variant="filled"
            type="submit"
            className={clsx(
              "hover:scale-105 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
            )}
            loading={loading}
            sx={(t) => ({
              fontFamily: `Greycliff CF, ${t.fontFamily}`,
            })}
          >
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
}
