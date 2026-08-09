"use client";


import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Empty, Spin } from "antd";
import { useEffect, useState } from "react";

import { AppHeader } from "@/components/AppHeader";

interface ShoeImage {
  name: string;
  src: string;
}

export default function ShoesPage() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<ShoeImage[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center min-h-screen">
        <Empty description="Brak zdjęć" />
      </div>
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
          {images.map((image) => (
            <div
              key={image.name}
              className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-slate-100 dark:bg-slate-800"
            >
              <Image
                src={image.src}
                alt={image.name}
                width={400}
                height={500}
                className="w-full h-auto object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}