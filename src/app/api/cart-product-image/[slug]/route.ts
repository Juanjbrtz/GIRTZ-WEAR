import { NextResponse, type NextRequest } from "next/server";
import { getCatalogProductBySlug } from "@/lib/catalog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product?.image) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.redirect(new URL(product.image, request.url), 307);
}
