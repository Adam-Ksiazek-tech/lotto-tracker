"use client";

import { Suspense, useState } from "react";
import { Button, Card, Divider, Form, Input, Typography, message } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const { Title, Text } = Typography;

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (!res || res.error) {
      message.error("Nieprawidłowy e-mail lub hasło");
      return;
    }
    window.location.href = res.url ?? callbackUrl;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <Title level={3} className="!mb-1">
          Lotto Tracker
        </Title>
        <Text type="secondary">Zaloguj się, żeby zobaczyć wyniki</Text>

        <Form layout="vertical" onFinish={onFinish} className="mt-6">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Podaj poprawny e-mail" }]}
          >
            <Input autoComplete="email" placeholder="ty@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Hasło"
            rules={[{ required: true, message: "Podaj hasło" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item className="!mb-2">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Zaloguj się
            </Button>
          </Form.Item>
        </Form>

        <Divider>lub</Divider>

        <Button
          icon={<GithubOutlined />}
          block
          onClick={() => signIn("github", { callbackUrl })}
        >
          Zaloguj przez GitHub
        </Button>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  // useSearchParams wymaga Suspense przy statycznym renderowaniu strony
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}