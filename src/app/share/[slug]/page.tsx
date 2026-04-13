"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { dishes, menus, collections } from "@/data/mock-data";
import { DishCard } from "@/components/dish-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCollectionBySlug, ensureCustomMenu, loadAppData } from "@/lib/storage";

export default function ShareCollectionPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const collection = useMemo(() => {
    const localData = ensureCustomMenu(loadAppData());
    const localCollection = buildCollectionBySlug(localData, slug);
    if (localCollection) return localCollection;

    const fallbackData = { dishes, menus, collections, relations: [] };
    return buildCollectionBySlug(fallbackData, slug);
  }, [slug]);

  if (!collection) {
    return (
      <main className="mobile-shell">
        <Card>
          <CardHeader>
            <CardTitle>分享内容不存在</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">请检查链接是否正确。</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mobile-shell space-y-4 pb-8">
      <Card>
        <CardHeader className="pb-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">来自 {collection.owner} 的分享</p>
          <CardTitle>{collection.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{collection.description}</p>
        </CardContent>
      </Card>

      {collection.menus.map((menu) => (
        <section key={menu.id} className="space-y-3 rounded-xl border bg-white p-3">
          <div>
            <h2 className="text-base font-semibold">{menu.name}</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{menu.description}</p>
          </div>

          <div className="space-y-3">
            {menu.dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
