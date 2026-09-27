import { Construction } from "lucide-react";
import { useEffect } from "react";
import { BottomTabBar, TABS } from "../components/BottomTabBar";
import { Screen } from "../components/Screen";
import { markHome } from "../state/homeHistory";
import { OrangeHeader } from "./Home";

export function TabPlaceholder({ path }: { path: string }) {
  useEffect(markHome, []);
  const tab = TABS.find((t) => t.path === path);
  return (
    <Screen bg="bg-itau-bg" statusTone="light" statusBg="bg-itau-orange" header={<OrangeHeader />} footer={<BottomTabBar />}>
      <div className="px-5 pt-[18px]">
        <h1 className="text-[18px] font-bold text-black">{tab?.label}</h1>
        <div className="mt-6 flex flex-col items-center rounded-[18px] bg-white px-6 py-12 text-center">
          <Construction size={36} color="#FF6200" strokeWidth={1.6} />
          <div className="mt-4 text-[17px] font-semibold text-[#3A3A3A]">Em construção</div>
          <div className="mt-1 text-[14px] text-[#666]">Esta área ainda não faz parte do protótipo.</div>
        </div>
      </div>
    </Screen>
  );
}
