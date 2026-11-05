/**
 * farmApi.js — Thin fetch wrapper for the Rosestar backend API.
 *
 * All functions return the parsed JSON on success, or null on failure
 * so the caller can gracefully fall back to localStorage / local state.
 *
 * BASE_URL is driven by the VITE_API_URL env variable:
 *   - Local dev  → set in frontend/.env        → http://localhost:3001
 *   - Production → set in Vercel dashboard      → https://<render-app>.onrender.com
 */

import { supabase } from './supabaseClient';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0');

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocalhost ? 'http://localhost:3001' : '');

async function api(path, options = {}) {
  if (!BASE_URL) {
    return null;
  }
  try {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

    // Attach Supabase access token if session exists
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.access_token) {
          headers['Authorization'] = `Bearer ${data.session.access_token}`;
        }
      } catch (_) {}
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn(`[farmApi] ${options.method || 'GET'} ${path} → ${res.status}`, err);
      return null;
    }
    return await res.json();
  } catch (e) {
    // Network unreachable — offline fallback will apply
    console.warn(`[farmApi] Network error on ${path}:`, e.message);
    return null;
  }
}

// ── Batches ───────────────────────────────────────────────────────────────────

export const fetchBatches = () => api('/api/batches');

export const fetchBatch = (id) => api(`/api/batches/${id}`);

export const createBatch = (data) =>
  api('/api/batches', { method: 'POST', body: JSON.stringify(data) });

export const updateBatch = (id, data) =>
  api(`/api/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteBatch = (id) =>
  api(`/api/batches/${id}`, { method: 'DELETE' });

// ── Weights ───────────────────────────────────────────────────────────────────

export const fetchWeights = (batchId) =>
  api(`/api/weights?batch_id=${batchId}`);

export const addWeight = (data) =>
  api('/api/weights', { method: 'POST', body: JSON.stringify(data) });

export const deleteWeight = (id) =>
  api(`/api/weights/${id}`, { method: 'DELETE' });

// ── Feeds ─────────────────────────────────────────────────────────────────────

export const fetchFeeds = (batchId) =>
  api(`/api/feeds?batch_id=${batchId}`);

export const addFeed = (data) =>
  api('/api/feeds', { method: 'POST', body: JSON.stringify(data) });

export const deleteFeed = (id) =>
  api(`/api/feeds/${id}`, { method: 'DELETE' });

// ── Health Events ─────────────────────────────────────────────────────────────

export const fetchHealthEvents = (batchId) =>
  api(`/api/health-events?batch_id=${batchId}`);

export const addHealthEvent = (data) =>
  api('/api/health-events', { method: 'POST', body: JSON.stringify(data) });

export const bulkAddHealthEvents = (records) =>
  api('/api/health-events/bulk', { method: 'POST', body: JSON.stringify({ records }) });

export const toggleHealthEvent = (id) =>
  api(`/api/health-events/${id}/toggle`, { method: 'PATCH' });

export const deleteHealthEvent = (id) =>
  api(`/api/health-events/${id}`, { method: 'DELETE' });

// ── Deaths ────────────────────────────────────────────────────────────────────

export const fetchDeaths = (batchId) =>
  api(`/api/deaths?batch_id=${batchId}`);

export const addDeath = (data) =>
  api('/api/deaths', { method: 'POST', body: JSON.stringify(data) });

export const deleteDeath = (id) =>
  api(`/api/deaths/${id}`, { method: 'DELETE' });

// ── Finances ──────────────────────────────────────────────────────────────────

export const fetchFinances = (batchId) =>
  api(`/api/finances?batch_id=${batchId}`);

export const fetchFinanceSummary = (batchId) =>
  api(`/api/finances/summary?batch_id=${batchId}`);

export const addExpense = (data) =>
  api('/api/finances', { method: 'POST', body: JSON.stringify({ ...data, type: 'Expense' }) });

export const addSale = (data) =>
  api('/api/finances', { method: 'POST', body: JSON.stringify({ ...data, type: 'Sale' }) });

export const deleteFinance = (id) =>
  api(`/api/finances/${id}`, { method: 'DELETE' });

// ── Health check ──────────────────────────────────────────────────────────────

export const checkApiHealth = () => api('/api/health');

// ── Broiler Diseases Catalog ──────────────────────────────────────────────────

export const fetchBroilerDiseases = (params = {}) => {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.severity && params.severity !== 'All') query.set('severity', params.severity);
  if (params.emergency !== undefined) query.set('emergency', params.emergency);
  if (params.search) query.set('search', params.search);
  const qs = query.toString();
  return api('/api/broiler-diseases' + (qs ? '?' + qs : ''));
};

export const fetchBroilerDiseaseById = (id) =>
  api('/api/broiler-diseases/' + id);
