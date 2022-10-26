import { useUserDispatch } from "@hooks/user";
import { Menu, Text } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconMessages,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export function LinksMenu({ children }: { children: ReactNode }) {
  const dispatch = useUserDispatch();
  const { push } = useRouter();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
          icon={<IconMessages size={14} />}
          onClick={() => push("/channels")}
        >
          Channels
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          onClick={() => {
            dispatch({ type: "Logout", payload: {} });
          }}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
