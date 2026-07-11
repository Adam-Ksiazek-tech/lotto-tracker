import { Layout, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <AntFooter className="!bg-transparent text-center py-6">
      <Text type="secondary" className="dark:!text-slate-500">
        AKCODE Adam Książek © {year}
      </Text>
    </AntFooter>
  );
}