import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddSaleModal = ({ isOpen, onClose }) => {
  const { addSale, metrics, currency } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    qty: '',
    price: '',
    weight: '2.2',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(formData.qty);
    const price = Number(formData.price);
    const weight = Number(formData.weight) || 0;

    if (metrics.liveBirds > 0 && qty > metrics.liveBirds) {
      alert(`Error: Cannot sell ${qty} birds. Only ${metrics.liveBirds} live birds available in the flock.`);
      return;
    }

    addSale({
      date: formData.date,
      qty,
      price,
      weight,
    });

    onClose();
    setFormData({
      date: getTodayString(),
      qty: '',
      price: '',
      weight: '2.2',
    });
  };

  const calculatedTotal = (Number(formData.qty) || 0) * (Number(formData.price) || 0);

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
            <label>Number of Birds Sold *</label>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 100"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Sale Price Per Bird ({currency}) *</label>
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
            <label>Average Live Weight at Sale (kg)</label>
            <input
              type="number"
              min="0.1"
              step="0.01"
              placeholder="e.g. 2.35"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          {calculatedTotal > 0 && (
            <div
              className="field full-width"
              style={{
                background: 'var(--primary-light)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary)',
                fontWeight: 800,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Total Revenue Expected:</span>
              <span style={{ fontSize: '1.1rem' }}>
                {currency} {calculatedTotal.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Record Sale
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSaleModal;
