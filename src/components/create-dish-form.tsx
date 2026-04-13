"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Camera, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dish, Ingredient } from "@/lib/types";

type CreateDishFormProps = {
  onCreateDish: (dish: Dish) => void;
};

type IngredientDraft = {
  name: string;
  weight: string;
  unit: Ingredient["unit"];
};

type StepDraft = {
  title: string;
  description: string;
  durationMin: string;
};

const fallbackCover =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop";

const defaultIngredient: IngredientDraft = { name: "", weight: "", unit: "g" };
const defaultStep: StepDraft = { title: "", description: "", durationMin: "" };

export function CreateDishForm({ onCreateDish }: CreateDishFormProps) {
  const [name, setName] = useState("");
  const [tagsText, setTagsText] = useState("家常");
  const [ingredientDrafts, setIngredientDrafts] = useState<IngredientDraft[]>([{ ...defaultIngredient }]);
  const [stepDrafts, setStepDrafts] = useState<StepDraft[]>([{ ...defaultStep }]);
  const [coverImage, setCoverImage] = useState(fallbackCover);

  const handleUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    const ingredients = ingredientDrafts
      .filter((item) => item.name.trim())
      .map((item, index) => ({
        id: `ing-user-${Date.now()}-${index}`,
        name: item.name.trim(),
        weight: Number(item.weight) || 0,
        unit: item.unit
      }));

    const steps = stepDrafts
      .filter((item) => item.description.trim() || item.title.trim())
      .map((item, index) => ({
        id: `step-user-${Date.now()}-${index}`,
        title: item.title.trim() || `步骤 ${index + 1}`,
        description: item.description.trim() || "待补充",
        durationMin: item.durationMin ? Number(item.durationMin) : undefined
      }));

    const dish: Dish = {
      id: `dish-user-${Date.now()}`,
      name: name.trim(),
      coverImage,
      tags: tagsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      ingredients,
      steps
    };

    onCreateDish(dish);

    setName("");
    setTagsText("家常");
    setIngredientDrafts([{ ...defaultIngredient }]);
    setStepDrafts([{ ...defaultStep }]);
    setCoverImage(fallbackCover);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>新增菜品（结构化录入）</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">菜品名称</label>
            <Input placeholder="例如：番茄炒蛋" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">标签（逗号分隔）</label>
            <Input placeholder="家常, 快手" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">上传图片</label>
            <div className="flex items-center gap-2 rounded-md border border-dashed bg-[hsl(var(--secondary))] p-3">
              <Camera className="h-4 w-4" />
              <Input type="file" accept="image/*" onChange={handleUploadImage} />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border bg-[hsl(var(--secondary))] p-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">食材清单</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIngredientDrafts((prev) => [...prev, { ...defaultIngredient }])}
              >
                <Plus className="mr-1 h-4 w-4" /> 添加食材
              </Button>
            </div>
            {ingredientDrafts.map((item, index) => (
              <div key={`ingredient-${index}`} className="grid grid-cols-12 gap-2 rounded-md bg-white p-2">
                <Input
                  className="col-span-5"
                  placeholder="食材名称"
                  value={item.name}
                  onChange={(e) => {
                    const next = [...ingredientDrafts];
                    next[index].name = e.target.value;
                    setIngredientDrafts(next);
                  }}
                />
                <Input
                  className="col-span-3"
                  type="number"
                  min="0"
                  placeholder="重量"
                  value={item.weight}
                  onChange={(e) => {
                    const next = [...ingredientDrafts];
                    next[index].weight = e.target.value;
                    setIngredientDrafts(next);
                  }}
                />
                <Input
                  className="col-span-3"
                  list="unit-options"
                  placeholder="单位"
                  value={item.unit}
                  onChange={(e) => {
                    const next = [...ingredientDrafts];
                    next[index].unit = (e.target.value || "g") as Ingredient["unit"];
                    setIngredientDrafts(next);
                  }}
                />
                <button
                  type="button"
                  className="col-span-1 rounded-md border text-[hsl(var(--muted-foreground))]"
                  onClick={() => {
                    setIngredientDrafts((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
                  }}
                >
                  <Trash2 className="mx-auto h-4 w-4" />
                </button>
              </div>
            ))}
            <datalist id="unit-options">
              <option value="g" />
              <option value="kg" />
              <option value="ml" />
              <option value="tbsp" />
              <option value="tsp" />
              <option value="piece" />
            </datalist>
          </div>

          <div className="space-y-2 rounded-lg border bg-[hsl(var(--secondary))] p-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">做菜步骤</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setStepDrafts((prev) => [...prev, { ...defaultStep }])}
              >
                <Plus className="mr-1 h-4 w-4" /> 添加步骤
              </Button>
            </div>
            {stepDrafts.map((item, index) => (
              <div key={`step-${index}`} className="space-y-2 rounded-md bg-white p-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">步骤 {index + 1}</span>
                  <button
                    type="button"
                    className="ml-auto rounded-md border px-2 py-1 text-xs text-[hsl(var(--muted-foreground))]"
                    onClick={() => {
                      setStepDrafts((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
                    }}
                  >
                    删除
                  </button>
                </div>
                <Input
                  placeholder="步骤标题（如：热锅）"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...stepDrafts];
                    next[index].title = e.target.value;
                    setStepDrafts(next);
                  }}
                />
                <Input
                  placeholder="步骤描述（如：中火下油，30秒后放蒜）"
                  value={item.description}
                  onChange={(e) => {
                    const next = [...stepDrafts];
                    next[index].description = e.target.value;
                    setStepDrafts(next);
                  }}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="时长（分钟，可选）"
                  value={item.durationMin}
                  onChange={(e) => {
                    const next = [...stepDrafts];
                    next[index].durationMin = e.target.value;
                    setStepDrafts(next);
                  }}
                />
              </div>
            ))}
          </div>

          <Button className="w-full" type="submit">
            保存菜品
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
