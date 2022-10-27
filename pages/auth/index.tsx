import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Button,
  Container,
  Title,
  Anchor,
  useMantineColorScheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { useUser, useUserDispatch } from "@hooks/user";
import { showNotification } from "@mantine/notifications";
import styles from "@styles/signup.module.css";
import Head from "next/head";
import axios from "axios";
import { createCookie, readCookie } from "@helpers/cookies";
import { User } from "@prisma/client";
import { clsx } from "clsx";
import { titleCase } from "@helpers/casing";

export default function SignUp() {
  const form = useForm({
    initialValues: {
      password: "",
      username: "",
    },

    validate: {
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
      username: (us) =>
        us.length > 1 ? null : "Username Must be of Min 1 Character",
    },
  });
  const user = useUser();
  const setUser = useUserDispatch();
  const { replace, query, push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useToggle([
    query.type || "login",
    ((query.type as string) || "login").toLowerCase() === "login"
      ? "signup"
      : "login",
  ]);

  useEffect(() => {
    if (user.id && readCookie("token")) return void replace("/channels");
  }, [user.id]);

  useEffect(() => {
    if (user.username) return void replace("/channels");
  }, []);
  useEffect(() => {
    const type = (query.type as string)?.toLowerCase();
    if (type !== "login" && type !== "signup")
      push({
        pathname: "/auth",
        query: {},
      });
  }, [query.type]);

  const handleFormSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const { password, username } = values;
    const data = await axios
      .post(formType === "signup" ? "/api/auth/signup" : "/api/auth/login", {
        password,
        username,
      })
      .catch((err) => {
        if (err && err.response) {
          showNotification({
            message: titleCase(
              err?.response?.data?.message || "An Error Occured"
            ),
            color: "red",
          });
        } else {
          showNotification({ message: "An Error Occured", color: "red" });
        }
        setLoading(false);
        return null;
      });
    if (data !== null) {
      createCookie("token", data.data.token, 30);
      const { id, username } = data.data as Partial<User>;
      setUser({
        type: "SetUser",
        payload: {
          username: username,
          id: id,
        },
      });
      showNotification({
        message: `Welcome ${username}`,
        color: "green",
        autoClose: 4000,
      });
      setLoading(false);
      return replace("/");
    }
  };
  const { colorScheme } = useMantineColorScheme();

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {formType === "login" ? "Welcome Back" : "Create An Account"}
        </title>
        <meta
          content={"Get Started by Creating an account or logging into one."}
          name="description"
        />
      </Head>

      <Container size={420} my={40}>
        {formType === "signup" ? (
          <>
            <Title
              align="center"
              sx={(theme) => ({
                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                fontWeight: 900,
              })}
            >
              Create An Account
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
              Already Have An Account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setFormType()}
              >
                Login
              </span>
            </Text>
          </>
        ) : (
          <>
            <Title
              align="center"
              sx={(theme) => ({
                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                fontWeight: 900,
              })}
            >
              Welcome Back!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
              Do Not Have An Account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setFormType()}
              >
                Create One
              </span>
            </Text>
          </>
        )}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((e) => handleFormSubmit(e))}>
            <TextInput
              label="Username"
              placeholder="JohnDoe123"
              required
              type={"text"}
              {...form.getInputProps("username")}
              onChange={(e) => {
                form.setFieldValue(
                  "username",
                  e.target.value.replace(" ", "").replace(/[^a-zA-Z0-9 ]/g, "")
                );
              }}
              mt="md"
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps("password")}
            />
            <Button
              fullWidth
              mt="xl"
              color="dark"
              variant="filled"
              type="submit"
              className={clsx("hover:scale-110 duration-[110ms]", {
                "bg-gray-900 hover:bg-black ": colorScheme === "dark",
                "text-white bg-blue-800  hover:bg-blue-500 ":
                  colorScheme === "light",
              })}
              loading={loading}
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
