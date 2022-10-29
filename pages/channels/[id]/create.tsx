import { MetaTags } from "@components/Meta";
import {
  Button,
  Container,
  Group,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";

export default function CreatePostRoute() {
  const formState = useForm({
    initialValues: {
      content: "",
      title: "",
    },
  });
  const { query } = useRouter();
  const createPost = (e: typeof formState.values) => {
    const { content, title } = e;
    axios
      .post(
        `/api/channels/${query.id}/create`,
        {
          content,
          title,
          channelId: query.id,
        },
        {
          withCredentials: true,
        }
      )
      .then((d) => d.data)
      .then(() => {
        showNotification({
          message: "Post Created",
          color: "green",
        });
        formState.reset();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <>
      <MetaTags
        title="Create New Post"
        description="Create New Post to share it with People"
      />
      <Container mt="xl">
        <Title align="center">Create New Post</Title>
        <form onSubmit={formState.onSubmit((e) => createPost(e))}>
          <TextInput
            label="Title"
            placeholder="A Cool Title"
            required
            {...formState.getInputProps("title")}
          />
          <Textarea
            label="Content"
            placeholder="Write Something nice here"
            required
            autosize
            spellCheck={false}
            {...formState.getInputProps("content")}
          />
          <Group mt={"xl"} position="center">
            <Button
              color="dark"
              variant="filled"
              type="submit"
              className={
                "hover:scale-110 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
              }
              //   loading={loading}
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
            >
              Create
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
