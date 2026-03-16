import type { Book as UiBook } from "@/app/data/mock-data";

export type ApiBook = {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverUrl: string;
  totalCopies: number;
  availableCopies: number;
};

const genreColor: Record<string, string> = {
  fantasy: "#2C5F2D",
  "sci-fi": "#2C5F2D",
  technology: "#1E3A5F",
  mystery: "#8B4513",
  romance: "#D4AF37",
  drama: "#C19A6B",
  fiction: "#6B1F3D",
};

export function mapApiBookToUiBook(b: ApiBook): UiBook {
  const g = (b.genre || "").toLowerCase();
  return {
    id: String(b.id),
    title: b.title,
    author: b.author,
    tags: [g].filter(Boolean),
    genre: b.genre || "unknown",
    available: b.availableCopies ?? 0,
    total: b.totalCopies ?? 0,
    description: b.description || "",
    coverColor: genreColor[g] || "#8B6B47",
    reviews: [],
  };
}

