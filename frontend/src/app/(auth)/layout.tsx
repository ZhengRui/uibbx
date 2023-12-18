"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isPending, data: user } = useAuth();

  useEffect(() => {
    if (!isPending && !user) router.push("/");
  }, [user, isPending, router]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#f2f7ff]">
      {isPending || !user ? null : children}
    </div>
  );
}
