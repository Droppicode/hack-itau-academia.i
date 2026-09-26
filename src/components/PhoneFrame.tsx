import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center md:py-6">
      <div className="relative h-full w-full overflow-hidden bg-white md:h-[844px] md:max-h-[calc(100dvh-48px)] md:w-[390px] md:rounded-[48px] md:shadow-[0_0_0_10px_#111,0_20px_60px_rgba(0,0,0,.35)]">
        {children}
      </div>
    </div>
  );
}
