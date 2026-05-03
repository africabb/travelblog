import type { Entry, DayContext, DaySummary, FeedResponse, Stats } from './types';

const BASE = process.env.DIARY_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';
const SECRET = process.env.DIARY_API_SECRET ?? '';

function privateHeaders(): HeadersInit {
  return { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' };
}

async function get<T>(path: string, priv = false): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: priv ? privateHeaders() : { 'Content-Type': 'application/json' },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function patch<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: privateHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: privateHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: privateHeaders() });
  if (!res.ok) throw new Error(`DELETE ${path} → ${res.status}`);
}

// ── Public ────────────────────────────────────────────────────
export const fetchFeed  = (limit = 20, offset = 0, date?: string) =>
  get<FeedResponse>(
    `/api/feed?limit=${limit}&offset=${offset}${date ? `&date=${date}` : ''}`,
  );

export const fetchStats = () => get<Stats>('/api/stats');

// ── Private ───────────────────────────────────────────────────
export const fetchDrafts    = (date?: string) =>
  get<Entry[]>(`/api/drafts${date ? `?date=${date}` : ''}`, true);

export const fetchDraft     = (id: string) =>
  get<Entry>(`/api/drafts/${id}`, true);

export const fetchDay       = (date: string) =>
  get<DayContext>(`/api/days/${date}`, true);

export const fetchDays      = () =>
  get<DaySummary[]>('/api/days', true);

export const approveDraft   = (id: string) =>
  patch<Entry>(`/api/drafts/${id}/approve`, {});

export const publishDraft   = (id: string) =>
  patch<Entry>(`/api/drafts/${id}/publish`, {});

export const publishDay     = (date: string) =>
  post(`/api/days/${date}/publish`);

export const deleteDraft    = (id: string) => del(`/api/drafts/${id}`);

export const updateEntry    = (id: string, body: Partial<Entry>) =>
  patch<Entry>(`/api/entries/${id}`, body);
