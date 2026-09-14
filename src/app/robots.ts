import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://girtz-wear.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/shop", "/product/"],
      disallow: ["/admin/", "/account/", "/auth/", "/order/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
