"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@/redux/apis/address.api";
import type { Address } from "@/redux/apis/types/address.types";
import {
  addressFormSchema,
  type AddressFormValues,
} from "../_schemas/address.schema";

const emptyValues: AddressFormValues = {
  label: "",
  recipientName: "",
  recipientPhone: "",
  district: "",
  area: "",
  addressLine: "",
  postalCode: "",
  zone: "INSIDE_DHAKA",
  isDefault: false,
};

const toFormValues = (address: Address): AddressFormValues => ({
  label: address.label ?? "",
  recipientName: address.recipientName,
  recipientPhone: address.recipientPhone,
  district: address.district,
  area: address.area,
  addressLine: address.addressLine,
  postalCode: address.postalCode ?? "",
  zone: address.zone,
  isDefault: address.isDefault,
});

export default function useAddressBook() {
  const [editing, setEditing] = useState<Address | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Address | null>(null);
  const [addAddress, addState] = useAddAddressMutation();
  const [updateAddress, updateState] = useUpdateAddressMutation();
  const [deleteAddress, deleteState] = useDeleteAddressMutation();
  const {
    data: list = [],
    isLoading,
    isError,
    refetch,
  } = useGetAddressesQuery();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: emptyValues,
    mode: "onChange",
  });

  const closeForm = () => {
    setOpen(false);
    setEditing(null);
    form.reset(emptyValues);
  };

  const startNew = () => {
    setEditing(null);
    form.reset(emptyValues);
    setOpen(true);
  };

  const startEdit = (address: Address) => {
    setEditing(address);
    form.reset(toFormValues(address));
    setOpen(true);
  };

  const save = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      label: values.label || null,
      postalCode: values.postalCode || null,
    };

    try {
      if (editing) {
        await updateAddress({ id: editing.id, data: payload }).unwrap();
        toast.success("Address updated");
      } else {
        await addAddress(payload).unwrap();
        toast.success("Address added");
      }
      closeForm();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not save address"));
    }
  });

  const remove = async () => {
    if (!deleting) return;
    try {
      await deleteAddress(deleting.id).unwrap();
      toast.success("Address deleted");
      setDeleting(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not delete address"));
    }
  };

  const makeDefault = async (address: Address) => {
    if (address.isDefault) return;
    try {
      await updateAddress({
        id: address.id,
        data: { isDefault: true },
      }).unwrap();
      toast.success("Default address updated");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not set default address"));
    }
  };

  return {
    list,
    isLoading,
    isError,
    refetch,
    form,
    open,
    editing,
    startNew,
    startEdit,
    closeForm,
    save,
    isSaving: addState.isLoading || updateState.isLoading,
    deleting,
    setDeleting,
    remove,
    isDeleting: deleteState.isLoading,
    makeDefault,
  };
}
