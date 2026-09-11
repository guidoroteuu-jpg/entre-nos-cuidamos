export const routeHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} | Entre Nós` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Entre Nós` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});