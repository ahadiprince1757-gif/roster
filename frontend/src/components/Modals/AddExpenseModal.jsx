import React, { useState, useMemo } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const EXPENSE_CATEGORIES = [
  { value: 'Chicks', label: 'Day-old Chicks & Transport' },
  { value: 'Feed', label: 'Feed (Starter / Grower / Finisher)' },
  { value: 'Vaccines', label: 'Vaccines & Veterinary Drugs' },
  { value: 'Bedding', label: 'Bedding & Wood Shavings' },
  { value: 'Brooding', label: 'Heating Fuel & Brooding Gas' },
  { value: 'Labor', label: 'Farm Labor / Staff Stipend' },
  { value: 'Electricity', label: 'Electricity & Water Utilities' },
  { value: 'Disinfection', label: 'Disinfectants & Bio-Security' },
  { value: 'Maintenance', label: 'Equipment / Pen Maintenance' },
  { value: 'Other', label: 'Other Miscellaneous' },
];

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense, currency, metrics } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    category: 'Feed',
    description: '',
    amount: '',
    qty: '',       // optional: quantity of items (e.g. bags, vials)
    unitPrice: '', // optional: unit price → auto total
    entryMode: 'total', // 'total' or 'unit'
  });

  // Auto total from unit x qty
  const autoTotal = useMemo(() => {
    if (formData.entryMode !== 'unit') return null;
    const qty = Number(formData.qty);
    const unit = Number(formData.unitPrice);
    return qty > 0 && unit > 0 ? qty * unit : null;
  }, [formData.entryMode, formData.qty, formData.unitPrice]);

  // Cost per bird insight
  const costPerBirdInsight = useMemo(() => {
    const amount = autoTotal ?? Number(formData.amount);
    if (!amount || amount <= 0 || metrics.initialChicks <= 0) return null;
    return (amount / metrics.initialChicks).toFixed(2);
  }, [formData.amount, autoTotal, metrics.initialChicks]);

  // Running total insight
  const newTotalExpenses = useMemo(() => {
    const amount = autoTotal ?? Number(formData.amount);
    if (!amount) return null;
    return metrics.totalExpenses + amount;
  }, [formData.amount, autoTotal, metrics.totalExpenses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = autoTotal ?? Number(formData.amount);

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    addExpense({
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount,
    });

    onClose();
    setFormData({
      date: getTodayString(),
      category: 'Feed',
      description: '',
      amount: '',
      qty: '',
      unitPrice: '',
      entryMode: 'total',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Farm Expense">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="field full-width">
            <label>Description / Vendor *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2 bales wood shavings from Kenchic Agrovet"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Entry Mode</label>
            <select
              value={formData.entryMode}
              onChange={(e) => setFormData({ ...formData, entryMode: e.target.value })}
            >
              <option value="total">Enter total amount directly</option>
              <option value="unit">Qty × Unit price (auto-total)</option>
            </select>
          </div>

          {formData.entryMode === 'total' ? (
            <div className="field">
              <label>Total Amount ({currency}) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="e.g. 4500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          ) : (
            <>
              <div className="field">
                <label>Quantity / Units *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="e.g. 3"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Unit Price ({currency}) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="e.g. 1500"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                />
              </div>
              {autoTotal && (
                <div className="field full-width">
                  <div className="calc-insight">
                    <span>🧮 Auto-calculated total:</span>
                    <span><strong>{currency} {autoTotal.toLocaleString()}</strong></span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Live insights */}
          {(costPerBirdInsight || newTotalExpenses) && (
            <div className="field full-width">
              <div className="auto-calc-preview">
                {costPerBirdInsight && (
                  <span>🐔 <strong>{currency} {costPerBirdInsight}</strong>/bird (this expense)</span>
                )}
                {newTotalExpenses && (
                  <span>📊 Running total → <strong>{currency} {newTotalExpenses.toLocaleString()}</strong></span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Expense</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
