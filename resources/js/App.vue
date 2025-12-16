<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "./api";
import type { Project, Task } from "./types";

const projects = ref<Project[]>([]);
const selectedProjectId = ref<number | null>(null);

const newProjectName = ref("");
const newProjectDesc = ref("");

const newTaskContent = ref("");

const loading = ref(false);
const error = ref<string | null>(null);

const selectedProject = () =>
  projects.value.find((p) => p.id === selectedProjectId.value) ?? null;

async function load() {
  loading.value = true;
  error.value = null;
  try {
    projects.value = await api.listProjects();
    if (selectedProjectId.value === null && projects.value.length > 0) {
      selectedProjectId.value = projects.value[0].id;
    }
  } catch (e: any) {
    error.value = e.message ?? "Errore";
  } finally {
    loading.value = false;
  }
}

async function createProject() {
  if (!newProjectName.value.trim()) return;
  error.value = null;

  try {
    const created = await api.createProject({
      name: newProjectName.value.trim(),
      description: newProjectDesc.value.trim() || null,
    });
    // ricarico lista per avere ordering coerente + tasks
    await load();
    selectedProjectId.value = created.id;
    newProjectName.value = "";
    newProjectDesc.value = "";
  } catch (e: any) {
    error.value = e.message ?? "Errore";
  }
}

async function addTask() {
  const proj = selectedProject();
  if (!proj) return;
  const content = newTaskContent.value.trim();
  if (!content) return;

  error.value = null;
  try {
    const created = await api.addTask(proj.id, { content });
    // update locale
    proj.tasks.push(created);
    newTaskContent.value = "";
  } catch (e: any) {
    error.value = e.message ?? "Errore";
  }
}

async function toggleTask(task: Task) {
  // optimistic UI
  const prev = task.is_completed;
  task.is_completed = !task.is_completed;

  try {
    const updated = await api.toggleTask(task.id);
    task.is_completed = updated.is_completed;
  } catch (e: any) {
    task.is_completed = prev; // rollback
    error.value = e.message ?? "Errore";
  }
}

onMounted(load);
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">Simple Project Manager</h1>
      <p class="text-sm text-gray-600">Laravel API + Vue 3 (TS) + Tailwind</p>
    </header>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Sidebar Projects -->
      <aside class="md:col-span-1">
        <div class="rounded-xl border bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold">Progetti</h2>
            <button
              class="text-sm underline text-gray-700"
              @click="load"
              :disabled="loading"
            >
              refresh
            </button>
          </div>

          <div class="space-y-2">
            <button
              v-for="p in projects"
              :key="p.id"
              class="w-full text-left rounded-lg border px-3 py-2 hover:bg-gray-50"
              :class="p.id === selectedProjectId ? 'border-gray-900' : 'border-gray-200'"
              @click="selectedProjectId = p.id"
            >
              <div class="font-medium">{{ p.name }}</div>
              <div class="text-xs text-gray-500 line-clamp-2">
                {{ p.description ?? "—" }}
              </div>
            </button>
          </div>

          <div class="mt-5 pt-4 border-t">
            <h3 class="text-sm font-semibold mb-2">Nuovo progetto</h3>
            <input
              v-model="newProjectName"
              class="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Nome (required)"
            />
            <textarea
              v-model="newProjectDesc"
              class="w-full mt-2 rounded-lg border px-3 py-2 text-sm"
              placeholder="Descrizione (opzionale)"
              rows="3"
            />
            <button
              class="mt-2 w-full rounded-lg bg-gray-900 text-white py-2 text-sm font-semibold disabled:opacity-50"
              @click="createProject"
              :disabled="!newProjectName.trim()"
            >
              Crea
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Tasks -->
      <main class="md:col-span-2">
        <div class="rounded-xl border bg-white p-4 shadow-sm">
          <div class="mb-3">
            <h2 class="font-semibold">
              Task — <span class="text-gray-700">{{ selectedProject()?.name ?? "Seleziona un progetto" }}</span>
            </h2>
          </div>

          <div v-if="!selectedProject()" class="text-sm text-gray-600">
            Seleziona un progetto dalla lista.
          </div>

          <div v-else>
            <div class="flex gap-2 mb-4">
              <input
                v-model="newTaskContent"
                class="flex-1 rounded-lg border px-3 py-2 text-sm"
                placeholder="Nuova task (required)"
                @keydown.enter.prevent="addTask"
              />
              <button
                class="rounded-lg bg-gray-900 text-white px-4 text-sm font-semibold disabled:opacity-50"
                @click="addTask"
                :disabled="!newTaskContent.trim()"
              >
                Aggiungi
              </button>
            </div>

            <ul class="space-y-2">
              <li
                v-for="t in selectedProject()!.tasks"
                :key="t.id"
                class="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <button class="flex items-center gap-2 text-left" @click="toggleTask(t)">
                  <span
                    class="inline-flex h-5 w-5 items-center justify-center rounded border"
                    :class="t.is_completed ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300'"
                  >
                    ✓
                  </span>
                  <span :class="t.is_completed ? 'line-through text-gray-500' : ''">
                    {{ t.content }}
                  </span>
                </button>

                <span class="text-xs text-gray-500">#{{ t.id }}</span>
              </li>
            </ul>

            <div v-if="selectedProject()!.tasks.length === 0" class="text-sm text-gray-600">
              Nessuna task. Aggiungine una.
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
