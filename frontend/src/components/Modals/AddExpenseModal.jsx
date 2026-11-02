import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense, currency } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    category: 'Feed',
    description: '',
    amount: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense({
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
    });
    onClose();
    setFormData({
      date: getTodayString(),
      category: 'Feed',
      description: '',
      amount: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Farm Operating Expense">
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
            <label>Cost Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Chicks">Day-old Chicks & Transport</option>
              <option value="Feed">Feed (Starter / Grower / Finisher)</option>
              <option value="Vaccines">Vaccines & Veterinary Drugs</option>
              <option value="Bedding">Bedding & Wood Shavings</option>
              <option value="Brooding">Heating Fuel & Brooding Gas</option>
              <option value="Labor">Farm Labor / Staff Stipend</option>
              <option value="Electricity">Electricity & Water Utilities</option>
              <option value="Disinfection">Disinfectants & Bio-Security</option>
              <option value="Maintenance">Equipment / Pen Maintenance</option>
              <option value="Other">Other Miscellaneous</option>
            </select>
          </div>

          <div className="field full-width">
            <label>Item Description / Vendor *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2 bales wood shavings, gas cylinder refill"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="field full-width">
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
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
