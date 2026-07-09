"use client";

import { Card, Layout, Typography } from "antd";
import { AppHeader } from "@/components/AppHeader";
import { LottoBall } from "@/components/LottoBall";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PLACEHOLDER_DRAW = [4, 12, 23, 29, 34, 41];

export default function Home() {
  return (
    <Layout className="min-h-screen !bg-slate-50 dark:!bg-slate-950">
      <AppHeader />
      <Content className="p-4 sm:p-8 max-w-3xl mx-auto w-full">
        <Card className="dark:!bg-slate-900 dark:!border-slate-800">
          <Title level={3} className="!mb-1 dark:!text-slate-100">
            Ostatnie losowanie
          </Title>
          <Text type="secondary">
            Przykładowe dane - podłączymy LOTTO OpenAPI w kolejnym kroku
          </Text>

          <div className="flex flex-wrap gap-3 mt-6">
            {PLACEHOLDER_DRAW.map((n) => (
              <LottoBall key={n} number={n} />
            ))}
          </div>

          <Paragraph className="mt-6 dark:!text-slate-300">
            Szkielet projektu działa w Dockerze, z AntD, Tailwindem, trybem
            ciemnym i logowaniem. Kolejny krok: pobieranie wyników z LOTTO
            OpenAPI i zapis do bazy.
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
}