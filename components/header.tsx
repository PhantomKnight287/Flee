import {
  createStyles,
  Header,
  Group,
  Button,
  Text,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  useMantineColorScheme,
  Avatar,
} from "@mantine/core";
import { createAvatar } from "@dicebear/avatars";
import * as styles from "@dicebear/open-peeps";
import { useDisclosure } from "@mantine/hooks";

import { clsx } from "clsx";
import { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@hooks/user";
import { useState } from "react";
import { LinksMenu } from "./menu";
import { useRefetchProfile } from "@hooks/useRefetchprofile";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  useRefetchProfile();
  const { classes, theme } = useStyles();
  const avatar = useMemo(() => {
    return createAvatar(styles, {
      dataUri: true,
      size: 128,
    });
  }, []);
  const { colorScheme } = useMantineColorScheme();
  const { push } = useRouter();
  const { username } = useUser();

  return (
    <Box>
      <Header zIndex={9999} sx={{ position: "sticky" }} height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Link href="/" legacyBehavior>
            <div className="flex flex-row items-center">
              <Avatar src={avatar} size={"lg"} className="cursor-pointer" />
              <Text
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                })}
                className="font-bold text-xl"
              >
                Flee
              </Text>
            </div>
          </Link>

          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link
              href="/"
              className={`${classes.link} ${username ? "opacity-0" : ""}`}
            >
              Home
            </Link>
          </Group>

          <Group
            className={`${classes.hiddenMobile} ${username ? "hidden" : ""}`}
          >
            <Button
              color="dark"
              variant="filled"
              type="submit"
              className={clsx("hover:scale-110 duration-[110ms]", {
                "bg-gray-900 hover:bg-black ": colorScheme === "light",
                "text-white bg-blue-800  hover:bg-blue-500 ":
                  colorScheme === "dark",
              })}
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
              onClick={() => {
                push("/auth?type=login");
              }}
            >
              Login
            </Button>
            <Button
              color="dark"
              variant="filled"
              type="submit"
              className={clsx("hover:scale-110 duration-[110ms]", {
                "bg-gray-900 hover:bg-black ": colorScheme === "dark",
                "text-white bg-blue-800  hover:bg-blue-500 ":
                  colorScheme === "light",
              })}
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
              onClick={() => {
                push("/auth?type=signup");
              }}
            >
              Sign Up
            </Button>
          </Group>
          <Group
            className={`${classes.hiddenMobile} ${!username ? "hidden" : ""}`}
          >
            <LinksMenu>
              <Avatar
                src={`https://avatars.dicebear.com/api/big-smile/${username}.svg`}
                className="cursor-pointer"
              />
            </LinksMenu>
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={`${classes.hiddenDesktop} ${username ? "hidden" : ""}`}
          />
          <LinksMenu>
            <Burger
              opened={false}
              className={`${classes.hiddenDesktop} ${
                !username ? "hidden" : ""
              }`}
            />
          </LinksMenu>
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <Link
            href="/"
            className={`${classes.link} ${username ? "opacity-0" : ""}`}
          >
            Home
          </Link>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group
            position="center"
            grow
            pb="xl"
            px="md"
            className={clsx({
              hidden: username,
            })}
          >
            <Button
              color="dark"
              variant="filled"
              type="submit"
              className={clsx("hover:scale-110 duration-[110ms]", {
                "bg-gray-900 hover:bg-black ": colorScheme === "dark",
                "text-white bg-blue-800  hover:bg-blue-500 ":
                  colorScheme === "light",
              })}
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
              onClick={() => {
                push("/auth?type=login");
              }}
            >
              Login
            </Button>
            <Button
              color="dark"
              variant="filled"
              type="submit"
              className={clsx("hover:scale-110 duration-[110ms]", {
                "bg-gray-900 hover:bg-black ": colorScheme === "dark",
                "text-white bg-blue-800  hover:bg-blue-500 ":
                  colorScheme === "light",
              })}
              sx={(t) => ({
                fontFamily: `Greycliff CF, ${t.fontFamily}`,
              })}
              onClick={() => {
                push("/auth?type=login");
              }}
            >
              Sign Up
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
