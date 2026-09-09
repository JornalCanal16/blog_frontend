"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import { useManagementStore } from "@/store/managementStore";
import { usePostStore } from "@/store/postStore";
import Footer from "@/components/Footer";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { ArrowRight, Newspaper } from "lucide-react";

const getCoverImage = (post: { imagemUrl?: string; imagemUrls?: string[] }) => {
  const firstFromArray = Array.isArray(post.imagemUrls)
    ? post.imagemUrls.find((url) => typeof url === "string" && url.trim())
    : "";

  return firstFromArray || post.imagemUrl || "";
};

const formatarData = (dataString: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dataString));

export default function Home() {
  const router = useRouter();
  const { members, loading, fetchMembers } = useManagementStore();
  const { posts, loading: postsLoading, fetchPublicPosts } = usePostStore();

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  // /posts/public ja filtra publicado=true e ordena por createdAt desc,
  // entao limit 3 devolve exatamente as ultimas tres.
  useEffect(() => {
    void fetchPublicPosts({ page: 1, limit: 3 });
  }, [fetchPublicPosts]);

  const managementMembers = useMemo(
    () => members.filter((m) => m.isManagement && m.active),
    [members],
  );

  const ultimasNoticias = useMemo(() => posts.slice(0, 3), [posts]);

  return (
    <div className="bg-[#0a192f] min-h-screen text-white">
      {/* HERO COM IMAGEM DE FUNDO MANTIDA */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden py-20 sm:py-24 lg:py-28">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* A sua imagem de fundo original */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02] transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('/img/7setembro.jpg')" }} // Certifique-se que o caminho está correto
          />
          {/* Overlay para dar o tom Navy e garantir leitura do texto */}
          <div className="absolute inset-0 bg-[#0a192f]/65 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/35 to-[#0a192f]/90" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a192f]/75 to-transparent sm:w-40" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a192f]/75 to-transparent sm:w-40" />
        </div>

        <HamburgerMenu />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          {/* Badge Decorativo */}
          <div className="inline-flex max-w-[92vw] items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1.5 mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-600"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              Informativo Oficial Acadêmico
            </span>
          </div>

          <Image
            src="/img/logo.jpg"
            alt="Logo Jornal Canal 16"
            width={120}
            height={120}
            className="rounded-full border-2 border-[#d4af37] p-1 mb-8 shadow-2xl"
          />

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-4 max-w-4xl">
            <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent">
              Jornal Canal 16
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-200 md:text-xl">
            Informações, notícias e histórias dos Alunos da <span className="text-[#d4af37] font-medium">EFOMM</span>
          </p>

          <p className="mt-4 max-w-[92vw] text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]/80">
            Escola de Formação de Oficiais da Marinha Mercante • Belém, Pará
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <Newspaper className="text-[#d4af37] opacity-50" size={20} />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
        </div>

        {/* Onda decorativa para transição para o conteúdo claro */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,80 C150,120 350,0 600,60 C850,120 1050,40 1200,80 L1200,120 L0,120 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* SOBRE */}
      <section className="bg-[#f8fafc] py-24 text-[#0a192f]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-12 text-center tracking-tight italic">Sobre o Jornal</h2>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative group">
                <div className="absolute -inset-2 bg-[#d4af37] rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <Image
                src="/img/7setembro.jpg"
                alt="Jornal Canal 16"
                width={500}
                height={500}
                className="relative rounded-xl shadow-2xl object-cover w-full h-[400px]"
                />
            </div>
            <div className="w-full md:w-1/2 space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                O <strong className="text-[#0a192f]">Jornal Canal 16</strong> é um portal de notícias e informações 
                criado por alunos da EFOMM (Escola de Formação de Oficiais da Marinha Mercante) 
                do CIABA (Centro de Instrução Almirante Braz de Aguiar), localizado em Belém do Pará.
              </p>
              <p>
               Nosso foco e apresentar informações relevantes sobre a futura profissão dos alunos,
                a rotina e o período de adaptação na instituição, além de cobrir eventos e atividades 
                que marcam a vida academica e profissional de nossos colegas.
              </p>
              <p>
                Somos um espaço de expressão, informação e conexão entre alunos,
                famílias e a comunidade marítima.
              </p>
              <div className="pt-6 border-t border-slate-200 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#bf953f]">Marinha Mercante • Novidades • Rotina</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ULTIMAS NOTICIAS */}
      <section className="bg-white py-24 text-[#0a192f] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tight italic">Últimas Notícias</h2>
              <div className="mt-4 h-1.5 w-24 bg-gradient-to-r from-[#bf953f] to-[#b38728] rounded-full" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/noticias")}
              className="group inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-[#bf953f]/40 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-[#bf953f] transition-colors hover:bg-[#bf953f] hover:text-white"
            >
              Ver todas
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {postsLoading && ultimasNoticias.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center italic text-slate-400">
              Carregando notícias...
            </div>
          ) : ultimasNoticias.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center italic text-slate-400">
              Nenhuma notícia publicada ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ultimasNoticias.map((post) => (
                <article
                  key={post.id}
                  onClick={() => router.push(`/noticias/${post.id}`)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-slate-100">
                    {getCoverImage(post) ? (
                      <img
                        src={getCoverImage(post)}
                        alt={post.titulo}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-5xl transition-transform duration-500 group-hover:scale-110">
                        🚢
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <time className="text-[11px] font-bold uppercase tracking-widest text-[#bf953f]">
                      {formatarData(post.createdAt)}
                    </time>

                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-[#0a192f] transition-colors group-hover:text-[#bf953f]">
                      {post.titulo}
                    </h3>

                    <span className="mt-auto pt-6 text-sm font-semibold text-slate-500">
                      {post.autor?.nome || "Redação"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EQUIPE */}
      <section className="bg-[#0a192f] py-24 border-t border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-16 tracking-tight text-white">Nossa <span className="text-[#d4af37]">Gerência</span></h2>
          {loading && managementMembers.length === 0 ? (
            <div className="py-12 text-slate-400 italic">Carregando gerência...</div>
          ) : managementMembers.length === 0 ? (
            <div className="py-12 text-slate-400 italic">Nenhum membro cadastrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {managementMembers.map((membro) => (
                <div key={membro.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#d4af37]/50 transition-all group">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#d4af37]/30 group-hover:border-[#d4af37]">
                    {membro.photoUrl ? (
                      <img src={membro.photoUrl} alt={membro.nome} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-800 text-3xl font-bold">{membro.nome?.charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-center text-white mb-1">{membro.nome}</h3>
                  <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest text-center mb-4">{membro.cargo}</p>
                  <p className="text-slate-400 text-sm text-center leading-relaxed">{membro.descricao}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTATO */}
      <section className="bg-[#050c1b] py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-16 text-white tracking-tight">Entre em Contato</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-3xl mb-6">📍</div>
              <h3 className="text-[#d4af37] font-bold text-lg mb-4 italic uppercase tracking-wider">Localização</h3>
              <p className="text-slate-300 text-sm">CIABA <br /> Av. Arthur Bernardes, 245 <br /> Belém - PA</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-3xl mb-6">✉️</div>
              <h3 className="text-[#d4af37] font-bold text-lg mb-4 italic uppercase tracking-wider">Email</h3>
              <a href="mailto:atendimentojornalcanal16@gmail.com" className="text-slate-300 text-sm break-all">atendimentojornalcanal16@gmail.com</a>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-3xl mb-6">📱</div>
              <h3 className="text-[#d4af37] font-bold text-lg mb-4 italic uppercase tracking-wider">Redes Sociais</h3>
              <div className="flex justify-center gap-4 mt-2">
                <a href="https://instagram.com/jornalcanal.16" className="text-white hover:text-[#d4af37] transition"><FaInstagram size={24} /></a>
                <a href="https://youtube.com/@JornalCanal.16" className="text-white hover:text-[#d4af37] transition"><FaYoutube size={24} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
