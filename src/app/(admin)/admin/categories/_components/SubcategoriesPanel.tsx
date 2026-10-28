"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import AlertDialogText from "@/components/common/Alert-Dialogue";
import { Btn, Input } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAdminCategoriesQuery, useUpdateCategoryMutation } from "@/redux/apis/category.api";
import type { Category } from "@/redux/apis/types/category.types";

export default function SubcategoriesPanel({ parent }: { parent: Category }) {
  const { toast, toastError } = useStore();
  const { data: categories, isLoading, isError, error, refetch } = useGetAdminCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [subName, setSubName] = useState('');
  const [err, setErr] = useState<string>();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const [target, setTarget] = useState<Category | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const subCategories = categories?.filter((cat) => cat.parentId === parent.id) ?? [];

  const validateName = (name: string, excludeId?: string) => {
    if (!name.trim()) return 'Subcategory name is required';
    const trimmed = name.trim();
    if (trimmed.length > 100) return 'Name must be 100 characters or fewer';
    const exists = subCategories.some(
      (cat) => cat.name.toLowerCase() === trimmed.toLowerCase() && cat.id !== excludeId,
    );
    if (exists) return 'A subcategory with this name already exists';
    return undefined;
  };

  const addSub = async () => {
    const validationError = validateName(subName);
    setErr(validationError || undefined);
    if (validationError) return;

    try {
      await createCategory({
        name: subName.trim(),
        parentId: parent.id,
        isActive: true,
      }).unwrap();
      toast('Subcategory added');
      setSubName('');
    } catch (error) {
      toastError(apiErrorMessage(error, 'Failed to add subcategory'));
    }
  };

  const renameSub = async (sub: Category) => {
    const validationError = validateName(draftName, sub.id);
    if (validationError) return setMsg(validationError);

    if (draftName.trim() === sub.name) {
      setEditingId(null);
      return;
    }

    try {
      await updateCategory({
        id: sub.id,
        data: {
          name: draftName.trim(),
        },
      }).unwrap();
      toast('Subcategory renamed');
      setEditingId(null);
      setMsg(null);
    } catch (error) {
      const errorMessage = apiErrorMessage(error, 'Failed to rename subcategory');
      if (errorMessage.includes('conflict')) {
        toastError('Subcategory was modified by another request. Reload and try again.');
        refetch();
      } else {
        toastError(errorMessage);
      }
    }
  };

  const deleteSub = async () => {
    if (!target) return;
    try {
      const result = await deleteCategory(target.id).unwrap();
      if (result.archived) {
        toast('Subcategory archived because products still reference it.');
      } else {
        toast('Subcategory deleted.');
      }
      setTarget(null);
    } catch (error) {
      const errorMessage = apiErrorMessage(error, 'Failed to delete subcategory');
      if (errorMessage.includes('active products') || errorMessage.includes('conflict')) {
        setMsg(errorMessage);
      } else {
        toastError(errorMessage);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            placeholder="New subcategory name"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSub()}
            disabled={isCreating}
          />
          {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
        </div>
        <Btn
          variant="primary"
          onClick={addSub}
          disabled={isCreating || !subName.trim()}
        >
          <Plus className="size-4" /> Add
        </Btn>
      </div>

      {msg && (
        <div className="mt-2 rounded bg-red-50 px-2 py-1.5 text-xs text-red-700">
          {msg}
        </div>
      )}

      <ul className="mt-3 divide-y divide-border rounded-md border border-border">
        {subCategories.map((sub) => (
          <li key={sub.id} className="flex items-center gap-2 px-3 py-1.5 text-[13px]">
            {editingId === sub.id ? (
              <>
                <Input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && renameSub(sub)}
                  className="h-7"
                  disabled={isUpdating}
                />
                <Btn
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="Save"
                  onClick={() => renameSub(sub)}
                  disabled={isUpdating}
                >
                  <Check className="size-3.5" />
                </Btn>
                <Btn
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="Cancel"
                  onClick={() => {
                    setEditingId(null);
                    setMsg(null);
                  }}
                  disabled={isUpdating}
                >
                  <X className="size-3.5" />
                </Btn>
              </>
            ) : (
              <>
                <span className="flex-1">{sub.name}</span>
                <span className="text-xs text-muted-foreground">
                  {sub.productCount} product{sub.productCount === 1 ? '' : 's'}
                </span>
                <Btn
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="Rename"
                  onClick={() => {
                    setEditingId(sub.id);
                    setDraftName(sub.name);
                    setMsg(null);
                  }}
                  disabled={isUpdating || isCreating}
                >
                  <Pencil className="size-3.5" />
                </Btn>
                <Btn
                  size="icon"
                  variant="ghost"
                  className="size-7 text-red-600"
                  aria-label="Delete"
                  onClick={() => {
                    const count = sub.productCount;
                    if (count > 0) {
                      setMsg(
                        `Cannot delete "${sub.name}": ${count} product${
                          count === 1 ? '' : 's'
                        } still use it. Reassign them first.`,
                      );
                    } else {
                      setTarget(sub);
                      setMsg(null);
                    }
                  }}
                  disabled={isDeleting || isUpdating || isCreating}
                >
                  <Trash2 className="size-3.5" />
                </Btn>
              </>
            )}
          </li>
        ))}
        {subCategories.length === 0 && (
          <li className="px-3 py-6 text-center text-xs text-muted-foreground">
            No subcategories yet.
          </li>
        )}
      </ul>

      <AlertDialogText
        mode="normal"
        open={!!target}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Delete subcategory?"
        description={`"${target?.name}" will be permanently deleted.`}
        actionType="delete"
        confirmButtonText="Delete subcategory"
        disabled={isDeleting}
        onConfirm={deleteSub}
      />
    </div>
  );
}