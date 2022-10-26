import { AppProps } from "next/app";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import "../styles/globals.css";
import { UserProvider } from "../context/user";
import { NotificationsProvider } from "@mantine/notifications";
import { HeaderMegaMenu } from "@components/header";
import { RouterTransition } from "@components/RouteTransition";
export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <UserProvider>
      <ColorSchemeProvider colorScheme={"light"} toggleColorScheme={() => {}}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "light",
          }}
        >
          <NotificationsProvider>
            <RouterTransition />
            <HeaderMegaMenu />
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </UserProvider>
  );
}
