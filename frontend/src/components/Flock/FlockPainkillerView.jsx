import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { calculateFlockMetrics, formatNumber } from '../../utils/calculations';
import { getCobbStandard } from '../../data/cobbStandards';
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Plus,
  Scale,
  Stethoscope,
} from 'lucide-react';

const FlockPainkillerView = ({ onOpenAddModal, onNavigate }) => {
  const { farmData } = useFarm();
  const { batch, weights, feeds, deaths, finances } = farmData;
  const metrics = calculateFlockMetrics(batch, weights, feeds, deaths, finances);

  const [expandedCulprit, setExpandedCulprit] = useState(null);

  const currentDay = Math.min(42, Math.max(1, metrics.currentFlockAge || 1));
  const standardPoint = getCobbStandard(currentDay);
  const targetWeightG = Number(standardPoint?.targetWeight || standardPoint?.weight || Math.round(42 + currentDay * 55));

  const actualWeightG = Number(metrics.latestAvgWeightGrams || 0);
  const weightDiff = actualWeightG > 0 ? actualWeightG - targetWeightG : 0;
  const isBehind = weightDiff < -40 && actualWeightG > 0;
  const percentDiff = targetWeightG > 0 && actualWeightG > 0
    ? Math.abs((weightDiff / targetWeightG) * 100).toFixed(1)
    : '0';

  const ROOT_CULPRITS = [
    {
      id: 'feeder_space',
      title: 'Feeder / Drinker Space Competition',
      check: '1 bell drinker per 75 birds; 1 feeder per 50 birds. If birds climb on each other at feeding, timid birds are starving.',
      action: 'Add extra feeding pans uniformly on the floor so smaller birds can feed unhindered.',
    },
    {
      id: 'brooding_chill',
      title: 'Brooding Temperature (Week 1)',
      check: 'If floor temperature dropped below 30°C in the first 7 days, chicks failed to absorb yolk, stunting gut villi.',
      action: 'Provide a 2-day water boost of amino acids + electrolytes + liver tonic to stimulate absorption.',
    },
    {
      id: 'feed_protein',
      title: 'Dietary Crude Protein Deficit',
      check: 'Check crude protein (CP): Starter requires ≥ 22% CP, Grower ≥ 20% CP. Check for rancid odor or excessive dust.',
      action: 'Test feed batch or switch feed supplier if birds eat heavily without gaining weight.',
    },
    {
      id: 'gut_coccidiosis',
      title: 'Subclinical Coccidiosis / Enteritis',
      check: 'Examine droppings for orange mucus, watery patches, or undigested feed grains.',
      action: 'Run the Poultry Doctor triage or administer gut acidifiers / anticoccidial water treatment.',
    },
  ];

  return (
    <div className="flock-clean-wrap">
      {/* ── Top Hero: Pure Typography ── */}
      <section className="flock-hero-minimal">
        <div className="flock-meta-tag-row">
          <span className="flock-meta-tag">DAY {currentDay} BENCHMARK</span>
          <span className={`flock-status-badge ${isBehind ? 'behind' : 'optimal'}`}>
            {isBehind ? `${percentDiff}% Behind Standard` : 'Optimal Curve'}
          </span>
        </div>

        <div className="flock-hero-weight">
          {actualWeightG > 0 ? `${actualWeightG} g` : 'No Weight Logged'}
        </div>

        <div className="flock-sub-weight-row">
          <span>Target: <strong>{targetWeightG} g</strong></span>
          <span className="flock-sub-dot">·</span>
          <span className={weightDiff < 0 ? 'neg-diff' : 'pos-diff'}>
            Gap: <strong>{weightDiff > 0 ? `+${weightDiff} g` : `${weightDiff} g`}</strong> / bird
          </span>
        </div>
      </section>

      {/* ── 3 Vital Numbers (Clean line) ── */}
      <section className="flock-stats-strip">
        <div className="flock-stat-col">
          <span className="flock-stat-label">FEED CONVERSION</span>
          <span className="flock-stat-number">{formatNumber(metrics.fcr, 2)}</span>
        </div>
        <div className="flock-stat-col">
          <span className="flock-stat-label">SURVIVAL</span>
          <span className="flock-stat-number">{formatNumber(metrics.survivalRate, 1)}%</span>
        </div>
        <div className="flock-stat-col">
          <span className="flock-stat-label">EPEF SCORE</span>
          <span className="flock-stat-number">{formatNumber(metrics.epef, 0)}</span>
        </div>
      </section>

      {/* ── Log Weight Action Pill ── */}
      <div className="flock-action-row">
        <button className="flock-pill-btn" onClick={() => onOpenAddModal('weight')}>
          <Plus size={15} />
          <span>Record Weight Sample</span>
        </button>
      </div>

      {/* ── THE SOLVER: 4 Clean Accordion Rows ── */}
      <section className="flock-solver-section">
        <div className="flock-solver-header">
          <span className="flock-solver-title">WHY ARE BIRDS BEHIND TARGET?</span>
        </div>

        <div className="flock-culprit-list">
          {ROOT_CULPRITS.map((c, i) => {
            const isOpen = expandedCulprit === c.id;
            return (
              <div
                key={c.id}
                className={`flock-culprit-item ${isOpen ? 'open' : ''}`}
                onClick={() => setExpandedCulprit(isOpen ? null : c.id)}
              >
                <div className="flock-culprit-row">
                  <span className="flock-culprit-num">0{i + 1}</span>
                  <span className="flock-culprit-name">{c.title}</span>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {isOpen && (
                  <div className="flock-culprit-expanded">
                    <p><strong>Check:</strong> {c.check}</p>
                    <p className="culprit-action-line"><strong>Fix:</strong> {c.action}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Link to Diagnose */}
        <div className="flock-triage-link" onClick={() => onNavigate('diagnose')}>
          <span>Suspect illness or severe drop? Triage symptoms</span>
          <ArrowRight size={14} />
        </div>
      </section>
    </div>
  );
};

export default FlockPainkillerView;
