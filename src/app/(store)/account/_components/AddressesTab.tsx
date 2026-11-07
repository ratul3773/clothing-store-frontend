"use client";

import { AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddressCard from "@/app/(store)/account/_components/AddressCard";
import AddressFormSheet from "@/app/(store)/account/_components/AddressFormSheet";
import useAddressBook from "@/app/(store)/account/_hooks/useAddressBook";
import AlertDialogText from "@/components/common/Alert-Dialogue";

export default function AddressesTab() {
  const book = useAddressBook();

  if (book.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-52" />
        ))}
      </div>
    );
  }

  if (book.isError) {
    return (
      <div role="alert" className="space-y-3 py-10 text-center">
        <p className="text-muted-foreground">
          Could not load your saved addresses.
        </p>
        <Button size="sm" onClick={() => void book.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="label-mono text-muted-foreground">
          {book.list.length} saved
        </p>
        <Button size="sm" variant="accent" onClick={book.startNew}>
          <Plus size={14} /> Add address
        </Button>
      </div>
      {book.list.length === 0 && (
        <p className="py-10 text-muted-foreground">
          No saved addresses. Add one to speed up checkout.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {book.list.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => book.startEdit(address)}
              onMakeDefault={() => void book.makeDefault(address)}
              onDelete={() => book.setDeleting(address)}
              isLoading={book.isSaving}
              isDeleting={book.isDeleting}
            />
          ))}
        </AnimatePresence>
      </div>
      <AddressFormSheet
        open={book.open}
        onOpenChange={(open) => !open && book.closeForm()}
        form={book.form}
        editing={!!book.editing}
        isSaving={book.isSaving}
        onSubmit={book.save}
      />

      <AlertDialogText
        open={!!book.deleting}
        onOpenChange={(open) => !open && book.setDeleting(null)}
        title="Delete Address"
        description="Are you sure you want to delete this address?"
        onConfirm={() => void book.remove()}
        onCancel={() => book.setDeleting(null)}
      />
    </>
  );
}
