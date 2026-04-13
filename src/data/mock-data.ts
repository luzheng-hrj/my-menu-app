import { Dish, Menu, MenuCollection } from "@/lib/types";

export const dishes: Dish[] = [
  {
    id: "dish-1",
    name: "番茄牛腩煲",
    coverImage:
      "https://images.unsplash.com/photo-1604909052743-94e838986d24?q=80&w=1200&auto=format&fit=crop",
    tags: ["家常", "炖煮"],
    ingredients: [
      { id: "ing-1", name: "牛腩", weight: 500, unit: "g" },
      { id: "ing-2", name: "番茄", weight: 350, unit: "g" },
      { id: "ing-3", name: "洋葱", weight: 100, unit: "g" },
      { id: "ing-4", name: "清水", weight: 800, unit: "ml" }
    ],
    steps: [
      { id: "step-1", title: "牛腩焯水", description: "冷水下锅，煮沸后捞出洗净。", durationMin: 8 },
      { id: "step-2", title: "炒香底料", description: "番茄和洋葱切块，中火翻炒至软烂。", durationMin: 6 },
      { id: "step-3", title: "炖煮", description: "加入牛腩和清水，小火慢炖 50 分钟。", durationMin: 50 }
    ]
  },
  {
    id: "dish-2",
    name: "香煎三文鱼",
    coverImage:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
    tags: ["低脂", "快手"],
    ingredients: [
      { id: "ing-5", name: "三文鱼", weight: 220, unit: "g" },
      { id: "ing-6", name: "柠檬", weight: 1, unit: "piece" },
      { id: "ing-7", name: "橄榄油", weight: 10, unit: "ml" }
    ],
    steps: [
      { id: "step-4", title: "预处理", description: "三文鱼擦干，撒盐胡椒静置 5 分钟。", durationMin: 5 },
      { id: "step-5", title: "煎制", description: "热锅少油，先皮面 3 分钟，再翻面 2 分钟。", durationMin: 5 },
      { id: "step-6", title: "调味", description: "挤柠檬汁即可出锅。", durationMin: 1 }
    ]
  },
  {
    id: "dish-3",
    name: "蒜香西兰花",
    coverImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    tags: ["素菜", "清炒"],
    ingredients: [
      { id: "ing-8", name: "西兰花", weight: 300, unit: "g" },
      { id: "ing-9", name: "蒜末", weight: 20, unit: "g" },
      { id: "ing-10", name: "食用油", weight: 8, unit: "ml" }
    ],
    steps: [
      { id: "step-7", title: "焯水", description: "西兰花焯水 1 分钟后捞出。", durationMin: 1 },
      { id: "step-8", title: "快炒", description: "蒜末爆香，下西兰花大火翻炒。", durationMin: 3 },
      { id: "step-9", title: "调味", description: "加少量盐，翻匀出锅。", durationMin: 1 }
    ]
  }
];

export const menus: Menu[] = [
  {
    id: "menu-1",
    name: "周末家庭餐",
    description: "适合 2-3 人的均衡午餐。",
    dishIds: ["dish-1", "dish-3"]
  },
  {
    id: "menu-2",
    name: "轻食工作日晚餐",
    description: "低负担、30 分钟内完成。",
    dishIds: ["dish-2", "dish-3"]
  }
];

export const collections: MenuCollection[] = [
  {
    id: "collection-1",
    title: "本周精选菜单集合",
    description: "包含家庭餐和轻食晚餐两套组合。",
    menuIds: ["menu-1", "menu-2"],
    shareSlug: "weekly-favorites",
    owner: "Luna"
  }
];

export const getDishById = (id: string) => dishes.find((dish) => dish.id === id);

export const getMenuWithDishes = (menuId: string) => {
  const menu = menus.find((m) => m.id === menuId);
  if (!menu) return null;
  const dishList = menu.dishIds.map((dishId) => getDishById(dishId)).filter(Boolean) as Dish[];
  return { ...menu, dishes: dishList };
};

export const getCollectionBySlug = (slug: string) => {
  const collection = collections.find((item) => item.shareSlug === slug);
  if (!collection) return null;
  const menuList = collection.menuIds
    .map((menuId) => getMenuWithDishes(menuId))
    .filter((menu): menu is NonNullable<ReturnType<typeof getMenuWithDishes>> => Boolean(menu));
  return { ...collection, menus: menuList };
};
