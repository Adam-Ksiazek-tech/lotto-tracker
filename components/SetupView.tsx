"use client";

import { Card, Radio, Layout, Button, message } from "antd";
import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";
import { useState } from "react";

type ApiSource = "lottostats.pl" | "lotto.pl";

const { Content } = Layout;

export function SetupView() {
  const [selected, setSelected] = useState<ApiSource>("lottostats.pl");
  const [loading, setLoading] = useState(false);

   
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/api-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiSource: selected }),
      });

      if (!res.ok) {
        message.error("Nie udało się zapisać ustawień");
        return;
      }

      message.success("Ustawienia zapisane");
    } catch (error) {
      message.error("Błąd serwera");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen !bg-slate-50 dark:!bg-slate-950">
      <AppHeader />

      <Content className="max-w-2xl mx-auto w-full px-4 sm:px-8 py-8">
        <Card title="Ustawienia" className="dark:!bg-slate-900">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-slate-200">
                Wybierz źródło API
              </h3>

              <Radio.Group
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="space-y-4 flex flex-col"
              >
                <div className="border rounded-lg p-4 dark:border-slate-700">
                  <Radio value="lottostats.pl" className="dark:text-slate-200">
                    <div>
                      <div className="font-semibold">lottostats.pl</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Nieoficjalne API – bez wymagania klucza
                      </div>
                    </div>
                  </Radio>
                </div>

                <div className="border rounded-lg p-4 dark:border-slate-700">
                  <Radio value="lotto.pl" className="dark:text-slate-200">
                    <div>
                      <div className="font-semibold">lotto.pl</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Oficjalne API Loterii Polskiej
                      </div>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              Wybrane: <span className="font-semibold">{selected}</span>
            </div>

             <Button
              type="primary"
              size="large"
              onClick={handleSave}
              loading={loading}
            >
              Zapisz ustawienia
            </Button>

          </div>
        </Card>
      </Content>

      <Footer />
    </Layout>
  );
}