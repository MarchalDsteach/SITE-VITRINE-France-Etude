// ⚠️ Adapte NEXT_PUBLIC_API_URL dans ton .env.local (ou remplace directement l'URL ci-dessous)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getCurrentUser(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as StudentProfile;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && token) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || `Erreur ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return request<T>(path, options);
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  upload: <T>(path: string, body: FormData) =>
    request<T>(path, { method: "POST", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export async function downloadFile(path: string, fileName: string) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || `Erreur ${response.status}`);
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Compatibilité avec login/register existants qui font :
// const res = await auth.register(form); res.data.accessToken / res.data.user
type AuthResponse = { accessToken: string; user: StudentProfile };
type RegistrationResponse = { message: string };

export const auth = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const json = await request<RegistrationResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { data: json };
  },
  login: async (data: { email: string; password: string }) => {
    const json = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { data: json };
  },
  verifyEmail: (token: string) => request<{ message: string }>("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) }),
  resendVerification: (email: string) => request<{ message: string }>("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),
  forgotPassword: (email: string) => request<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) => request<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
};

export type InboxMessage = {
  id: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  sender?: { id?: string; firstName: string; lastName: string; role?: string };
  recipient?: { id: string; email: string; firstName: string; lastName: string };
};

export type Lead = {
  id: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  priority: "LOW" | "NORMAL" | "HIGH";
  message?: string | null;
  serviceName?: string | null;
  country?: string | null;
  advisorId?: string | null;
  advisor?: { id: string; firstName: string; lastName: string } | null;
  createdAt: string;
  user?: { id: string; email: string; firstName: string; lastName: string } | null;
};

// Types partagés — ajuste les champs pour matcher ton schema.prisma exact
export type Application = {
  id: string;
  reference: string;
  status: string;
  type: "AVI" | "ADL" | "CAMPUS_FRANCE" | "SCHOLARSHIP";
  formData: Record<string, unknown>;
  program?: string;
  createdAt: string;
  updatedAt: string;
};

export function getApplicationTitle(application: Application) {
  const program = application.formData?.program;
  return typeof program === "string" && program.trim() ? program : application.type.replaceAll("_", " ");
}

export type StudentProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: "STUDENT" | "ADVISOR" | "ADMIN";
  status?: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";
  phone?: string | null;
  country?: string | null;
  originCountry?: string | null;
  emailVerified?: boolean;
};

export type Offer = {
  id: string;
  title: string;
  company: string;
  location: string;
  contractType: string;
  type: "ALTERNANCE" | "INTERNSHIP" | "STUDENT_JOB";
  duration?: string | null;
  description: string;
  requirements?: string | null;
  applyUrl?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  applicationClicks: number;
  lastClickedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};
