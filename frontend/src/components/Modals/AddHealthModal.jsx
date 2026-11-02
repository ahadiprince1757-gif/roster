import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddHealthModal = ({ isOpen, onClose }) => {
  const { addHealth } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    date: getTodayString(),
    type: 'Vaccination',
    method: 'Drinking water',
    status: 'Pending',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addHealth(formData);
    onClose();
    setFormData({
      name: '',
      date: getTodayString(),
      type: 'Vaccination',
      method: 'Drinking water',
      status: 'Pending',
      notes: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Health / Vaccination Task">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field full-width">
            <label>Vaccine / Health Activity Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gumboro IBD (Intermediate Plus)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Scheduled Administration Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Activity Category *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Vaccination">Vaccination</option>
              <option value="Medication">Antibiotic / Dewormer</option>
              <option value="Vitamins">Vitamins / Electrolytes</option>
              <option value="Health check">Veterinary Audit / Post-Mortem</option>
              <option value="Other">Bio-security / Sanitization</option>
            </select>
          </div>

          <div className="field">
            <label>Method of Administration</label>
            <input
              type="text"
              placeholder="e.g. Drinking water with skimmed milk"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Current Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Pending">Pending (Scheduled)</option>
              <option value="Completed">Completed (Administered)</option>
            </select>
          </div>

          <div className="field full-width">
            <label>Batch No, Dosage & Veterinary Notes</label>
            <input
              type="text"
              placeholder="e.g. 1000 doses, Batch #VT-990, withdraw chlorine 24h prior"
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
            Schedule Activity
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddHealthModal;
