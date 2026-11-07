export type DeliveryZone = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

export interface Address {
  id: string;
  label: string | null;
  recipientName: string;
  recipientPhone: string;
  district: string;
  area: string;
  addressLine: string;
  postalCode: string | null;
  zone: DeliveryZone;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  label?: string | null;
  recipientName: string;
  recipientPhone: string;
  district: string;
  area: string;
  addressLine: string;
  postalCode?: string | null;
  zone: DeliveryZone;
  isDefault?: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;
