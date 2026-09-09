import React from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="bg-[#0a192f] pt-16 pb-8 border-t border-yellow-500/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Seção 1: Identidade */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xl font-black tracking-tighter text-white uppercase">
              Jornal <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent">Canal 16</span>
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
              Portal de notícias e informações dos alunos da EFOMM em Belém,
              Pará. Onde a tradição encontra a informação.
            </p>
          </div>

          {/* Seção 2: Links Rápidos */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] mb-2">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {["Portal de Notícias", "Sobre", "Equipe"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-300 hover:text-[#d4af37] text-sm transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#d4af37] mr-0 group-hover:mr-2 transition-all"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Seção 3: Redes Sociais */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em]">
              Siga-nos
            </h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/jornalcanal16" 
                target="_blank" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://youtube.com/@JornalCanal.16" 
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">
            © 2026 Jornal Canal 16 • Todos os direitos reservados
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              EFOMM (CIABA) • Belém, Pará
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;