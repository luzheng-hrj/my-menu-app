"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Relation, RelationIdentity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const identityOptions: RelationIdentity[] = [
  "爸爸",
  "妈妈",
  "闺蜜",
  "兄弟",
  "对象",
  "同事",
  "同学",
  "邻居",
  "其他"
];

export function RelationManager({
  relations,
  onAdd,
  onRemove
}: {
  relations: Relation[];
  onAdd: (relation: Relation) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState<RelationIdentity>("闺蜜");
  const [note, setNote] = useState("");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">关联好友</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 rounded-lg border bg-[hsl(var(--secondary))] p-3">
          <div className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-5"
              placeholder="姓名/昵称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="col-span-4"
              list="identity-options"
              placeholder="身份"
              value={identity}
              onChange={(e) => setIdentity((e.target.value || "其他") as RelationIdentity)}
            />
            <Input
              className="col-span-3"
              placeholder="备注(可选)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <datalist id="identity-options">
            {identityOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>

          <Button
            type="button"
            size="sm"
            className="w-full"
            onClick={() => {
              if (!name.trim()) return;
              onAdd({
                id: `rel-user-${Date.now()}`,
                name: name.trim(),
                identity,
                note: note.trim() || undefined
              });
              setName("");
              setIdentity("闺蜜");
              setNote("");
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> 添加关联
          </Button>
        </div>

        <div className="space-y-2">
          {relations.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border bg-white p-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {r.name} <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))]">{r.identity}</span>
                </p>
                {r.note ? <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{r.note}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => onRemove(r.id)}
                className="rounded-md border p-2 text-[hsl(var(--muted-foreground))]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
