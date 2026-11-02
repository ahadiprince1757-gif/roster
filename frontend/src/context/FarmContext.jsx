import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateSampleData } from '../data/sampleData';
import { RECOMMENDED_PROTOCOLS } from '../data/standardVaccines';
import { calculateFlockMetrics } from '../utils/calculations';
import * as api from '../api/farmApi';

const FarmContext = createContext();

const STORAGE_KEY = 'broilerOS_v2';
const LEGACY_KEY = 'broilerOS_v1';

const initialEmptyBatch = {
  id: 'flock-default',
  name: 'My Broiler Batch',
  date: '',
  birds: 500,
  breed: 'Cobb 500',
  supplier: 'Quality Chicks Ltd',
  chickCost: 50000,
  targetAge: 42,
  targetWeight: 2500,
};

/** Normalise a Supabase-returned batch (snake_case) → app shape (camelCase). */
function normalizeBatch(b) {
  return {
    id: b.id,
    name: b.name || 'My Broiler Batch',
    date: b.date || '',
    birds: b.birds || 0,
    breed: b.breed || '',
    supplier: b.supplier || '',
    chickCost: b.chick_cost || 0,
    targetAge: b.target_age || 42,
    targetWeight: b.target_weight || 2500,
    notes: b.notes || '',
  };
}

/** Load saved farm data from localStorage (v2 → v1 migration → sample). */
function loadFromStorage() {
  try {
    const savedV2 = localStorage.getItem(STORAGE_KEY);
    if (savedV2) return JSON.parse(savedV2);

    const savedV1 = localStorage.getItem(LEGACY_KEY);
    if (savedV1) {
      const legacy = JSON.parse(savedV1);
      if (legacy && (legacy.batch?.birds > 0 || legacy.weights?.length > 0)) {
        return {
          batch: { ...initialEmptyBatch, ...legacy.batch },
          weights: legacy.weights || [],
          feeds: legacy.feeds || [],
          health: legacy.health || [],
          deaths: legacy.deaths || [],
          finances: legacy.finances || [],
        };
      }
    }
  } catch (e) {
    console.error('Error loading stored farm data:', e);
  }
  return generateSampleData();
}

export const FarmProvider = ({ children }) => {
  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('broilerOS_theme') || 'light');

  // Currency
  const [currency, setCurrency] = useState(() => localStorage.getItem('broilerOS_currency') || 'KSh');

  // Main Farm Data — initialise from localStorage immediately for instant render
  const [farmData, setFarmData] = useState(loadFromStorage);

  // Tracks whether we've successfully synced with the backend
  const [apiReady, setApiReady] = useState(false);
  // The UUID from Supabase for the active batch
  const [activeBatchId, setActiveBatchId] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Sync theme to DOM ────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('broilerOS_theme', theme);
  }, [theme]);

  // ── Sync currency to storage ─────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('broilerOS_currency', currency);
  }, [currency]);

  // ── Sync farmData to localStorage (offline cache) ────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farmData));
    } catch (e) {
      console.error('Error saving farm data:', e);
    }
  }, [farmData]);

  // ── Bootstrap: try to load from API on mount ─────────────────────────────────
  useEffect(() => {
    async function bootstrap() {
      const health = await api.checkApiHealth();
      if (!health) return; // offline — localStorage data already showing

      const batches = await api.fetchBatches();
      if (!batches || batches.length === 0) return; // no remote batch yet

      // Load the most recent batch (API returns newest first)
      const full = await api.fetchBatch(batches[0].id);
      if (!full) return;

      setActiveBatchId(full.batch.id);
      setApiReady(true);
      setFarmData({
        batch: normalizeBatch(full.batch),
        weights: full.weights || [],
        feeds: full.feeds || [],
        health: full.health || [],
        deaths: full.deaths || [],
        finances: full.finances || [],
      });
    }
    bootstrap();
  }, []);

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  // ── CRUD ACTIONS ─────────────────────────────────────────────────────────────

  const updateBatch = useCallback(async (batchDetails) => {
    // Optimistic local update
    setFarmData((prev) => ({ ...prev, batch: { ...prev.batch, ...batchDetails } }));

    if (activeBatchId) {
      // Map camelCase → snake_case for API
      const payload = {
        name: batchDetails.name,
        date: batchDetails.date,
        birds: batchDetails.birds,
        breed: batchDetails.breed,
        supplier: batchDetails.supplier,
        chick_cost: batchDetails.chickCost,
        target_age: batchDetails.targetAge,
        target_weight: batchDetails.targetWeight,
        notes: batchDetails.notes,
      };
      // Strip undefined keys
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      await api.updateBatch(activeBatchId, payload);
    }
  }, [activeBatchId]);

  const addWeight = useCallback(async (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      sample: Number(record.sample),
      avg: Number(record.avg),
      min: Number(record.min) || Number(record.avg),
      max: Number(record.max) || Number(record.avg),
      notes: record.notes || '',
    };
    setFarmData((prev) => ({ ...prev, weights: [...prev.weights, newRecord] }));

    if (activeBatchId) {
      const saved = await api.addWeight({
        batch_id: activeBatchId,
        date: record.date,
        sample: newRecord.sample,
        avg: newRecord.avg,
        min: newRecord.min,
        max: newRecord.max,
        notes: newRecord.notes,
      });
      // Swap temp id for real UUID
      if (saved) {
        setFarmData((prev) => ({
          ...prev,
          weights: prev.weights.map((w) => (w.id === newRecord.id ? { ...w, id: saved.id } : w)),
        }));
      }
    }
  }, [activeBatchId]);

  const deleteWeight = useCallback(async (id) => {
    setFarmData((prev) => ({ ...prev, weights: prev.weights.filter((w) => w.id !== id) }));
    if (activeBatchId) await api.deleteWeight(id);
  }, [activeBatchId]);

  const addFeed = useCallback(async (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      type: record.type,
      category: record.category,
      qty: Number(record.qty),
      cost: record.type === 'purchase' ? Number(record.cost || 0) : 0,
      notes: record.notes || '',
    };
    setFarmData((prev) => ({ ...prev, feeds: [...prev.feeds, newRecord] }));

    if (activeBatchId) {
      const saved = await api.addFeed({
        batch_id: activeBatchId,
        date: record.date,
        type: record.type,
        category: record.category,
        qty: newRecord.qty,
        cost: newRecord.cost,
        notes: newRecord.notes,
      });
      if (saved) {
        setFarmData((prev) => ({
          ...prev,
          feeds: prev.feeds.map((f) => (f.id === newRecord.id ? { ...f, id: saved.id } : f)),
        }));
      }
    }
  }, [activeBatchId]);

  const deleteFeed = useCallback(async (id) => {
    setFarmData((prev) => ({ ...prev, feeds: prev.feeds.filter((f) => f.id !== id) }));
    if (activeBatchId) await api.deleteFeed(id);
  }, [activeBatchId]);

  const addHealth = useCallback(async (record) => {
    const newRecord = {
      id: Date.now(),
      name: record.name,
      date: record.date,
      type: record.type || 'Vaccination',
      method: record.method || '',
      status: record.status || 'Pending',
      notes: record.notes || '',
    };
    setFarmData((prev) => ({ ...prev, health: [...prev.health, newRecord] }));

    if (activeBatchId) {
      const saved = await api.addHealthEvent({
        batch_id: activeBatchId,
        name: newRecord.name,
        date: newRecord.date,
        type: newRecord.type,
        method: newRecord.method,
        status: newRecord.status,
        notes: newRecord.notes,
      });
      if (saved) {
        setFarmData((prev) => ({
          ...prev,
          health: prev.health.map((h) => (h.id === newRecord.id ? { ...h, id: saved.id } : h)),
        }));
      }
    }
  }, [activeBatchId]);

  const toggleHealthStatus = useCallback(async (id) => {
    setFarmData((prev) => ({
      ...prev,
      health: prev.health.map((h) =>
        h.id === id ? { ...h, status: h.status === 'Completed' ? 'Pending' : 'Completed' } : h
      ),
    }));
    if (activeBatchId) await api.toggleHealthEvent(id);
  }, [activeBatchId]);

  const deleteHealth = useCallback(async (id) => {
    setFarmData((prev) => ({ ...prev, health: prev.health.filter((h) => h.id !== id) }));
    if (activeBatchId) await api.deleteHealthEvent(id);
  }, [activeBatchId]);

  const addDeath = useCallback(async (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      qty: Number(record.qty),
      cause: record.cause || 'Unspecified',
    };
    setFarmData((prev) => ({ ...prev, deaths: [...prev.deaths, newRecord] }));

    if (activeBatchId) {
      const saved = await api.addDeath({
        batch_id: activeBatchId,
        date: record.date,
        qty: newRecord.qty,
        cause: newRecord.cause,
      });
      if (saved) {
        setFarmData((prev) => ({
          ...prev,
          deaths: prev.deaths.map((d) => (d.id === newRecord.id ? { ...d, id: saved.id } : d)),
        }));
      }
    }
  }, [activeBatchId]);

  const deleteDeath = useCallback(async (id) => {
    setFarmData((prev) => ({ ...prev, deaths: prev.deaths.filter((d) => d.id !== id) }));
    if (activeBatchId) await api.deleteDeath(id);
  }, [activeBatchId]);

  const addExpense = useCallback(async (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      type: 'Expense',
      description: `${record.category} - ${record.description}`,
      amount: Number(record.amount),
    };
    setFarmData((prev) => ({ ...prev, finances: [...prev.finances, newRecord] }));

    if (activeBatchId) {
      const saved = await api.addExpense({
        batch_id: activeBatchId,
        date: record.date,
        description: newRecord.description,
        amount: newRecord.amount,
      });
      if (saved) {
        setFarmData((prev) => ({
          ...prev,
          finances: prev.finances.map((f) => (f.id === newRecord.id ? { ...f, id: saved.id } : f)),
        }));
      }
    }
  }, [activeBatchId, currency]);

  const addSale = useCallback(async (record) => {
    const qty = Number(record.qty);
    const price = Number(record.price);
    const amount = qty * price;
    const newRecord = {
      id: Date.now(),
      date: record.date,
      type: 'Sale',
      description: `${qty} birds sold @ ${currency} ${price.toLocaleString()}/bird`,
      amount,
      qty,
      weight: Number(record.weight || 0),
    };
    setFarmData((prev) => ({ ...prev, finances: [...prev.finances, newRecord] }));

    if (activeBatchId) {
      const saved = await api.addSale({
        batch_id: activeBatchId,
        date: record.date,
        description: newRecord.description,
        amount,
        qty,
        weight: newRecord.weight,
      });
      if (saved) {
        setFarmData((prev) => ({
          ...prev,
          finances: prev.finances.map((f) => (f.id === newRecord.id ? { ...f, id: saved.id } : f)),
        }));
      }
    }
  }, [activeBatchId, currency]);

  const deleteFinance = useCallback(async (id) => {
    setFarmData((prev) => ({ ...prev, finances: prev.finances.filter((f) => f.id !== id) }));
    if (activeBatchId) await api.deleteFinance(id);
  }, [activeBatchId]);

  // One-click load standard vaccination schedule
  const loadStandardVaccinationSchedule = useCallback(async () => {
    if (!farmData.batch.date) {
      alert('Please set a chick arrival date in Batch Settings first.');
      return;
    }
    const startDate = new Date(farmData.batch.date + 'T00:00:00');
    const newActivities = RECOMMENDED_PROTOCOLS.map((proto, idx) => {
      const scheduledDate = new Date(startDate.getTime() + (proto.dayOffset - 1) * 86400000);
      return {
        id: Date.now() + idx,
        name: proto.name,
        date: scheduledDate.toISOString().slice(0, 10),
        type: proto.type,
        method: proto.method,
        status: 'Pending',
        notes: proto.notes,
      };
    });

    setFarmData((prev) => ({ ...prev, health: [...prev.health, ...newActivities] }));

    if (activeBatchId) {
      const records = newActivities.map((a) => ({
        batch_id: activeBatchId,
        name: a.name,
        date: a.date,
        type: a.type,
        method: a.method,
        status: a.status,
        notes: a.notes,
      }));
      await api.bulkAddHealthEvents(records);
    }
  }, [farmData.batch.date, activeBatchId]);

  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset and start a fresh empty flock?')) {
      setActiveBatchId(null);
      setApiReady(false);
      setFarmData({
        batch: { ...initialEmptyBatch, date: new Date().toISOString().slice(0, 10) },
        weights: [],
        feeds: [],
        health: [],
        deaths: [],
        finances: [],
      });
    }
  };

  const loadDemoData = () => {
    if (window.confirm('Load sample flock demonstration data? (Alpha Flock 2026-B)')) {
      setActiveBatchId(null);
      setApiReady(false);
      setFarmData(generateSampleData());
    }
  };

  // Compute live flock metrics
  const metrics = calculateFlockMetrics(
    farmData.batch,
    farmData.weights,
    farmData.feeds,
    farmData.deaths,
    farmData.finances
  );

  return (
    <FarmContext.Provider
      value={{
        farmData,
        metrics,
        currency,
        setCurrency,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        apiReady,
        activeBatchId,
        updateBatch,
        addWeight,
        deleteWeight,
        addFeed,
        deleteFeed,
        addHealth,
        toggleHealthStatus,
        deleteHealth,
        addDeath,
        deleteDeath,
        addExpense,
        addSale,
        deleteFinance,
        loadStandardVaccinationSchedule,
        resetAllData,
        loadDemoData,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
