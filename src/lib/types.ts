export type Ingredient = {
  id: string;
  name: string;
  weight: number;
  unit: "g" | "kg" | "ml" | "tbsp" | "tsp" | "piece";
};

export type CookingStep = {
  id: string;
  title: string;
  description: string;
  durationMin?: number;
};

export type Dish = {
  id: string;
  name: string;
  coverImage: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: CookingStep[];
};

export type Menu = {
  id: string;
  name: string;
  description: string;
  dishIds: string[];
};

export type MenuCollection = {
  id: string;
  title: string;
  description: string;
  menuIds: string[];
  shareSlug: string;
  owner: string;
};

export type RelationIdentity =
  | "爸爸"
  | "妈妈"
  | "闺蜜"
  | "兄弟"
  | "对象"
  | "同事"
  | "同学"
  | "邻居"
  | "其他";

export type Relation = {
  id: string;
  name: string;
  identity: RelationIdentity;
  note?: string;
};
