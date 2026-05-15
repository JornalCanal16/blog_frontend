import { create } from "zustand";
import { apiFetch } from "@/services/api";

export type ManagementMember = {
  id: string;
  nome: string;
  cargo: string;
  descricao: string;
  photoUrl: string;
  isManagement: boolean;
  isSobre: boolean;
  order?: number;
  active?: boolean;
};

export type CreateManagementInput = {
  nome: string;
  cargo: string;
  descricao: string;
  isManagement: boolean;
  isSobre: boolean;
  photoUrl?: string;
  file?: File;
};

export type UpdateManagementInput = {
  nome: string;
  cargo: string;
  descricao: string;
  isManagement: boolean;
  isSobre: boolean;
  photoUrl?: string;
  file?: File;
};

type ManagementState = {
  members: ManagementMember[];
  loading: boolean;
  fetchMembers: () => Promise<void>;
  createMember: (data: CreateManagementInput) => Promise<void>;
  updateMember: (id: string, data: UpdateManagementInput) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
};

const normalizeMembersPayload = (payload: unknown): ManagementMember[] => {
  if (Array.isArray(payload)) return payload as ManagementMember[];
  if (!payload || typeof payload !== "object") return [];

  const wrapped = payload as { data?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data as ManagementMember[];

  return [];
};

const toJsonPayload = (data: CreateManagementInput | UpdateManagementInput) => {
  const { file, ...rest } = data;
  return JSON.stringify(rest);
};

const buildFormData = (data: CreateManagementInput | UpdateManagementInput) => {
  const formData = new FormData();
  const hasFile = data.file instanceof File;

  formData.append("nome", data.nome);
  formData.append("cargo", data.cargo);
  formData.append("descricao", data.descricao);
  formData.append("isManagement", String(data.isManagement));
  formData.append("isSobre", String(data.isSobre));

  // 🔥 SOMENTE file
  if (hasFile && data.file) {
    formData.append("file", data.file);
  }

  return formData;
};

export const useManagementStore = create<ManagementState>((set, get) => ({
  members: [],
  loading: false,

  fetchMembers: async () => {
    set({ loading: true });
    const response = await apiFetch("/management");
    set({ members: normalizeMembersPayload(response), loading: false });
  },

  createMember: async (data) => {
    const payload = data.file ? buildFormData(data) : toJsonPayload(data);

    await apiFetch("/management", {
      method: "POST",
      body: payload,
    });

    await get().fetchMembers();
  },

  updateMember: async (id, data) => {
    const payload = data.file ? buildFormData(data) : toJsonPayload(data);

    await apiFetch(`/management/${id}`, {
      method: "PATCH",
      body: payload,
    });

    await get().fetchMembers();
  },

  deleteMember: async (id) => {
    await apiFetch(`/management/${id}`, {
      method: "DELETE",
    });

    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    }));
  },
}));