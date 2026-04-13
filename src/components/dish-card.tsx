import Image from "next/image";
import { Dish } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-44 w-full">
        <Image src={dish.coverImage} alt={dish.name} fill className="object-cover" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{dish.name}</CardTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {dish.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-medium">食材与重量</p>
          <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
            {dish.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.name} - {ingredient.weight} {ingredient.unit}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">步骤</p>
          <ol className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
            {dish.steps.map((step, index) => (
              <li key={step.id}>
                {index + 1}. {step.title} - {step.description}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
