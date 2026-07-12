"use client";

import { Avatar, Button, Dropdown, Layout, Switch, Typography } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useThemeMode } from "@/app/theme-provider";
import { LottoBall } from "./LottoBall";

const { Header } = Layout;
const { Text } = Typography;

export function AppHeader() {
  const { data: session } = useSession();
  const { mode, toggle } = useThemeMode();

  return (
    <Header
      className="!flex !items-center !justify-center !px-4 sm:!px-8 !border-b !border-slate-200 dark:!border-slate-800"
      style={{
        backgroundColor: mode === "dark" ? "#0f172a" : "#ffffff",
      }}
    >
      <div className="flex items-center justify-between w-full max-w-6xl">
        <div className="flex items-center gap-3">
          <LottoBall number={6} />
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Lotto Tracker
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Switch
            checked={mode === "dark"}
            onChange={toggle}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          {session?.user ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    label: "Wyloguj",
                    icon: <LogoutOutlined />,
                    onClick: () => signOut({ callbackUrl: "/login" }),
                  },
                ],
              }}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar icon={<UserOutlined />} size="small" />
                <Text className="hidden sm:inline dark:!text-slate-200">
                  {session.user.email}
                </Text>
              </div>
            </Dropdown>
          ) : (
            <Button icon={<LoginOutlined />} onClick={() => signIn()}>
              Zaloguj się
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
}