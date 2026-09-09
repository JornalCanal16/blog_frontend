"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  type CreateManagementInput,
  type ManagementMember,
  type UpdateManagementInput,
  useManagementStore,
} from "@/store/managementStore";
import { AlertTriangle, ChevronDown, ChevronUp, Loader2, Pencil, Plus, Save, Trash2, Upload, X, Users } from "lucide-react";

type MemberModalProps = {
  member?: ManagementMember | null;
  onClose: () => void;
  onSuccess: () => void;
  createMember: (data: CreateManagementInput) => Promise<void>;
  updateMember: (id: string, data: UpdateManagementInput) => Promise<void>;
};

export default function DashboardSobrePage() {
  const { user } = useAuthStore();
  const { members, loading, fetchMembers, createMember, updateMember, deleteMember, moveMember } =
    useManagementStore();
  const [modalMember, setModalMember] = useState<ManagementMember | null | undefined>(undefined);
  const [memberToDelete, setMemberToDelete] = useState<ManagementMember | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  if (user?.role !== "PRESIDENTE") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Acesso restrito</h1>
        <p className="text-sm text-slate-500 mt-2">
          Apenas presidentes podem gerenciar a seção Sobre.
        </p>
      </div>
    );
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    setMovingId(id);
    try {
      await moveMember(id, direction);
    } catch {
      // O store ja desfaz a ordem otimista e o apiFetch mostra o toast de erro.
    } finally {
      setMovingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    await deleteMember(memberToDelete.id);
    setMemberToDelete(null);
    void fetchMembers();
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sobre</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie os membros exibidos na página pública Sobre. A ordem abaixo é a mesma
            usada no site.
          </p>
        </div>

        <button
          onClick={() => setModalMember(null)}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus size={16} />
          Novo Membro
        </button>
      </div>

      {loading && members.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-900" size={36} />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <Users size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Nenhum membro cadastrado</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            Adicione o primeiro membro para exibir a equipe na página Sobre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <article
              key={member.id}
              className="relative bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
            >
              {/* Posicao + setas de reordenacao */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-sm px-1.5 py-1">
                <span className="px-1.5 text-xs font-bold text-slate-700 tabular-nums">
                  {index + 1}º
                </span>
                <button
                  type="button"
                  onClick={() => void handleMove(member.id, "up")}
                  disabled={index === 0 || movingId !== null}
                  title="Subir uma posição"
                  aria-label={`Subir ${member.nome} uma posição`}
                  className="p-1 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => void handleMove(member.id, "down")}
                  disabled={index === members.length - 1 || movingId !== null}
                  title="Descer uma posição"
                  aria-label={`Descer ${member.nome} uma posição`}
                  className="p-1 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="h-40 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center overflow-hidden">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-white border border-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400">
                    {member.nome?.charAt(0)?.toUpperCase() || "M"}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{member.nome}</h3>
                      <p className="text-sm text-blue-700 font-medium">{member.cargo}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{member.descricao}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalMember(member)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => setMemberToDelete(member)}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalMember !== undefined && (
        <MemberModal
          member={modalMember}
          onClose={() => setModalMember(undefined)}
          onSuccess={() => {
            void fetchMembers();
            setModalMember(undefined);
          }}
          createMember={createMember}
          updateMember={updateMember}
        />
      )}

      {memberToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Confirmar exclusão</h2>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Tem certeza que deseja remover o membro {memberToDelete.nome}? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberModal({ member, onClose, onSuccess, createMember, updateMember }: MemberModalProps) {
  const isEditing = Boolean(member);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [form, setForm] = useState({
    nome: "",
    cargo: "",
    descricao: "",
    isManagement: false,
    isSobre: false,
  });

  useEffect(() => {
    if (!file) {
      setPreviewUrl(member?.photoUrl || "");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, member]);

  useEffect(() => {
    setForm({
      nome: member?.nome || "",
      cargo: member?.cargo || "",
      descricao: member?.descricao || "",
      isManagement: member?.isManagement ?? false,
      isSobre: member?.isSobre ?? false,
    });
    setFile(null);
  }, [member]);

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    setLoading(true);

    const payload = {
      nome: form.nome,
      cargo: form.cargo,
      descricao: form.descricao,
      isManagement: form.isManagement,
      isSobre: form.isSobre,
      photoUrl: member?.photoUrl,
      file: file || undefined,
    };

    if (isEditing && member) {
      await updateMember(member.id, payload);
    } else {
      await createMember(payload);
    }

    onSuccess();
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? "Editar Membro" : "Novo Membro"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Preencha os dados que serão exibidos na página Sobre.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nome</label>
              <input
                required
                value={form.nome}
                onChange={(event) => setForm({ ...form, nome: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Cargo</label>
              <input
                required
                value={form.cargo}
                onChange={(event) => setForm({ ...form, cargo: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>


           
          </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Descrição</label>
              <input
                required
                value={form.descricao}
                onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Foto</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="h-20 w-20 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Pré-visualização da foto" className="h-full w-full object-cover" />
                  ) : (
                    <Users size={24} className="text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-800"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-slate-500">
                    Escolha uma imagem para o membro. Se estiver editando, deixe vazio para manter a foto atual.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isManagement}
                  onChange={(event) =>
                    setForm({ ...form, isManagement: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-500/20"
                />
                Exibir na gestão 
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isSobre}
                  onChange={(event) =>
                    setForm({ ...form, isSobre: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-500/20"
                />
                Exibir no Sobre
              </label>
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 text-white hover:bg-blue-800 text-sm font-medium disabled:opacity-70"
            >
              <Save size={16} />
              {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Membro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}