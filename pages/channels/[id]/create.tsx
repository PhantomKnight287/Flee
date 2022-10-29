import { MetaTags } from "@components/Meta";
import { titleCase } from "@helpers/casing";
import { readCookie } from "@helpers/cookies";
import {
  Button,
  ColorInput,
  ColorPicker,
  Container,
  Group,
  Modal,
  MultiSelect,
  NativeSelect,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CreatePostRoute() {
  const formState = useForm({
    initialValues: {
      content: "",
      title: "",
      tags: [],
    },
  });
  const { query } = useRouter();
  const [tags, setTags] = useState<
    { id: string; name: string; color: string }[]
  >([]);
  const createPost = (e: typeof formState.values) => {
    const { content, title, tags } = e;
    axios
      .post(
        `/api/channels/${query.id}/create`,
        {
          content,
          title,
          channelId: query.id,
          tags,
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

  function fetchTags() {
    axios
      .get("/api/tags")
      .then((d) => d.data)
      .then(setTags)
      .catch((err) => {
        showNotification({
          color: "red",
          message: titleCase(
            err.response?.data?.message ||
              "An Error Occured while fetching Tags"
          ),
        });
      });
  }
  const tagFormState = useForm({
    initialValues: {
      name: "",
    },
  });
  useEffect(() => {
    fetchTags();
  }, []);

  const [createNewTagModalOpened, setCreateNewTagModalOpened] = useState(false);

  function createNewTag(e: typeof tagFormState.values) {
    const cookie = readCookie("token");
    if (!cookie)
      return showNotification({
        message: "No Authentication Token found",
        color: "red",
      });
    axios
      .post("/api/tags/create", e, { withCredentials: true })
      .then((d) => d.data)
      .then(() => {
        setCreateNewTagModalOpened((o) => !o);
        fetchTags();
      })
      .catch((err) => {
        showNotification({
          color: "red",
          message: titleCase(
            err.response?.data?.message ||
              "An Error Occured while fetching Tags"
          ),
        });
      });
  }

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
          {tags.length > 0 ? (
            <>
              <MultiSelect
                data={tags.map((t) => ({ value: t.id, label: t.name }))}
                {...formState.getInputProps("tags")}
                mb="xl"
                // mt="sm"
                label="Tags"
              />
            </>
          ) : null}
          <Group mt={"xl"} position="center">
            <Button
              color="dark"
              variant="filled"
              type="submit"
              className={
                "hover:scale-110 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
              }
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
            >
              Create
            </Button>
            <Button
              color="dark"
              variant="filled"
              type="button"
              className={
                "hover:scale-110 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
              }
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
              onClick={() => setCreateNewTagModalOpened((o) => !o)}
            >
              Create New Tag
            </Button>
          </Group>
        </form>
        <Modal
          centered
          onClose={() => setCreateNewTagModalOpened((o) => !o)}
          opened={createNewTagModalOpened}
        >
          <form onSubmit={tagFormState.onSubmit((d) => createNewTag(d))}>
            <TextInput
              label="Name"
              required
              placeholder="Tag"
              {...tagFormState.getInputProps("name")}
            />
            <Group mt={"xl"} position="center">
              <Button
                color="dark"
                variant="filled"
                type="submit"
                className={
                  "hover:scale-110 duration-[110ms] text-white bg-blue-800  hover:bg-blue-500 "
                }
                sx={(t) => ({
                  fontFamily: `Greycliff CF, ${t.fontFamily}`,
                })}
              >
                Create
              </Button>
            </Group>
          </form>
        </Modal>
      </Container>
    </>
  );
}
