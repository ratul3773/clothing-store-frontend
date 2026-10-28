"use client"
import ProductDetail from '@/app/(store)/p/[slug]/_components/ProductDetail'
import { useParams, } from 'next/navigation';


export default function Page() {
  const params = useParams()
  const slug = params?.slug as string;
  return <ProductDetail slug={slug} />
}
