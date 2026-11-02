import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSampleData } from '../data/sampleData';
import { RECOMMENDED_PROTOCOLS } from '../data/standardVaccines';
import { calculateFlockMetrics } from '../utils/calculations';

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

export const FarmProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('broilerOS_theme') || 'light';
  });

  // Currency
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('broilerOS_currency') || 'KSh';
  });

  // Main Farm Data
  const [farmData, setFarmData] = useState(() => {
    try {
      // 1. Try v2 storage
      const savedV2 = localStorage.getItem(STORAGE_KEY);
      if (savedV2) {
        return JSON.parse(savedV2);
      }

      // 2. Try migrating legacy v1 data
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

    // Default to rich realistic sample data for instant satisfaction
    return generateSampleData();
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('broilerOS_theme', theme);
  }, [theme]);

  // Sync currency to storage
  useEffect(() => {
    localStorage.setItem('broilerOS_currency', currency);
  }, [currency]);

  // Sync data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farmData));
    } catch (e) {
      console.error('Error saving farm data:', e);
    }
  }, [farmData]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- CRUD ACTIONS ---

  const updateBatch = (batchDetails) => {
    setFarmData((prev) => ({
      ...prev,
      batch: { ...prev.batch, ...batchDetails },
    }));
  };

  const addWeight = (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      sample: Number(record.sample),
      avg: Number(record.avg),
      min: Number(record.min) || Number(record.avg),
      max: Number(record.max) || Number(record.avg),
      notes: record.notes || '',
    };
    setFarmData((prev) => ({
      ...prev,
      weights: [...prev.weights, newRecord],
    }));
  };

  const deleteWeight = (id) => {
    setFarmData((prev) => ({
      ...prev,
      weights: prev.weights.filter((w) => w.id !== id),
    }));
  };

  const addFeed = (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      type: record.type, // 'purchase' | 'consumption'
      category: record.category, // 'Starter' | 'Grower' | 'Finisher' | 'Other'
      qty: Number(record.qty),
      cost: record.type === 'purchase' ? Number(record.cost || 0) : 0,
      notes: record.notes || '',
    };
    setFarmData((prev) => ({
      ...prev,
      feeds: [...prev.feeds, newRecord],
    }));
  };

  const deleteFeed = (id) => {
    setFarmData((prev) => ({
      ...prev,
      feeds: prev.feeds.filter((f) => f.id !== id),
    }));
  };

  const addHealth = (record) => {
    const newRecord = {
      id: Date.now(),
      name: record.name,
      date: record.date,
      type: record.type || 'Vaccination',
      method: record.method || '',
      status: record.status || 'Pending',
      notes: record.notes || '',
    };
    setFarmData((prev) => ({
      ...prev,
      health: [...prev.health, newRecord],
    }));
  };

  const toggleHealthStatus = (id) => {
    setFarmData((prev) => ({
      ...prev,
      health: prev.health.map((h) =>
        h.id === id ? { ...h, status: h.status === 'Completed' ? 'Pending' : 'Completed' } : h
      ),
    }));
  };

  const deleteHealth = (id) => {
    setFarmData((prev) => ({
      ...prev,
      health: prev.health.filter((h) => h.id !== id),
    }));
  };

  const addDeath = (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      qty: Number(record.qty),
      cause: record.cause || 'Unspecified',
    };
    setFarmData((prev) => ({
      ...prev,
      deaths: [...prev.deaths, newRecord],
    }));
  };

  const deleteDeath = (id) => {
    setFarmData((prev) => ({
      ...prev,
      deaths: prev.deaths.filter((d) => d.id !== id),
    }));
  };

  const addExpense = (record) => {
    const newRecord = {
      id: Date.now(),
      date: record.date,
      type: 'Expense',
      description: `${record.category} - ${record.description}`,
      amount: Number(record.amount),
    };
    setFarmData((prev) => ({
      ...prev,
      finances: [...prev.finances, newRecord],
    }));
  };

  const addSale = (record) => {
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
    setFarmData((prev) => ({
      ...prev,
      finances: [...prev.finances, newRecord],
    }));
  };

  const deleteFinance = (id) => {
    setFarmData((prev) => ({
      ...prev,
      finances: prev.finances.filter((f) => f.id !== id),
    }));
  };

  // One-click Auto-load Standard Health Protocols based on batch arrival date
  const loadStandardVaccinationSchedule = () => {
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

    setFarmData((prev) => ({
      ...prev,
      health: [...prev.health, ...newActivities],
    }));
  };

  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset and start a fresh empty flock?')) {
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
