import { create } from "zustand";
import { apiFetch } from "@/services/api";

type Log = {
  id: string;
  entityType?: string;
  action?: string;
  message?: string;
  summary?: string;
  createdAt?: string;
  user?: { id?: string; nome?: string; role?: string; email?: string };
};

type LogsState = {
  logs: Log[];
  loading: boolean;
  error: string | null;
  fetchLogs: (opts?: { entityType?: string; action?: string; limit?: number }) => Promise<void>;
  clear: () => void;
};

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],
  loading: false,
  error: null,

  fetchLogs: async ({ entityType, action, limit } = {}) => {
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (entityType) params.set("entityType", entityType);
      if (action) params.set("action", action);
      if (limit) params.set("limit", String(limit));

      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/management/logs${query}`);

      const normalizedLogs = Array.isArray(data)
        ? data.map((log: any) => ({
            ...log,
            message: log.message ?? log.summary ?? "",
            summary: log.summary ?? log.message ?? "",
            user: log.user ?? log.actor ?? null,
          }))
        : [];

      set({ logs: normalizedLogs, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar logs";
      set({ error: message, loading: false });
    }
  },

 

  clear: () => set({ logs: [], error: null }),
}));
