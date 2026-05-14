import { create } from "zustand";
import { apiFetch } from "@/services/api";

type Post = {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string;
  imagemUrl: string;
  imagemUrls?: string[];
  publicado: boolean;
  qtdeVisualizacoes?: number;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  autorId: string;
  autor: {
    id: string;
    nome: string;
    avatarUrl: string;
  };
  createdAt: string;
};

type Meta = {
  total: number;
  page: number;
  lastPage: number;
};

type CreatePostInput = {
  titulo: string;
  conteudo: string;
  imagemUrl?: string;
  imagemUrls?: string[];
  publicado: boolean;
  tags?: string[];
};

type FetchPublicPostsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  tagIds?: string[]; // Apenas IDs de tags para filtro
  publicado?: boolean;
};

type PostState = {
  posts: Post[];
  meta: Meta;
  loading: boolean;

  fetchPosts: () => Promise<void>;
  fetchPublicPosts: (opts?: FetchPublicPostsOptions) => Promise<void>;
  createPost: (data: FormData | CreatePostInput) => Promise<void>;
  updatePost: (id: string, data: any) => Promise<void>; // Any para suportar FormData ou Objeto
  deletePost: (id: string) => Promise<void>;
};

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  meta: { total: 0, page: 1, lastPage: 1 },
  loading: false,

  // Busca para o Painel Privado
  fetchPosts: async () => {
    set({ loading: true });
    const data = await apiFetch("/posts");
    set({
      posts: data.data,
      meta: data.meta,
      loading: false,
    });
  },

  // Busca para o Portal Público (com paginação)
  // Nota: Filtra posts por tagIds (IDs das tags) exclusivamente
  fetchPublicPosts: async (opts = {}) => {
    const { page = 1, limit = 9, search, tagIds, publicado } = opts as FetchPublicPostsOptions;

    set({ loading: true });

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    
    if (typeof search === "string" && search.trim()) {
      params.set("search", search.trim());
    }
    
    if (typeof publicado === "boolean") {
      params.set("publicado", String(publicado));
    }
    
    // Filtra exclusivamente por tagsId (não por tag objects)
    if (Array.isArray(tagIds) && tagIds.length > 0 && tagIds.every((id) => typeof id === "string")) {
      tagIds.forEach((id) => params.append("tagIds", id));
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const data = await apiFetch(`/posts/public${query}`);

    set({
      posts: data.data,
      meta: data.meta,
      loading: false,
    });
  },

  createPost: async (data) => {
    await apiFetch("/posts", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    await get().fetchPosts();
  },

  updatePost: async (id, data) => {
    await apiFetch(`/posts/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    await get().fetchPosts();
  },

  deletePost: async (id) => {
    await apiFetch(`/posts/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }));
  },
}));