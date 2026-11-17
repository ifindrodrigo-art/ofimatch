import type { OficioId, Urgency } from "./data";

export type Role = "trabajador" | "cliente";

export type Profile = {
  id: string;
  auth_id?: string | null;
  role: Role;
  full_name: string;
  district: string;
  lat: number;
  lng: number;
  oficio: OficioId | null;
  years_exp: number | null;
  bio: string | null;
  available: boolean;
  rating_sum: number;
  rating_count: number;
  jobs_done: number;
  is_demo: boolean;
};

export type Status = "pendiente" | "aceptada" | "en_camino" | "completada" | "rechazada" | "cancelada";

export type Request = {
  id: string;
  client_id: string;
  worker_id: string | null;
  oficio: OficioId;
  description: string;
  district: string;
  lat: number;
  lng: number;
  urgency: Urgency;
  status: Status;
  match_score: number | null;
  amount: number | null;
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  client?: Pick<Profile, "full_name" | "district"> | null;
  worker?: Pick<Profile, "full_name" | "oficio" | "rating_sum" | "rating_count" | "is_demo"> | null;
};

export type Rating = {
  id: string;
  request_id: string;
  rater_id: string;
  ratee_id: string;
  s1: number;
  s2: number;
  s3: number;
  stars: number;
  comment: string | null;
  revealed: boolean;
  created_at: string;
};

export type DemandRow = {
  district: string;
  lat: number;
  lng: number;
  total: number;
  manana: number;
  tarde: number;
  noche: number;
};

export type SignUpInput = {
  email: string;
  password: string;
  role: Role;
  full_name: string;
  phone: string;
  district: string;
  oficio?: OficioId;
  years_exp?: number;
  bio?: string;
};

export type NewRequest = {
  worker_id: string;
  oficio: OficioId;
  description: string;
  district: string;
  urgency: Urgency;
  match_score: number;
};

export interface Backend {
  mode: "supabase" | "demo";
  currentProfile(): Promise<Profile | null>;
  onAuthChange(cb: () => void): () => void;
  signUp(input: SignUpInput): Promise<{ needsConfirm: boolean }>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  listWorkers(oficio: OficioId): Promise<Profile[]>;
  updateMyProfile(patch: Partial<Pick<Profile, "available" | "district" | "lat" | "lng" | "bio" | "full_name">>): Promise<void>;
  createRequest(input: NewRequest): Promise<Request>;
  myRequests(): Promise<Request[]>;
  updateRequest(id: string, patch: Partial<Pick<Request, "status" | "worker_id" | "amount" | "match_score">>): Promise<void>;
  ratingsFor(requestId: string): Promise<Rating[]>;
  rate(input: { request_id: string; ratee_id: string; s1: number; s2: number; s3: number; comment: string }): Promise<void>;
  reviewsOf(profileId: string): Promise<Rating[]>;
  counterpartPhone(requestId: string): Promise<string | null>;
  demand(oficio: OficioId): Promise<DemandRow[]>;
  demoAccounts?(): Promise<Profile[]>;
  demoLogin?(profileId: string): Promise<void>;
}
