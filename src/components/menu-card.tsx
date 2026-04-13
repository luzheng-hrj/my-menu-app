import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dish } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function MenuCard({
  name,
  description,
  dishes
}: {
  name: string;
  description: string;
  dishes: Dish[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{name}</CardTitle>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-medium">包含菜品（{dishes.length}）</p>
        <div className="flex flex-wrap gap-2">
          {dishes.map((dish) => (
            <Badge key={dish.id}>{dish.name}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
