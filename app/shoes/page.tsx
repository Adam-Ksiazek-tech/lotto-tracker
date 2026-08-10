"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Empty, Spin, } from "antd";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { FileOutlined, DownloadOutlined } from "@ant-design/icons";

import { AppHeader } from "@/components/AppHeader";
import { useThemeMode } from "@/app/theme-provider";

interface ShoeImage {
  name: string;
  src: string;
}

export default function ShoesPage() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<ShoeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useThemeMode(); // ← Użyj globalnego theme

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/shoes");
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Błąd przy ładowaniu zdjęć:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchImages();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <>
        <AppHeader />
        <div className="flex justify-center items-center min-h-screen">
          <Empty description="Brak zdjęć" />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="p-4 sm:p-8 max-w-7xl mx-auto" suppressHydrationWarning>
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          Buty
        </h1>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((image) => {
            const isPDF = image.src.endsWith(".pdf");

            return (
              <div
                key={image.name}
                className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-slate-100 dark:bg-slate-800"
              >
                {isPDF ? (
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center p-4">
                  <a
                    href={image.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-64 bg-slate-200 dark:bg-slate-700 cursor-pointer"
                  >
                    <div className="pb-4">  
                      <FileOutlined style={{ color: mode === 'dark' ? '#fff' : '#000', fontSize: '28px' }} />
                    </div>
                    
                  </a>
                  
                      <embed
                        src={image.src}
                        type="application/pdf"
                        className="w-full h-full"
                      />
                </div>
                ) : (
                  <img
                    src={image.src}
                    alt={image.name}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}