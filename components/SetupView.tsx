"use client";

import { Card, Radio, Layout } from "antd";
import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";
import { useState } from "react";

type ApiSource = "lottostats" | "developers";

const { Content } = Layout;

export function SetupView() {
  const [selected, setSelected] = useState<ApiSource>("lottostats");

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
                  <Radio value="lottostats" className="dark:text-slate-200">
                    <div>
                      <div className="font-semibold">lottostats.pl</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Publiczne API – bez wymagania klucza
                      </div>
                    </div>
                  </Radio>
                </div>

                <div className="border rounded-lg p-4 dark:border-slate-700">
                  <Radio value="developers" className="dark:text-slate-200">
                    <div>
                      <div className="font-semibold">developers.lotto.pl</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Oficjalne API Loterii Polskiej
                      </div>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              Wybrane: <span className="font-semibold">{selected === "lottostats" ? "lottostats.pl" : "developers.lotto.pl"}</span>
            </div>
          </div>
        </Card>
      </Content>

      <Footer />
    </Layout>
  );
}