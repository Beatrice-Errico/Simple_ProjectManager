import type { Project, Task } from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listProjects: () => request<Project[]>("/api/projects"),
  createProject: (payload: { name: string; description?: string | null }) =>
    request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addTask: (projectId: number, payload: { content: string }) =>
    request<Task>(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  toggleTask: (taskId: number) =>
    request<Task>(`/api/tasks/${taskId}`, { method: "PATCH" }),
};
