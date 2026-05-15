"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Newspaper,
  Clock,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Heart,
} from "lucide-react";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

type PostDetail = {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string;
  imagemUrl: string;
  imagemUrls?: string[];
  publicado: boolean;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  autorId: string;
  autor?: {
    id: string;
    nome: string;
    avatarUrl: string;
    bio?: string;
  };
  createdAt: string;
};

const getPostImages = (post: PostDetail | null) => {
  if (!post) return [] as string[];

  const fromArray = Array.isArray(post.imagemUrls) ? post.imagemUrls : [];
  const candidates = [...fromArray, post.imagemUrl]
    .map((url) => String(url || "").trim())
    .filter(Boolean);

  return Array.from(new Set(candidates));
};

export default function NoticiaDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();

  const postId = useMemo(() => {
    const value = params?.id;
    if (Array.isArray(value)) {
      return value[0] || "";
    }
    return typeof value === "string" ? value : "";
  }, [params]);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const postImages = getPostImages(post);
const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [post?.id]);

  const handleCopy = async () => {
  try {
    // Captura a URL da janela do navegador
    await navigator.clipboard.writeText(window.location.href);
    
    // Ativa o toast e o remove após 3 segundos
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  } catch (err) {
    console.error("Falha ao copiar link:", err);
  }
};

  const authorProfileId = post?.autor?.id || post?.autorId || "";
  const authorProfileHref = authorProfileId
    ? `/perfil/${authorProfileId}`
    : null;

  useEffect(() => {
    if (!postId) {
      return;
    }

    let active = true;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      const endpoints = [`/posts/public/${postId}`, `/posts/${postId}`];

      for (const endpoint of endpoints) {
        try {
          const response = await apiFetch(endpoint);
          const payload = response?.data ?? response;

          if (payload?.id) {
            if (active) {
              setPost(payload as PostDetail);
              setLoading(false);
            }
            return;
          }
        } catch {
          // Tenta o próximo endpoint se der 404/403
        }
      }

      if (active) {
        setError("Não foi possível carregar a reportagem.");
        setLoading(false);
      }
    };

    void fetchPost();

    const fetchLikes = async () => {
      try {
        const response = await apiFetch(`/posts/${postId}/likes`);
        const total = Number(response?.likes ?? response?.total ?? 0);
        if (active) {
          setLikesCount(Number.isFinite(total) ? total : 0);
        }
      } catch {
        if (active) {
          setLikesCount(0);
        }
      }
    };

    void fetchLikes();

    return () => {
      active = false;
    };
  }, [postId]);

  useEffect(() => {
    if (!postId) return;

    const storageKey = `post-like:${postId}:${user?.id || "anonymous"}`;
    setLiked(window.localStorage.getItem(storageKey) === "1");
  }, [postId, user?.id]);

  const getLikeStorageKey = () => `post-like:${postId}:${user?.id || "anonymous"}`;

  const persistLikeState = (value: boolean) => {
    const storageKey = getLikeStorageKey();
    if (value) {
      window.localStorage.setItem(storageKey, "1");
    } else {
      window.localStorage.removeItem(storageKey);
    }
    setLiked(value);
  };

  const handleLike = async () => {
    if (!postId || liking) return;

    setLiking(true);
    try {
      if (liked) {
        await apiFetch("/posts/like", {
          method: "DELETE",
          body: JSON.stringify({ postId, userId: user?.id }),
        });
        persistLikeState(false);
        setLikesCount((current) => Math.max(0, current - 1));
      } else {
        await apiFetch("/posts/like", {
          method: "POST",
          body: JSON.stringify({ postId, userId: user?.id }),
        });
        persistLikeState(true);
        setLikesCount((current) => current + 1);
      }
    } finally {
      setLiking(false);
    }
  };

  // Função para formatar a data
  const formatarData = (dataString: string) => {
    if (!dataString) return "Data não informada";
    const data = new Date(dataString);
    if (Number.isNaN(data.getTime())) return "Data inválida";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(data);
  };


  const calcularTempoLeitura = (texto: string) => {
    if (!texto) return 1;
    const palavras = texto.trim().split(/\s+/).length;
    return Math.ceil(palavras / 200);
  };



  const goToPrevImage = () => {
    if (postImages.length <= 1) return;

    setCurrentImageIndex((current) =>
      current === 0 ? postImages.length - 1 : current - 1,
    );
  };

  const goToNextImage = () => {
    if (postImages.length <= 1) return;

    setCurrentImageIndex((current) =>
      current === postImages.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <HamburgerMenu />

      {/* HEADER MINIMALISTA */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <Link href="/noticias" className="shrink-0">
              <img
                src="/img/logo.jpg"
                alt="Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg"
              />
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => router.push("/noticias")}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] md:text-xs hover:bg-blue-900 hover:text-white transition-all duration-300 whitespace-nowrap border border-slate-200 shadow-sm uppercase tracking-wider"
            >
              <ArrowLeft size={14} className="hidden sm:block" />
              <span>Voltar</span>
            </button>
          </div>

          <div className="flex items-center justify-end" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              Carregando reportagem...
            </p>
          </div>
        ) : !postId || error || !post ? (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Ops! Reportagem não encontrada.
            </h1>
            <p className="text-slate-500 mb-8">
              {!postId
                ? "Notícia inválida."
                : error || "Essa página pode ter sido movida ou excluída."}
            </p>
            <button
              onClick={() => router.push("/noticias")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors font-medium shadow-sm"
            >
              <ArrowLeft size={18} /> Voltar para o Início
            </button>
          </div>
        ) : (
          <article className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {/* CABEÇALHO DO ARTIGO (TÍTULO E AUTOR) */}
            <header className="mb-10 text-center max-w-3xl mx-auto">
              <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">
                Informativo Oficial
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
                {post.titulo}
              </h1>

              {/* BYLINE (Autor e Data) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-slate-600 pt-6 border-t border-slate-100">
                {authorProfileHref ? (
                  <Link
                    href={authorProfileHref}
                    className="group flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-slate-50"
                  >
                    <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-900 font-bold text-lg overflow-hidden shadow-sm">
                      {post.autor?.avatarUrl ? (
                        <img
                          src={post.autor.avatarUrl}
                          alt={post.autor?.nome || "Autor"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        post.autor?.nome?.charAt(0) || "R"
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                        {post.autor?.nome || "Redação Canal 16"}
                      </p>
                      <p className="text-xs font-medium text-blue-600">
                        Equipe Editorial
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-900 font-bold text-lg overflow-hidden shadow-sm">
                      {post.autor?.avatarUrl ? (
                        <img
                          src={post.autor.avatarUrl}
                          alt={post.autor?.nome || "Autor"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        post.autor?.nome?.charAt(0) || "R"
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-base font-bold text-slate-900">
                        {post.autor?.nome || "Redação Canal 16"}
                      </p>
                      <p className="text-xs font-medium text-blue-600">
                        Equipe Editorial
                      </p>
                    </div>
                  </div>
                )}

                <div className="hidden sm:block h-8 w-px bg-slate-200" />

                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={16} className="text-slate-400" />
                    {formatarData(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-slate-400" />
                    {calcularTempoLeitura(post.conteudo)} min de leitura
                  </div>
                </div>
              </div>
            </header>

            {/* IMAGEM DE CAPA */}
            <div className="w-full mb-12">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md border border-slate-100">
                {postImages[0] ? (
                  <div
                    className="h-full w-full flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {postImages.map((imageUrl, index) => (
                      <img
                        key={`${post.id}-slide-${index}`}
                        src={imageUrl}
                        alt={`${post.titulo} - imagem ${index + 1}`}
                        className="h-full w-full shrink-0 object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl bg-blue-900/5">
                    🚢
                  </div>
                )}

                {postImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 text-slate-700 border border-slate-200 shadow-sm backdrop-blur hover:bg-white transition-colors flex items-center justify-center"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={goToNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 text-slate-700 border border-slate-200 shadow-sm backdrop-blur hover:bg-white transition-colors flex items-center justify-center"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {currentImageIndex + 1} / {postImages.length}
                    </div>
                  </>
                )}
              </div>

              {postImages.length > 1 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {postImages.map((imageUrl, index) => (
                    <button
                      key={`${post.id}-thumb-${index}`}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-14 w-20 rounded-lg overflow-hidden border transition-all ${
                        currentImageIndex === index
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${post.titulo} - miniatura ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CORPO DO TEXTO */}
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-lg prose-blue max-w-none text-slate-700 font-serif"
                dangerouslySetInnerHTML={{ __html: post.conteudo || "" }}
              />

              {/* TAGS E COMPARTILHAMENTO (RODAPÉ DO ARTIGO) */}
              <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex gap-2">
                  {!post.tags || post.tags.length === 0 ? (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium uppercase tracking-wider">
                      Sem tags
                    </span>
                  ) : (
                    post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium uppercase tracking-wider"
                      >
                        {tag.name}
                      </span>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLike}
                    disabled={liking}
                    className={`inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-semibold transition-all ${
                      liked
                        ? "border-rose-600 bg-rose-50 text-rose-700"
                        : "border-slate-200 text-slate-600 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50"
                    } ${liking ? "opacity-60 pointer-events-none" : ""}`}
                    title={liked ? "Descurtir" : "Curtir"}
                  >
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    <span>{liked ? "Curtido" : "Curtir"}</span>
                    <span className="text-xs font-bold opacity-80">{likesCount}</span>
                  </button>

                  <span className="text-sm font-semibold text-slate-500 mr-2">
                    Compartilhar:
                  </span>
                  <button
                    className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all ${
                      copied
                        ? "border-green-600 bg-green-50 text-green-600"
                        : "border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600"
                    }`}
                    title="Copiar Link"
                    onClick={handleCopy}
                  >
                    <LinkIcon size={18} />
                  </button>
               
                </div>
              </div>

              {/* CARD DO AUTOR DETALHADO */}
              <div className="mt-12 bg-slate-50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-slate-100">
                <div className="h-20 w-20 flex-shrink-0 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-blue-900 font-bold text-3xl overflow-hidden ring-1 ring-slate-200">
                  {post.autor?.avatarUrl ? (
                    <img
                      src={post.autor.avatarUrl}
                      alt={post.autor?.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    post.autor?.nome?.charAt(0) || "R"
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900">
                    Escrito por{" "}
                    {authorProfileHref ? (
                      <Link
                        href={authorProfileHref}
                        className="text-blue-800 hover:text-blue-700 transition-colors"
                      >
                        {post.autor?.nome || "Redação"}
                      </Link>
                    ) : (
                      post.autor?.nome || "Redação"
                    )}
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                    {post.autor?.bio || "Descrição do autor"}
                  </p>
                </div>
              </div>
            </div>
          </article>
        )}
 {showToast && (
  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700">
      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm font-bold tracking-tight">Link copiado com sucesso!</span>
    </div>
  </div>
)}
      </main>

    </div>
  );
}
