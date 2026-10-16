import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPlaceholder({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const title = slug.at(-1)?.replaceAll("-", " ") ?? "workspace";
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-3xl capitalize">
          <Construction />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-5">
        <p className="text-muted-foreground">
          This Phase 1 shell is ready for the next CMS module. The dashboard is
          powered by isolated mock data only; no backend is connected.
        </p>
        <Link
          href="/admin"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft data-icon="inline-start" />
          Back to overview
        </Link>
      </CardContent>
    </Card>
  );
}
