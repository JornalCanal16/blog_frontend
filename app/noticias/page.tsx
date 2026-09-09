"use client";

import { useEffect, useState, type MouseEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import {
  LogIn,
  ArrowRight,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePostStore } from "@/store/postStore";
import { useTagStore } from "@/store/tagStore";

const getCoverImage = (post: { imagemUrl?: string; imagemUrls?: string[] }) => {
  const firstFromArray = Array.isArray(post.imagemUrls)
    ? post.imagemUrls.find((url) => typeof url === "string" && url.trim())
    : "";

  return firstFromArray || post.imagemUrl || "";
};

export default function Noticias() {
  const router = useRouter();

  // Pegando dados da Store
  const { posts, meta, loading, fetchPublicPosts } = usePostStore();
  const { tags, fetchTags } = useTagStore();

  // Estado local para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState(""); // input value
  const [search, setSearch] = useState(""); // applied search
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Busca as tags uma vez
  useEffect(() => {
    fetchTags();
  }, []);

  // Busca os posts sempre que a página atual, busca ou tags mudarem
  useEffect(() => {
    fetchPublicPosts({ page: currentPage, limit: 9, search, tagIds: selectedTagIds });
  }, [currentPage, search, selectedTagIds]);

  // Função para formatar a data (ex: 12 de Abril de 2026)
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(data);
  };

  const handleNoticiaClick = (id: string) => {
    // Você pode mudar para `/noticias/${post.slug}` se preferir usar a URL amigável
    router.push(`/noticias/${id}`);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearch(query);
  };

  const toggleTag = (id: string) => {
    setCurrentPage(1);
    setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAutorClick = (event: MouseEvent, autorId?: string) => {
    event.stopPropagation();
    if (!autorId) return;
    router.push(`/perfil/${autorId}`);
  };

  return (
    <div className="noticias-page">
      <HamburgerMenu />

      <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
        {/* HEADER / NAV */}
       <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">
    
    {/* COLUNA 1: Logo (Alinhado à esquerda) */}
    <div className="flex items-center justify-start">
      <Link href="/" className="shrink-0">
        <img
          src="/img/logo.jpg"
          alt="Logo"
          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg shadow-sm"
        />
      </Link>
    </div>

    {/* COLUNA 2: Botão Área do Redator (Centralizado) */}
    <div className="flex items-center justify-center">
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] md:text-xs hover:bg-blue-900 hover:text-white transition-all duration-300 whitespace-nowrap border border-slate-200 shadow-sm uppercase tracking-wider"
      >
        <LogIn size={14} className="hidden sm:block" />
        <span>Área do Redator</span>
      </button>
    </div>

    {/* COLUNA 3: Espaço reservado (Para equilibrar o layout ou ícones extras) */}
    <div className="flex items-center justify-end">
      {/* Se o seu HamburgerMenu for um botão flutuante que fica na direita, 
          este espaço garante que o botão central não bata nele.
      */}
    </div>

  </div>
</header>

        {/* HERO SECTION */}
        {/* HERO SECTION CORRIGIDA */}
<section className="relative overflow-hidden bg-[#0a192f] pt-32 pb-40 text-white">
  {/* Elementos Visuais de Fundo */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.5),transparent)]" />
    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    
    {/* Círculos decorativos */}
    <div className="absolute -top-24 -right-24 w-96 h-96 border border-yellow-500/10 rounded-full" />
    <div className="absolute -bottom-24 -left-24 w-96 h-96 border border-yellow-500/10 rounded-full" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6">
    <div className="flex flex-col items-center text-center">
      
      {/* Badge Dourada */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-600"></span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
          Informativo Oficial Acadêmico
        </span>
      </div>

      {/* Título com Dourado */}
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
        Portal de Notícias <br />
        <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent">
          EFOMM
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
        A conexão oficial com o cotidiano do <span className="text-[#d4af37] font-medium">CIABA</span>. 
        Notícias, editais e a rotina da Marinha Mercante em um só lugar.
      </p>

      {/* Elemento Decorativo Inferior */}
      <div className="mt-12 flex items-center gap-4">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]" />
        <Newspaper className="text-[#d4af37] opacity-50" size={20} />
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]" />
      </div>
    </div>
  </div>

  {/* Onda decorativa CORRIGIDA - Fill ajustado para bg-slate-50 (#f8fafc) */}
<div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
  <svg 
  className="relative block w-[calc(100%+1.3px)] h-[80px]" 
  viewBox="0 0 1200 120" 
  preserveAspectRatio="none"
>
  <path 
    d="M0,80 
       C150,120 350,0 600,60 
       C850,120 1050,40 1200,80 
       L1200,120 
       L0,120 
       Z"
    fill="#f8fafc"
  />
</svg>
</div>
</section>

        {/* BARRA DE BUSCA E FILTRO POR TAGS */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por título ou conteúdo"
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
                {/* Select múltiplo para filtrar por tags */}
                {tags && tags.length > 0 && (
                  <select
                    multiple
                    title="Selecione uma ou mais tags para filtrar (use Ctrl/Cmd para seleção múltipla)"
                    value={selectedTagIds}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions).map((o) => o.value);
                      setCurrentPage(1);
                      setSelectedTagIds(values);
                    }}
                    size={3}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm w-[150px] max-h-24 overflow-y-auto text-slate-900 font-medium"
                    aria-label="Filtrar por tags"
                  >
                    <option value="" disabled>
                      Tags...
                    </option>
                    {tags.map((t) => (
                      <option key={t.id} value={t.id} className="text-slate-900">
                        {t.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm"
                >
                  Buscar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearch("");
                    setSelectedTagIds([]);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors text-slate-700"
                >
                  Limpar filtros
                </button>
              </div>

              {/* Indicador de tags selecionadas com botões para remover */}
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 mt-1">Tags selecionadas:</span>
                  {selectedTagIds.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return tag ? (
                      <button
                        key={tagId}
                        onClick={() => toggleTag(tagId)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 border border-blue-300 rounded-full text-xs font-semibold hover:bg-blue-200 transition-colors"
                      >
                        {tag.name}
                        <span className="text-blue-900 font-bold hover:text-blue-700">×</span>
                      </button>
                    ) : null;
                  })}
                </div>
              )}
            </form>

           
          </div>
        </div>

        {/* MENSAGEM DE CARREGANDO OU VAZIO */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">
              Nenhuma notícia encontrada
            </h3>
            <p>Volte mais tarde para novas atualizações.</p>
          </div>
        ) : (
          <main className="max-w-7xl mx-auto px-6 mt-12 pb-20">
            {/* GRID DE NOTÍCIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((item) => (
                <article
                  key={item.id}
                  onClick={() => handleNoticiaClick(item.id)}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Imagem/Thumbnail */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-200 flex items-center justify-center">
                    {getCoverImage(item) ? (
                      <img
                        src={getCoverImage(item)}
                        alt={item.titulo}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-500">
                        🚢
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1 rounded-md bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold uppercase text-blue-900 tracking-wider">
                        Informativo
                      </span>
                    </div>
                  </div>
                  {/* Conteúdo */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Autor e Data */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs shadow-sm">
                        {item.autor?.avatarUrl ? (
                          <img
                            src={item.autor.avatarUrl}
                            alt={item.autor.nome}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          item.autor?.nome?.charAt(0) || "U"
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(event) =>
                          handleAutorClick(
                            event,
                            item.autor?.id || item.autorId,
                          )
                        }
                        className="flex flex-col text-left"
                      >
                        <span className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors">
                          {item.autor?.nome || "Redação"}
                        </span>
                        <time className="text-[11px] font-medium text-slate-500">
                          {formatarData(item.createdAt)}
                        </time>
                      </button>
                    </div>

                    <h3 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors mb-3 line-clamp-2">
                      {item.titulo}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6">
                      {item.conteudo?.replace(/<[^>]*>?/gm, '')?.replace(/&nbsp;/g, ' ')}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-blue-700 group-hover:text-blue-800">
                      <span className="text-sm font-bold">Ler reportagem</span>
                      <ArrowRight
                        size={18}
                        className="transform group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map((item) => (
    <article
      key={item.id}
      onClick={() => handleNoticiaClick(item.id)}
      className="group cursor-pointer bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-row h-48 overflow-hidden"
    >
       <div className="relative w-2/5 shrink-0 overflow-hidden bg-slate-200">
        {item.imagemUrl ? (
          <img
            src={item.imagemUrl}
            alt={item.titulo}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-slate-100">
            🚢
          </div>
        )}
      </div>

       <div className="p-4 flex flex-col flex-1 min-w-0">  
        <div className="flex items-center gap-2 mb-2">
          <time className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </time>
        </div>

        <h3 className="text-sm font-bold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-3 mb-2">
          {item.titulo}
        </h3>
        
        <p className="text-[12px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
          {item.conteudo}
        </p>

        <div className="mt-auto flex items-center text-[11px] font-bold text-blue-700">
          <span className="group-hover:mr-2 transition-all">Ler mais</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </article>
  ))}
</div> */}

            {/* CONTROLES DE PAGINAÇÃO */}
            {meta && meta.lastPage > 1 && (
              <div className="flex items-center j   ustify-center gap-4 mt-16">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>

                <span className="text-sm font-medium text-slate-500">
                  Página {meta.page} de {meta.lastPage}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(meta.lastPage, p + 1))
                  }
                  disabled={currentPage === meta.lastPage}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Próxima <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        )}

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 grayscale opacity-70">
              <Image
                src="/img/logo.jpg"
                alt="Logo Jornal Canal 16"
                width={56}
                height={56}
                className="rounded-lg"
              />
            </div>
            <p className="text-[13px]">
              © 2026 Jornal Canal 16 • Centro de Instrução Almirante Braz de
              Aguiar
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contato
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
