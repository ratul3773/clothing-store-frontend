import type { ContactErrors, ContactFields } from '@/app/(store)/contact/_types/contact.types'

export const EMPTY_CONTACT: ContactFields = { name: '', phone: '', email: '', subject: '', message: '' }

const PHONE = /^[0-9 +-]{10,15}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(f: ContactFields): ContactErrors {
  const e: ContactErrors = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!PHONE.test(f.phone.trim())) e.phone = 'Enter a valid mobile number (10–15 digits).'
  if (f.email.trim() && !EMAIL.test(f.email.trim())) e.email = 'That email address does not look right.'
  if (f.subject.trim().length < 3) e.subject = 'Add a short subject.'
  if (f.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).'
  return e
}
