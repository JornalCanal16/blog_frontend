"use client";

import { useEffect, useMemo } from "react";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import { useManagementStore } from "@/store/managementStore";
import Footer from "@/components/Footer";
import Image from "next/image";
import { ChevronDown } from "lucide-react"; // Importe um ícone de seta para o indicador

export default function Sobre() {
  const { members, loading, fetchMembers } = useManagementStore();

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const membrosSobre = useMemo(
    () => members.filter((member) => member.isSobre && member.active),
    [members],
  );

  return (
    <div className="bg-[#0a192f] min-h-screen text-white">
      {/* HERO AJUSTADA PARA OCUPAR 100% DA TELA (Full Screen) */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden py-20 sm:py-24 lg:py-28">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 scale-[1.02] bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('/img/background1.jpg')" }} 
          />
          {/* Overlay Navy Profundo */}
          <div className="absolute inset-0 bg-[#0a192f]/68 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/30 to-[#0a192f]/90" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a192f]/75 to-transparent sm:w-40" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a192f]/75 to-transparent sm:w-40" />
        </div>

        <HamburgerMenu />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <Image
            src="/img/logo.jpg"
            alt="Logo Jornal Canal 16"
            width={120}
            height={120}
            className="mb-8 rounded-full border-2 border-[#d4af37] p-1 shadow-2xl animate-fade-in"
          />

          <h1 className="mb-6 max-w-4xl text-5xl font-black tracking-tighter leading-tight sm:text-6xl md:text-8xl">
            Sobre <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent">Nós</span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg font-light italic leading-relaxed text-slate-200 opacity-95 sm:text-xl md:text-2xl">
            "Conheça a equipe por trás do Jornal Canal 16"
          </p>
          
          {/* Indicador de Scroll Animado */}
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#d4af37]/60 sm:bottom-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Role para descobrir</span>
            <ChevronDown className="animate-bounce" size={24} />
          </div>
        </div>

        {/* Transição Suave para o conteúdo */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,80 C150,120 350,0 600,60 C850,120 1050,40 1200,80 L1200,120 L0,120 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* SEÇÃO EQUIPE (Fundo Claro) */}
      <section className="bg-[#f8fafc] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-[#0a192f] tracking-tight mb-4">
              Nossa Equipe
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#bf953f] to-[#b38728] mx-auto rounded-full" />
          </div>

          {loading && membrosSobre.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center text-slate-500 italic">
              Carregando equipe oficial...
            </div>
          ) : membrosSobre.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center text-slate-500 italic">
              Nenhum membro da equipe foi cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {membrosSobre.map((membro) => (
                <div
                  key={membro.id}
                  className="group bg-white rounded-[2.5rem] p-10 text-center shadow-xl shadow-slate-200/60 border border-slate-100 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl"
                >
                  <div className="relative mx-auto mb-8 h-48 w-48 transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500" />
                    
                    <div className="absolute inset-0 rounded-full border-[3px] border-[#bf953f] p-2 transition-all duration-500 group-hover:border-[#fcf6ba]">
                      <div className="h-full w-full overflow-hidden rounded-full bg-slate-100 border border-[#bf953f]/20 shadow-inner">
                        {membro.photoUrl ? (
                          <img
                            src={membro.photoUrl}
                            alt={membro.nome}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-6xl font-black text-[#bf953f]/20 italic">
                            {membro.nome?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-[#0a192f] leading-tight">
                      {membro.nome}
                    </h3>
                    <p className="text-[11px] font-black text-[#bf953f] uppercase tracking-[0.2em]">
                      {membro.cargo}
                    </p>
                    <div className="w-10 h-[2px] bg-slate-100 mx-auto my-6 transition-all duration-500 group-hover:w-20 group-hover:bg-[#d4af37]" />
                    <p className="text-sm text-slate-500 leading-relaxed italic font-light">
                      {membro.descricao || "Escola de Formação de Oficiais"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}