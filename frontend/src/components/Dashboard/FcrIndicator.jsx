import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatNumber } from '../../utils/calculations';
import { Zap, Award, Info } from 'lucide-react';

const FcrIndicator = () => {
  const { metrics } = useFarm();

  const fcr = metrics.fcr;
  const epef = Math.round(metrics.epef);

  // FCR rating
  let fcrStatus = 'Optimal';
  let fcrPillClass = 'pill-green';
  if (fcr === 0) {
    fcrStatus = 'Need Feed Logs';
    fcrPillClass = 'pill-blue';
  } else if (fcr < 1.55) {
    fcrStatus = 'Excellent Efficiency';
    fcrPillClass = 'pill-green';
  } else if (fcr <= 1.72) {
    fcrStatus = 'Good / Standard';
    fcrPillClass = 'pill-amber';
  } else {
    fcrStatus = 'Elevated Consumption';
    fcrPillClass = 'pill-red';
  }

  // EPEF rating
  let epefRating = 'Standard';
  if (epef > 380) epefRating = 'World Class';
  else if (epef > 320) epefRating = 'Profitable';
  else if (epef > 0) epefRating = 'Needs Optimization';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* FCR Card */}
      <div
        style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={16} />
            </div>
            <strong style={{ fontSize: '0.85rem' }}>Feed Conversion (FCR)</strong>
          </div>
          <span className={`metric-pill ${fcrPillClass}`}>{fcrStatus}</span>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800 }}>
            {fcr > 0 ? formatNumber(fcr, 2) : '—'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            kg feed per kg meat
          </span>
        </div>

        {/* FCR progress bar visualizer */}
        <div
          style={{
            height: '6px',
            width: '100%',
            background: 'var(--card-border)',
            borderRadius: 'var(--radius-full)',
            marginTop: '10px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: fcr > 0 ? `${Math.min(100, Math.max(10, (1 - (fcr - 1.3) / 1.0) * 100))}%` : '0%',
              background: fcr <= 1.6 ? 'var(--primary)' : fcr <= 1.75 ? 'var(--accent-amber)' : 'var(--accent-red)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-light)' }}>
          <span>1.40 (Elite)</span>
          <span>1.65 (Standard)</span>
          <span>1.90+ (High)</span>
        </div>
      </div>

      {/* EPEF Index Card */}
      <div
        style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--accent-amber-light)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={16} />
            </div>
            <strong style={{ fontSize: '0.85rem' }}>EPEF Efficiency Score</strong>
          </div>
          <span className="metric-pill pill-amber">{epefRating}</span>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800 }}>
            {epef > 0 ? epef : '—'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Broiler Performance Index
          </span>
        </div>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Calculated from survivability ({formatNumber(metrics.survivalRate, 1)}%), live weight ({formatNumber(metrics.latestAvgWeightGrams)}g), age (Day {metrics.currentFlockAge}) & FCR.
        </p>
      </div>
    </div>
  );
};

export default FcrIndicator;
