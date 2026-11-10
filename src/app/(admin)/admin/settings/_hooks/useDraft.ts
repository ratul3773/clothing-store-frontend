'use client'
import { useWatch } from "react-hook-form";

import { useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form'

/** Local editable copy of a settings slice with dirty detection and reset. */
export default function useDraft<T extends FieldValues>(source: T, resolver: Resolver<T>) {
  const form = useForm<T>({ defaultValues: structuredClone(source) as DefaultValues<T>, resolver })
  return { form, draft: useWatch({ control: form.control, compute: (values) => values }), dirty: form.formState.isDirty, reset: () => form.reset(structuredClone(source)) }
}
