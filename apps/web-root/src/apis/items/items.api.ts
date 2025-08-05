import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.PUBLIC_API_MASTER_ITEMS}`  , // sesuaikan baseURL
  headers: { "Content-Type": "application/json" },
});

enum queryKeys {
  items = "items",
}

interface Item {
  id: number;
  name: string;
  description: string;
}

interface Paginate {
  page?: number;
  pageSize?: number;
}

interface Params {
  [key: string]: any;
}

const defaultPagination: Paginate = { page: 1, pageSize: 10 };
const defaultParams: Params = {};

const buildParams = (params: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
  );

// Hook fetch all items (optionally with pagination or filtering params)
export function useItems(paginate?: Paginate, params?: Params) {
  const pagination = paginate ?? defaultPagination;
  const searchParams = params ?? defaultParams;

  return useQuery({
    queryKey: [queryKeys.items, pagination, searchParams],
    queryFn: async () => {
      const res = await apiClient.get("/items", {
        params: buildParams({ ...pagination, ...searchParams }),
      });
      return res.data; // expect array of items
    },
    placeholderData: keepPreviousData,

  });
}

// Hook fetch single item by ID
export function useItemById(id?: number) {
  return useQuery({
    queryKey: [queryKeys.items, id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get(`/items/${id}`);
      return res.data; // expect single item object
    },
    placeholderData: keepPreviousData,
  });
}

// Mutation hooks for creating, updating, deleting item
export function useItemsMutation() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<Item, "id">) => {
      const res = await apiClient.post("/items", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKeys.items] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Item> }) => {
      const res = await apiClient.put(`/items/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKeys.items] });
    },
  });

  const del = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/items/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKeys.items] });
    },
  });

  return {
    create,
    update,
    del,
  };
}
