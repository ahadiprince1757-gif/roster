import React, { useState, useMemo } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddSaleModal = ({ isOpen, onClose }) => {
  const { addSale, metrics, currency } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    qty: '',
    price: '',         // price per bird
    weightMode: 'per_bird', // 'per_bird' | 'total' | 'use_avg'
    weight: '',        // kg per bird or total kg
    notes: '',
  });

  // Resolve weight per bird
  const weightPerBird = useMemo(() => {
    if (formData.weightMode === 'use_avg') {
      return metrics.latestAvgWeightKg > 0 ? metrics.latestAvgWeightKg : null;
    }
    if (formData.weightMode === 'total') {
      const qty = Number(formData.qty);
      const total = Number(formData.weight);
      return qty > 0 && total > 0 ? total / qty : null;
    }
    return Number(formData.weight) || null;
  }, [formData.weightMode, formData.weight, formData.qty, metrics.latestAvgWeightKg]);

  // Auto calculations
  const calc = useMemo(() => {
    const qty = Number(formData.qty);
    const price = Number(formData.price);
    if (!qty || qty <= 0) return null;

    const totalRevenue = qty * price;
    const totalWeightKg = weightPerBird ? qty * weightPerBird : null;
    const pricePerKg = totalWeightKg && price ? price / (weightPerBird || 1) : null;

    // Profit estimate (revenue - cost to produce those birds)
    const costPerBird = metrics.initialChicks > 0
      ? metrics.totalExpenses / metrics.initialChicks
      : 0;
    const estimatedProfit = price > 0 ? totalRevenue - (costPerBird * qty) : null;

    return {
      totalRevenue,
      totalWeightKg,
      pricePerKg: weightPerBird ? price / weightPerBird : null,
      estimatedProfit,
      costPerBird,
    };
  }, [formData.qty, formData.price, weightPerBird, metrics]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(formData.qty);
    const price = Number(formData.price);

    if (!qty || qty <= 0) { alert('Enter number of birds sold.'); return; }
    if (!price || price <= 0) { alert('Enter price per bird.'); return; }
    if (metrics.liveBirds > 0 && qty > metrics.liveBirds) {
      alert(`Cannot sell ${qty} birds — only ${metrics.liveBirds} live birds available.`);
      return;
    }

    addSale({
      date: formData.date,
      qty,
      price,
      weight: weightPerBird || 0,
    });

    onClose();
    setFormData({
      date: getTodayString(),
      qty: '',
      price: '',
      weightMode: 'per_bird',
      weight: '',
      notes: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Chicken Sale / Harvest">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Sale Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Birds Sold *</label>
            <input
              type="number"
              min="1"
              required
              placeholder={`Max: ${metrics.liveBirds} birds`}
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Price Per Bird ({currency}) *</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="e.g. 750"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Weight Entry</label>
            <select
              value={formData.weightMode}
              onChange={(e) => setFormData({ ...formData, weightMode: e.target.value })}
            >
              <option value="use_avg">Use flock avg weight ({metrics.latestAvgWeightKg.toFixed(2)} kg)</option>
              <option value="per_bird">Enter kg per bird</option>
              <option value="total">Enter total kg (auto ÷ by qty)</option>
            </select>
          </div>

          {formData.weightMode !== 'use_avg' && (
            <div className="field">
              <label>
                {formData.weightMode === 'total' ? 'Total Live Weight (kg)' : 'Weight Per Bird (kg)'}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.01"
                placeholder={formData.weightMode === 'total' ? 'e.g. 235' : 'e.g. 2.35'}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          )}

          {/* Live auto-calculated summary */}
          {calc && calc.totalRevenue > 0 && (
            <div className="field full-width">
              <div
                style={{
                  background: 'var(--primary-light)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {currency} {calc.totalRevenue.toLocaleString()}
                  </div>
                </div>
                {calc.totalWeightKg && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Weight</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {calc.totalWeightKg.toFixed(1)} kg
                    </div>
                  </div>
                )}
                {calc.pricePerKg && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price / kg</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                      {currency} {calc.pricePerKg.toFixed(0)}
                    </div>
                  </div>
                )}
                {calc.estimatedProfit !== null && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Profit</div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: calc.estimatedProfit >= 0 ? 'var(--primary)' : 'var(--danger)',
                    }}>
                      {currency} {calc.estimatedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Record Sale</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSaleModal;
