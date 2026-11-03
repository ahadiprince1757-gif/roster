import React, { useState, useMemo } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString, currentAge } from '../../utils/calculations';

const AddWeightModal = ({ isOpen, onClose }) => {
  const { addWeight, metrics, farmData } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    sample: '50',
    // Individual bird weights entry mode
    mode: 'avg', // 'avg' = enter average directly, 'individual' = enter individual values
    individualWeights: '', // comma-separated
    avg: '',
    min: '',
    max: '',
    notes: '',
  });

  // Auto-calculate average from individual weights
  const autoCalc = useMemo(() => {
    if (formData.mode !== 'individual' || !formData.individualWeights.trim()) {
      return null;
    }
    const values = formData.individualWeights
      .split(/[,\s\n]+/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v) && v > 0);

    if (values.length === 0) return null;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const cv = (Math.sqrt(values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length) / avg) * 100;

    return {
      count: values.length,
      avg: Math.round(avg),
      min: Math.round(min),
      max: Math.round(max),
      cv: cv.toFixed(1),
    };
  }, [formData.mode, formData.individualWeights]);

  // Auto ADG preview
  const adgPreview = useMemo(() => {
    const avgGrams = formData.mode === 'individual' && autoCalc
      ? autoCalc.avg
      : Number(formData.avg);
    if (!avgGrams || !farmData.batch.date) return null;
    const age = currentAge(farmData.batch.date);
    if (!age || age <= 0) return null;
    const adg = (avgGrams - 42) / age;
    return { age, adg: Math.max(0, adg).toFixed(1) };
  }, [formData.avg, formData.mode, autoCalc, farmData.batch.date]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let avg, min, max, sample;

    if (formData.mode === 'individual' && autoCalc) {
      avg = autoCalc.avg;
      min = autoCalc.min;
      max = autoCalc.max;
      sample = autoCalc.count;
    } else {
      avg = Number(formData.avg);
      min = Number(formData.min) || avg;
      max = Number(formData.max) || avg;
      sample = Number(formData.sample);
    }

    if (!avg || avg <= 0) {
      alert('Please enter a valid average weight.');
      return;
    }
    if (min > max || avg < min || avg > max) {
      alert('Average weight must be between minimum and maximum.');
      return;
    }

    addWeight({ date: formData.date, sample, avg, min, max, notes: formData.notes });
    onClose();
    setFormData({
      date: getTodayString(),
      sample: '50',
      mode: 'avg',
      individualWeights: '',
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
            <label>Entry Mode</label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
            >
              <option value="avg">Enter average directly</option>
              <option value="individual">Enter individual bird weights (auto-average)</option>
            </select>
          </div>

          {formData.mode === 'avg' ? (
            <>
              <div className="field">
                <label>Birds Sampled *</label>
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
                <label>Min Weight (grams)</label>
                <input
                  type="number"
                  min="10"
                  placeholder="e.g. 980 (optional)"
                  value={formData.min}
                  onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Max Weight (grams)</label>
                <input
                  type="number"
                  min="10"
                  placeholder="e.g. 1120 (optional)"
                  value={formData.max}
                  onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                />
              </div>
            </>
          ) : (
            <div className="field full-width">
              <label>Individual Bird Weights (grams) — comma or space separated *</label>
              <textarea
                rows={4}
                placeholder="e.g. 980, 1020, 1050, 1100, 990, 1080, 1030..."
                value={formData.individualWeights}
                onChange={(e) => setFormData({ ...formData, individualWeights: e.target.value })}
                style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
              {autoCalc && (
                <div className="auto-calc-preview">
                  <span><strong>{autoCalc.count}</strong> birds</span>
                  <span>Avg: <strong>{autoCalc.avg}g</strong></span>
                  <span>Min: <strong>{autoCalc.min}g</strong></span>
                  <span>Max: <strong>{autoCalc.max}g</strong></span>
                  <span>CV: <strong>{autoCalc.cv}%</strong></span>
                </div>
              )}
            </div>
          )}

          {/* ADG Live Preview */}
          {adgPreview && (
            <div className="field full-width">
              <div className="calc-insight">
                <span>Auto-calculated at day <strong>{adgPreview.age}</strong>:</span>
                <span>ADG = <strong>{adgPreview.adg}g/day</strong></span>
              </div>
            </div>
          )}

          <div className="field full-width">
            <label>Observations & Notes</label>
            <input
              type="text"
              placeholder="e.g. Birds active, good crop fill, litter dry"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Weight Record</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddWeightModal;
