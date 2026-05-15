"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Tags,
  UserRound,
} from "lucide-react";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import { useProfileStore } from "@/store/profileStore";

export default function PerfilAutorPage() {
  const router = useRouter();
  const params = useParams();

  const profileId = useMemo(() => {
    const value = params?.id;
    if (Array.isArray(value)) {
      return value[0] || "";
    }
    return typeof value === "string" ? value : "";
  }, [params]);

  const { profile, posts, loading, error, fetchProfileWithPosts } =
    useProfileStore();

  useEffect(() => {
    void fetchProfileWithPosts(profileId);
  }, [profileId, fetchProfileWithPosts]);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);

    if (Number.isNaN(data.getTime())) {
      return "Data invalida";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HamburgerMenu />

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 sm:px-6">
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
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm transition-all duration-300 hover:bg-blue-900 hover:text-white sm:px-4 sm:py-2 sm:text-sm"
            >
              <ArrowLeft size={14} className="hidden sm:block" />
              <span>Voltar</span>
            </button>
          </div>

          <div className="flex items-center justify-end" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-blue-900" />
            <p className="font-medium text-slate-500">Carregando perfil...</p>
          </div>
        ) : error || !profile ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="mb-3 text-2xl font-bold">Perfil nao encontrado</h1>
            <p className="mb-6 text-slate-600">
              {error || "Nao foi possivel carregar este autor."}
            </p>
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-800"
            >
              <ArrowLeft size={16} /> Voltar para noticias
            </Link>
          </div>
        ) : (
          <>
            <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-3xl font-bold text-blue-900 ring-1 ring-slate-200">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.nome?.charAt(0) || <UserRound size={28} />
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {profile.nome}
                  </h1>
                  <p className="mt-2 max-w-2xl text-slate-600">
                    {profile.bio?.trim() ||
                      "Sem bio cadastrada para este autor."}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {(profile.tags || []).length === 0 ? (
                      <span className="text-xs text-slate-500">
                        Sem tags vinculadas.
                      </span>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          <Tags size={12} /> Tags:
                        </span>
                        {profile.tags?.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <FileText size={14} /> {posts.length} post(s) publicado(s)
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Publicacoes do autor
              </h2>

              {posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                  Este autor ainda nao possui publicacoes visiveis.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => router.push(`/noticias/${post.id}`)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        {(post.imagemUrls?.find((url) => url?.trim()) || post.imagemUrl) ? (
                          <img
                            src={post.imagemUrls?.find((url) => url?.trim()) || post.imagemUrl}
                            alt={post.titulo}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-5xl">
                            📰
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-blue-700">
                          {post.titulo}
                        </h3>
                        <p className="mb-4 line-clamp-3 text-sm text-slate-600">
                          {post.conteudo?.replace(/<[^>]*>?/gm, '')?.replace(/&nbsp;/g, ' ')}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <CalendarDays size={14} />{" "}
                          {formatarData(post.createdAt)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
