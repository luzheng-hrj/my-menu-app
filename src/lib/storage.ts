import { collections as defaultCollections, dishes as defaultDishes, menus as defaultMenus } from "@/data/mock-data";
import { Dish, Menu, MenuCollection, Relation } from "@/lib/types";

const STORAGE_KEY = "menu-mvp-data-v2";

export type AppData = {
  dishes: Dish[];
  menus: Menu[];
  collections: MenuCollection[];
  relations: Relation[];
};

const defaultData: AppData = {
  dishes: defaultDishes,
  menus: defaultMenus,
  collections: defaultCollections,
  relations: [
    { id: "rel-1", name: "小雨", identity: "闺蜜", note: "清淡党" },
    { id: "rel-2", name: "阿峰", identity: "兄弟", note: "爱炖菜" },
    { id: "rel-3", name: "Mia", identity: "同事", note: "便当搭子" }
  ]
};

export function loadAppData(): AppData {
  if (typeof window === "undefined") return defaultData;

  try {
    // Migration: v1 -> v2
    const rawV2 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as AppData;
      if (!parsed.dishes || !parsed.menus || !parsed.collections || !parsed.relations) return defaultData;
      return parsed;
    }

    const rawV1 = window.localStorage.getItem("menu-mvp-data-v1");
    if (!rawV1) return defaultData;
    const parsedV1 = JSON.parse(rawV1) as Omit<AppData, "relations">;
    if (!parsedV1.dishes || !parsedV1.menus || !parsedV1.collections) return defaultData;
    return { ...parsedV1, relations: defaultData.relations };
  } catch {
    return defaultData;
  }
}

export function saveAppData(data: AppData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function ensureCustomMenu(data: AppData): AppData {
  const customMenuId = "menu-custom";
  const customCollectionId = "collection-custom";
  const customShareSlug = "my-kitchen";

  const customMenuDishIds = data.dishes.map((dish) => dish.id);
  const customMenu: Menu = {
    id: customMenuId,
    name: "我的自定义菜单",
    description: "自动收录我新增的菜品。",
    dishIds: customMenuDishIds
  };

  const menusWithoutCustom = data.menus.filter((menu) => menu.id !== customMenuId);
  const nextMenus = [customMenu, ...menusWithoutCustom];

  const customCollection: MenuCollection = {
    id: customCollectionId,
    title: "我的私房菜单集合",
    description: "自动包含我的自定义菜单。",
    menuIds: [customMenuId],
    shareSlug: customShareSlug,
    owner: "我"
  };

  const collectionsWithoutCustom = data.collections.filter((collection) => collection.id !== customCollectionId);
  const nextCollections = [customCollection, ...collectionsWithoutCustom];

  return {
    ...data,
    menus: nextMenus,
    collections: nextCollections
  };
}

export function buildMenuWithDishes(data: AppData, menuId: string) {
  const menu = data.menus.find((item) => item.id === menuId);
  if (!menu) return null;

  const dishMap = new Map(data.dishes.map((dish) => [dish.id, dish]));
  const menuDishes = menu.dishIds
    .map((dishId) => dishMap.get(dishId))
    .filter((dish): dish is Dish => Boolean(dish));

  return {
    ...menu,
    dishes: menuDishes
  };
}

export function buildCollectionBySlug(data: AppData, slug: string) {
  const collection = data.collections.find((item) => item.shareSlug === slug);
  if (!collection) return null;

  const menuList = collection.menuIds
    .map((menuId) => buildMenuWithDishes(data, menuId))
    .filter((menu): menu is NonNullable<ReturnType<typeof buildMenuWithDishes>> => Boolean(menu));

  return {
    ...collection,
    menus: menuList
  };
}
