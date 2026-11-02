import React from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import { Printer, Download } from 'lucide-react';

const BatchReportModal = ({ isOpen, onClose }) => {
  const { farmData, metrics, currency, theme } = useFarm();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Flock Performance Audit Certificate" maxWidth="720px">
      <div id="printableReport" style={{ padding: '8px 4px' }}>
        {/* Certificate Header with Official Rooster Logo */}
        <div
          style={{
            borderBottom: '2px solid var(--primary)',
            paddingBottom: '16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/logo.png"
              alt="Rosestar Logo"
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'contain',
                filter: theme === 'dark' ? 'invert(1)' : 'none',
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '4px' }}>
                Rosestar Commercial Audit Report
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Flock Batch: <strong>{farmData.batch.name || 'Alpha Batch'}</strong> · Breed: <strong>{farmData.batch.breed || 'Cobb 500'}</strong>
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Age: Day {metrics.currentFlockAge || 1}</div>
          </div>
        </div>

        {/* 2x2 Performance Summary Grids */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {/* Production Metrics */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '12px', color: 'var(--primary)' }}>
              Biological Performance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Initial Chick Placement:</span>
                <strong>{formatNumber(metrics.initialChicks)} birds</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current Live Birds:</span>
                <strong>{formatNumber(metrics.liveBirds)} birds</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Flock Survivability:</span>
                <strong style={{ color: 'var(--primary)' }}>{formatNumber(metrics.survivalRate, 1)}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Latest Average Weight:</span>
                <strong>{formatNumber(metrics.latestAvgWeightGrams)} g</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Average Daily Gain (ADG):</span>
                <strong>{formatNumber(metrics.adg, 1)} g/day</strong>
              </div>
            </div>
          </div>

          {/* Efficiency & Feed */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '12px', color: 'var(--primary)' }}>
              Feed Efficiency & Index
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Feed Conversion Ratio (FCR):</span>
                <strong style={{ fontSize: '1rem', color: metrics.fcr <= 1.65 ? 'var(--primary)' : 'var(--accent-amber)' }}>
                  {metrics.fcr > 0 ? formatNumber(metrics.fcr, 2) : 'N/A'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>EPEF Efficiency Score:</span>
                <strong>{Math.round(metrics.epef) || 'N/A'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Feed Consumed:</span>
                <strong>{formatNumber(metrics.feedConsumedKg)} kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Remaining Feed Stock:</span>
                <strong>{formatNumber(metrics.feedStockRemainingKg)} kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Feed Cost:</span>
                <strong>{formatCurrency(metrics.feedExpenses, currency)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '12px', color: 'var(--primary)' }}>
            Financial Economics
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div>
              <small style={{ color: 'var(--text-muted)', display: 'block' }}>Total Expenses</small>
              <strong style={{ fontSize: '1.05rem', color: 'var(--accent-red)' }}>
                {formatCurrency(metrics.totalExpenses, currency)}
              </strong>
            </div>
            <div>
              <small style={{ color: 'var(--text-muted)', display: 'block' }}>Total Revenue</small>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
                {formatCurrency(metrics.totalRevenue, currency)}
              </strong>
            </div>
            <div>
              <small style={{ color: 'var(--text-muted)', display: 'block' }}>Net Profit / Loss</small>
              <strong
                style={{
                  fontSize: '1.05rem',
                  color: metrics.netProfit >= 0 ? 'var(--primary)' : 'var(--accent-red)',
                }}
              >
                {formatCurrency(metrics.netProfit, currency)}
              </strong>
            </div>
            <div>
              <small style={{ color: 'var(--text-muted)', display: 'block' }}>Cost Per Live Bird</small>
              <strong style={{ fontSize: '1.05rem' }}>
                {formatCurrency(metrics.costPerLiveBird, currency)}
              </strong>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="form-actions" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            Print / Save PDF
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BatchReportModal;
