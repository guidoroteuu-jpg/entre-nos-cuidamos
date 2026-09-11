import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/pages/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entre Nós | Bem-estar escolar inteligente" },
      { name: "description", content: "Cuidado emocional e prevenção ao bullying para toda a comunidade escolar." },
      { property: "og:title", content: "Entre Nós | Bem-estar escolar inteligente" },
      { property: "og:description", content: "Cuidado emocional e prevenção ao bullying para toda a comunidade escolar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});
