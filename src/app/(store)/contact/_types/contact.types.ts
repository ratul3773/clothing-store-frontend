export interface ContactFields {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactFields, string>>
