import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddWeightModal = ({ isOpen, onClose }) => {
  const { addWeight, metrics } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    sample: '50',
    avg: '',
    min: '',
    max: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const sample = Number(formData.sample);
    const avg = Number(formData.avg);
    const min = Number(formData.min) || avg;
    const max = Number(formData.max) || avg;

    if (min > max || avg < min || avg > max) {
      alert('Validation error: Average weight must be between minimum and maximum weights.');
      return;
    }

    if (metrics.liveBirds > 0 && sample > metrics.liveBirds) {
      alert('Sample size cannot exceed total number of live birds in the flock.');
      return;
    }

    addWeight({
      date: formData.date,
      sample,
      avg,
      min,
      max,
      notes: formData.notes,
    });

    onClose();
    setFormData({
      date: getTodayString(),
      sample: '50',
      avg: '',
      min: '',
      max: '',
      notes: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Flock Sample Weight">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Measurement Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Birds Sampled (Count) *</label>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 50"
              value={formData.sample}
              onChange={(e) => setFormData({ ...formData, sample: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Average Weight (grams) *</label>
            <input
              type="number"
              min="10"
              step="1"
              required
              placeholder="e.g. 1050"
              value={formData.avg}
              onChange={(e) => setFormData({ ...formData, avg: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Minimum Weight (grams)</label>
            <input
              type="number"
              min="10"
              placeholder="e.g. 980"
              value={formData.min}
              onChange={(e) => setFormData({ ...formData, min: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Maximum Weight (grams)</label>
            <input
              type="number"
              min="10"
              placeholder="e.g. 1120"
              value={formData.max}
              onChange={(e) => setFormData({ ...formData, max: e.target.value })}
            />
          </div>

          <div className="field full-width">
            <label>Observations & Pen Notes</label>
            <input
              type="text"
              placeholder="e.g. Birds active, good crop fill, litter dry"
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
            Save Weight Record
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddWeightModal;
