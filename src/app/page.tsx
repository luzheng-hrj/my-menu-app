"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BottomTabBar, HomeTab } from "@/components/bottom-tab-bar";
import { BuddyChatPanel } from "@/components/buddy-chat-panel";
import { CommunityDishPreview } from "@/components/community-dish-preview";
import { CreateDishForm } from "@/components/create-dish-form";
import { DishCard } from "@/components/dish-card";
import { MenuCard } from "@/components/menu-card";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RelationManager } from "@/components/relation-manager";
import { dishes as seedDishes } from "@/data/mock-data";
import { Dish } from "@/lib/types";
import { AppData, buildMenuWithDishes, ensureCustomMenu, loadAppData, saveAppData } from "@/lib/storage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<HomeTab>("community");
  const [communityOpenDishId, setCommunityOpenDishId] = useState<string | null>(null);
  const [data, setData] = useState<AppData>(() => ensureCustomMenu(loadAppData()));

  useEffect(() => {
    const normalized = ensureCustomMenu(data);
    saveAppData(normalized);
  }, [data]);

  const menuWithDishes = useMemo(
    () =>
      data.menus
        .map((menu) => buildMenuWithDishes(data, menu.id))
        .filter((menu): menu is NonNullable<ReturnType<typeof buildMenuWithDishes>> => Boolean(menu)),
    [data]
  );

  const communityFeed = useMemo(() => data.dishes.slice(0, 3), [data.dishes]);
  const favoriteDishes = useMemo(() => data.dishes.slice(0, 4), [data.dishes]);
  const communityOpenDish = useMemo(
    () => (communityOpenDishId ? data.dishes.find((dish) => dish.id === communityOpenDishId) ?? null : null),
    [communityOpenDishId, data.dishes]
  );

  const tabMeta: Record<HomeTab, { title: string; subtitle: string }> = {
    community: { title: "社区广场", subtitle: "看看大家今天都做了什么" },
    "my-menus": { title: "我的菜单", subtitle: "管理我的菜谱、菜单和分享集合" },
    upload: { title: "上传菜单", subtitle: "记录你的新菜品并自动收录到菜单" },
    buddies: { title: "我的饭搭子", subtitle: "和好友一起约饭、互相抄作业" },
    favorites: { title: "收藏与点赞", subtitle: "查看我标记的高分菜品" }
  };

  const handleCreateDish = (dish: Dish) => {
    setData((prev) => {
      const next = {
        ...prev,
        dishes: [dish, ...prev.dishes]
      };
      return ensureCustomMenu(next);
    });
    setActiveTab("my-menus");
  };

  return (
    <>
      <main className="mobile-shell space-y-4 pb-20">
        <MobileHeader title={tabMeta[activeTab].title} subtitle={tabMeta[activeTab].subtitle} />

        {activeTab === "community" ? (
          <section className="space-y-3">
            {communityOpenDish ? (
              <Card>
                <CardHeader className="pb-2">
                  <button
                    type="button"
                    onClick={() => setCommunityOpenDishId(null)}
                    className="text-sm text-[hsl(var(--muted-foreground))]"
                  >
                    ← 返回广场
                  </button>
                  <CardTitle className="text-base">菜品详情</CardTitle>
                </CardHeader>
                <CardContent>
                  <DishCard dish={communityOpenDish} />
                </CardContent>
              </Card>
            ) : (
              communityFeed.map((dish) => (
                <CommunityDishPreview key={dish.id} dish={dish} onOpen={() => setCommunityOpenDishId(dish.id)} />
              ))
            )}
          </section>
        ) : null}

        {activeTab === "my-menus" ? (
          <section className="space-y-4">
            <div className="space-y-3">
              <h2 className="text-base font-semibold">我的菜品</h2>
              {data.dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-semibold">我的菜单</h2>
              {menuWithDishes.map((menu) => (
                <MenuCard key={menu.id} name={menu.name} description={menu.description} dishes={menu.dishes} />
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-semibold">菜单集合与分享</h2>
              {data.collections.map((collection) => (
                <div key={collection.id} className="rounded-xl border bg-white p-4">
                  <p className="font-semibold">{collection.title}</p>
                  <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{collection.description}</p>
                  <div className="mt-3">
                    <Link href={`/share/${collection.shareSlug}`}>
                      <Button className="w-full">查看分享页</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "upload" ? <CreateDishForm onCreateDish={handleCreateDish} /> : null}

        {activeTab === "buddies" ? (
          <section className="space-y-3">
            <RelationManager
              relations={data.relations}
              onAdd={(relation) => setData((prev) => ({ ...prev, relations: [relation, ...prev.relations] }))}
              onRemove={(id) => setData((prev) => ({ ...prev, relations: prev.relations.filter((r) => r.id !== id) }))}
            />

            <BuddyChatPanel relations={data.relations} />
          </section>
        ) : null}

        {activeTab === "favorites" ? (
          <section className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">我点赞最多的菜品</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[hsl(var(--muted-foreground))]">
                当前共收藏 {favoriteDishes.length} 道菜，累计点赞 128 次。
              </CardContent>
            </Card>
            {favoriteDishes.length > 0
              ? favoriteDishes.map((dish) => <DishCard key={`fav-${dish.id}`} dish={dish} />)
              : seedDishes.map((dish) => <DishCard key={`seed-${dish.id}`} dish={dish} />)}
          </section>
        ) : null}
      </main>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
