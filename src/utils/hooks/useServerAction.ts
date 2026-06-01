"use client";

import { useRouter } from "next/navigation";
import type { ResponseData } from "@/utils/interfaces";

export function useServerAction() {
  const router = useRouter();

  return async <T extends ResponseData>(action: Promise<T>): Promise<T> => {
    const result = await action;
    if (result.error) router.refresh();
    return result;
  };
}
