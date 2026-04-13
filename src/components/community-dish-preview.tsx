import Image from "next/image";
import { Dish } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunityDishPreview({ dish, onOpen }: { dish: Dish; onOpen: () => void }) {
  const topIngredients = dish.ingredients.slice(0, 4);
  const moreCount = Math.max(0, dish.ingredients.length - topIngredients.length);

  return (
    <button type="button" onClick={onOpen} className="w-full text-left">
      <Card className="overflow-hidden">
        <div className="relative h-44 w-full">
          <Image src={dish.coverImage} alt={dish.name} fill className="object-cover" />
        </div>
        <CardHeader className="pb-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">@美食用户 分享了新菜品</p>
          <CardTitle className="text-base">{dish.name}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            {dish.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm font-medium">食材概览</p>
          <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
            {topIngredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.name} - {ingredient.weight} {ingredient.unit}
              </li>
            ))}
            {moreCount > 0 ? <li>… 还有 {moreCount} 种食材</li> : null}
          </ul>
          <p className="pt-1 text-sm text-[hsl(var(--primary))]">点击查看制作步骤</p>
        </CardContent>
      </Card>
    </button>
  );
}
