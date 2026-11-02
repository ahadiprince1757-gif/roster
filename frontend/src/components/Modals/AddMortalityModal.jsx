import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddMortalityModal = ({ isOpen, onClose }) => {
  const { addDeath, metrics } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    qty: '',
    cause: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(formData.qty);

    if (metrics.liveBirds > 0 && qty > metrics.liveBirds) {
      alert(`Error: Recorded deaths (${qty}) cannot exceed currently alive flock count (${metrics.liveBirds}).`);
      return;
    }

    addDeath({
      date: formData.date,
      qty,
      cause: formData.cause,
    });

    onClose();
    setFormData({
      date: getTodayString(),
      qty: '',
      cause: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Bird Mortality">
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
            <label>Number of Dead / Culled Birds *</label>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 2"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
            />
          </div>

          <div className="field full-width">
            <label>Observed Cause / Post-Mortem Symptoms *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ascites, Sudden Death, dehydration, crushed"
              value={formData.cause}
              onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Record Loss
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMortalityModal;
