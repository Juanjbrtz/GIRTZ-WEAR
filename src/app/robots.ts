import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://girtzwear.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/shop", "/product/"],
      disallow: ["/admin/", "/account/", "/auth/", "/order/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
