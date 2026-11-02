import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddFeedModal = ({ isOpen, onClose }) => {
  const { addFeed, metrics, currency } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    type: 'consumption', // 'consumption' or 'purchase'
    category: 'Starter',
    qty: '',
    cost: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(formData.qty);

    if (formData.type === 'consumption' && metrics.feedStockRemainingKg > 0 && qty > metrics.feedStockRemainingKg) {
      if (!window.confirm(`Warning: Recorded consumption (${qty}kg) exceeds current recorded inventory (${metrics.feedStockRemainingKg}kg). Proceed anyway?`)) {
        return;
      }
    }

    addFeed({
      date: formData.date,
      type: formData.type,
      category: formData.category,
      qty,
      cost: formData.type === 'purchase' ? Number(formData.cost || 0) : 0,
      notes: formData.notes,
    });

    onClose();
    setFormData({
      date: getTodayString(),
      type: 'consumption',
      category: 'Starter',
      qty: '',
      cost: '',
      notes: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Feed Transaction">
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
            <label>Transaction Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="consumption">Daily Feed Fed / Consumed</option>
              <option value="purchase">Feed Bag Purchase / Inflow</option>
            </select>
          </div>

          <div className="field">
            <label>Feed Stage / Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Starter">Starter Crumbles (0 - 14 Days)</option>
              <option value="Grower">Grower Pellets (15 - 28 Days)</option>
              <option value="Finisher">Finisher Pellets (29+ Days)</option>
              <option value="Pre-starter">Pre-starter</option>
              <option value="Other">Custom Mix / Supplement</option>
            </select>
          </div>

          <div className="field">
            <label>Quantity in Kilograms (kg) *</label>
            <input
              type="number"
              min="0.1"
              step="0.01"
              required
              placeholder="e.g. 50"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
            />
          </div>

          {formData.type === 'purchase' && (
            <div className="field full-width">
              <label>Total Purchase Cost ({currency}) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="e.g. 3800"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
          )}

          <div className="field full-width">
            <label>Supplier / Brand / Bag Count Notes</label>
            <input
              type="text"
              placeholder="e.g. 1 x 50kg bag, Unga Farm Care Starter"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Feed Record
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFeedModal;
