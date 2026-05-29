export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://conexporta.vercel.app/sitemap.xml",
  };
}
