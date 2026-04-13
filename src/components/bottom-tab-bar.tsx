"use client";

import { Compass, Heart, PlusCircle, SquareMenu, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type HomeTab = "community" | "my-menus" | "upload" | "buddies" | "favorites";

const tabs: Array<{ key: HomeTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "community", label: "社区广场", icon: Compass },
  { key: "my-menus", label: "我的菜单", icon: SquareMenu },
  { key: "upload", label: "上传", icon: PlusCircle },
  { key: "buddies", label: "饭搭子", icon: Users },
  { key: "favorites", label: "收藏点赞", icon: Heart }
];

export function BottomTabBar({
  activeTab,
  onTabChange
}: {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white/95 px-2 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-[460px] items-end justify-between gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center rounded-lg px-1 py-1 text-[11px]",
                isActive ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              <Icon className={cn("mb-1 h-5 w-5", tab.key === "upload" ? "h-6 w-6" : "")} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
