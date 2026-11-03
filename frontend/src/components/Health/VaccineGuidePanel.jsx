import React, { useState } from 'react';
import {
  VACCINATION_GUIDE,
  METHOD_GLOSSARY,
  FLOCK_TYPES,
  getGuideForType,
} from '../../data/vaccinationGuide';
import {
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Syringe,
  Droplets,
  Wind,
  Feather,
  Eye,
  Bird,
  Egg,
} from 'lucide-react';

// ── Icon helpers ─────────────────────────────────────────────────────────────

function getMethodIcon(key, size = 13) {
  switch (key) {
    case 'sc':
    case 'parenteral':
      return <Syringe size={size} />;
    case 'drinking_water':
      return <Droplets size={size} />;
    case 'coarse_spray':
      return <Wind size={size} />;
    case 'wing_web':
      return <Feather size={size} />;
    case 'intraocular':
      return <Eye size={size} />;
    default:
      return null;
  }
}

function getFlockIcon(key, size = 16) {
  switch (key) {
    case 'layer':
      return <Egg size={size} />;
    case 'broiler':
    case 'indigenous':
    default:
      return <Bird size={size} />;
  }
}

// ── Method badge with tap-to-explain ─────────────────────────────────────────

function MethodBadge({ methodKey }) {
  const [open, setOpen] = useState(false);
  const info = METHOD_GLOSSARY[methodKey];
  if (!info) return <span className="vg-method-plain">{methodKey}</span>;

  return (
    <span className="vg-method-wrap">
      <button
        className="vg-method-badge"
        onClick={() => setOpen((v) => !v)}
        title="Tap to learn what this means"
      >
        <span className="vg-badge-icon" style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: 4 }}>
          {getMethodIcon(methodKey)}
        </span>
        {info.label}
        <ChevronDown size={11} className={`vg-method-chevron ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <span className="vg-method-tooltip">
          <Info size={12} />
          {info.plain}
        </span>
      )}
    </span>
  );
}

// ── Mandatory / Optional badge ────────────────────────────────────────────────

function MandatoryBadge({ mandatory }) {
  return mandatory
    ? <span className="vg-badge vg-badge--core">Core</span>
    : <span className="vg-badge vg-badge--opt">Optional</span>;
}

// ── Flock type selector ───────────────────────────────────────────────────────

function FlockTypeSelector({ selected, onChange }) {
  return (
    <div className="vg-type-selector">
      {Object.entries(FLOCK_TYPES).map(([key, def]) => (
        <button
          key={key}
          className={`vg-type-btn ${selected === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          <span className="vg-type-icon">{getFlockIcon(key, 16)}</span>
          <span className="vg-type-label">{def.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Vaccine row (expanded / collapsed) ───────────────────────────────────────

function VaccineRow({ entry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={`vg-row ${expanded ? 'vg-row--expanded' : ''}`}
        onClick={() => setExpanded((v) => !v)}
        style={{ cursor: 'pointer' }}
      >
        <td>
          <div className="vg-vaccine-name">{entry.vaccine}</div>
          <div className="vg-vaccine-timing">{entry.timing}</div>
        </td>
        <td className="vg-protects-col">{entry.protects}</td>
        <td><MethodBadge methodKey={entry.method} /></td>
        <td><MandatoryBadge mandatory={entry.mandatory} /></td>
        <td className="vg-expand-icon">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>
      {expanded && (
        <tr className="vg-detail-row">
          <td colSpan={5}>
            <div className="vg-detail-panel">
              <div className="vg-detail-label">How to give it:</div>
              <div className="vg-detail-text">{entry.methodNote}</div>
              {entry.method && METHOD_GLOSSARY[entry.method] && (
                <div className="vg-detail-method-explain">
                  <strong>
                    <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: 4 }}>
                      {getMethodIcon(entry.method, 14)}
                    </span>
                    {METHOD_GLOSSARY[entry.method].label}:
                  </strong>{' '}
                  {METHOD_GLOSSARY[entry.method].plain}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const VaccineGuidePanel = () => {
  const [flockType, setFlockType] = useState('broiler');
  const [showMandatoryOnly, setShowMandatoryOnly] = useState(false);

  const entries = getGuideForType(flockType).filter((e) =>
    showMandatoryOnly ? e.mandatory : true
  );

  const def = FLOCK_TYPES[flockType];

  return (
    <div className="vg-container">
      {/* Header */}
      <div className="vg-header">
        <div>
          <h2 className="vg-title">
            <BookOpen size={20} />
            Vaccination Reference Guide
          </h2>
          <p className="vg-subtitle">
            Always available — select your flock type to see the correct programme.
            Tap any row to see how to administer the vaccine.
          </p>
        </div>
      </div>

      {/* Intro banner */}
      <div className="vg-intro-banner">
        <Shield size={18} />
        <p>
          <strong>Never miss a vaccination.</strong> Rosestar calculates vaccination dates
          from your chick arrival date, shows which vaccine to use, how to give it, and
          keeps a full history of what has been done and what is pending.
        </p>
      </div>

      {/* Flock type selector */}
      <div className="vg-panel">
        <div className="vg-panel-head">
          <h3>Select Flock Type</h3>
          <small>Only vaccines relevant to your flock type are shown.</small>
        </div>
        <FlockTypeSelector selected={flockType} onChange={setFlockType} />
        <div className="vg-type-desc">
          <span style={{ display: 'inline-flex', verticalAlign: 'middle' }}>{getFlockIcon(flockType, 16)}</span>
          <span>{def.description}</span>
        </div>
      </div>

      {/* Vaccination table */}
      <div className="vg-panel">
        <div className="vg-panel-head">
          <div>
            <h3>{def.label} — Vaccination Programme</h3>
            <small>{entries.length} vaccine entries · Tap any row to see instructions</small>
          </div>
          <button
            className={`vg-filter-btn ${showMandatoryOnly ? 'active' : ''}`}
            onClick={() => setShowMandatoryOnly((v) => !v)}
          >
            {showMandatoryOnly ? 'Show All' : 'Core Only'}
          </button>
        </div>

        <div className="vg-table-wrap">
          <table className="vg-table">
            <thead>
              <tr>
                <th>Vaccine &amp; Timing</th>
                <th>What it protects against</th>
                <th>How to give it</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <VaccineRow key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Method glossary */}
      <div className="vg-panel">
        <div className="vg-panel-head">
          <h3>Vaccination Method Glossary</h3>
          <small>Plain-language explanations of every administration method</small>
        </div>
        <div className="vg-glossary-grid">
          {Object.entries(METHOD_GLOSSARY).map(([key, item]) => (
            <div key={key} className="vg-glossary-card">
              <div className="vg-glossary-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getMethodIcon(key, 20)}
              </div>
              <div className="vg-glossary-label">{item.label}</div>
              <div className="vg-glossary-plain">{item.plain}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="vg-disclaimer">
        This guide is a general reference. Always consult your local veterinarian for a
        vaccination programme specific to your area and flock history. Dosages and dilution
        instructions vary by product — always follow the manufacturer's label.
      </p>
    </div>
  );
};

export default VaccineGuidePanel;
