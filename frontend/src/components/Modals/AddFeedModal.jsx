import React, { useState, useMemo } from 'react';
import Modal from '../Common/Modal';
import { useFarm } from '../../context/FarmContext';
import { getTodayString } from '../../utils/calculations';

const AddFeedModal = ({ isOpen, onClose }) => {
  const { addFeed, metrics, currency } = useFarm();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    type: 'consumption',
    category: 'Starter',
    qty: '',
    bags: '',      // number of bags (auto-converts to kg)
    bagSize: '50', // kg per bag
    cost: '',
    pricePerBag: '',
    notes: '',
    entryMode: 'kg', // 'kg' or 'bags'
  });

  // Auto-calculate qty from bags
  const autoQtyKg = useMemo(() => {
    if (formData.entryMode !== 'bags') return null;
    const bags = Number(formData.bags);
    const size = Number(formData.bagSize) || 50;
    return bags > 0 ? bags * size : null;
  }, [formData.entryMode, formData.bags, formData.bagSize]);

  // Auto-calculate total cost from price per bag
  const autoCost = useMemo(() => {
    if (formData.entryMode !== 'bags' || formData.type !== 'purchase') return null;
    const bags = Number(formData.bags);
    const price = Number(formData.pricePerBag);
    return bags > 0 && price > 0 ? bags * price : null;
  }, [formData.entryMode, formData.type, formData.bags, formData.pricePerBag]);

  // Feed per bird per day insight
  const feedPerBirdInsight = useMemo(() => {
    const qty = autoQtyKg ?? Number(formData.qty);
    if (!qty || qty <= 0 || metrics.liveBirds <= 0) return null;
    const gPerBird = (qty * 1000) / metrics.liveBirds;
    return gPerBird.toFixed(0);
  }, [formData.qty, autoQtyKg, metrics.liveBirds]);

  // Cost per kg insight
  const costPerKgInsight = useMemo(() => {
    const qty = autoQtyKg ?? Number(formData.qty);
    const cost = autoCost ?? Number(formData.cost);
    if (!qty || !cost || qty <= 0 || cost <= 0) return null;
    return (cost / qty).toFixed(0);
  }, [formData.qty, formData.cost, autoQtyKg, autoCost]);

  // Feed stock warning
  const stockWarning = useMemo(() => {
    if (formData.type !== 'consumption') return null;
    const qty = autoQtyKg ?? Number(formData.qty);
    if (!qty || metrics.feedStockRemainingKg <= 0) return null;
    if (qty > metrics.feedStockRemainingKg) {
      return `Exceeds recorded stock by ${(qty - metrics.feedStockRemainingKg).toFixed(0)}kg`;
    }
    const remaining = metrics.feedStockRemainingKg - qty;
    return `${remaining.toFixed(0)}kg remaining after this entry`;
  }, [formData.type, formData.qty, autoQtyKg, metrics.feedStockRemainingKg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = autoQtyKg ?? Number(formData.qty);
    const cost = autoCost ?? Number(formData.cost);

    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (formData.type === 'consumption' && metrics.feedStockRemainingKg > 0 && qty > metrics.feedStockRemainingKg) {
      if (!window.confirm(`Consumption (${qty}kg) exceeds recorded stock (${metrics.feedStockRemainingKg}kg). Proceed?`)) return;
    }

    addFeed({
      date: formData.date,
      type: formData.type,
      category: formData.category,
      qty,
      cost: formData.type === 'purchase' ? cost : 0,
      notes: formData.notes || (formData.entryMode === 'bags' ? `${formData.bags} x ${formData.bagSize}kg bags` : ''),
    });

    onClose();
    setFormData({
      date: getTodayString(),
      type: 'consumption',
      category: 'Starter',
      qty: '',
      bags: '',
      bagSize: '50',
      cost: '',
      pricePerBag: '',
      notes: '',
      entryMode: 'kg',
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
            <label>Feed Stage *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Pre-starter">Pre-starter (Day 1–3)</option>
              <option value="Starter">Starter Crumbles (Day 0–14)</option>
              <option value="Grower">Grower Pellets (Day 15–28)</option>
              <option value="Finisher">Finisher Pellets (Day 29+)</option>
              <option value="Other">Custom Mix / Supplement</option>
            </select>
          </div>

          <div className="field">
            <label>Entry Mode</label>
            <select
              value={formData.entryMode}
              onChange={(e) => setFormData({ ...formData, entryMode: e.target.value })}
            >
              <option value="kg">Enter in Kilograms (kg)</option>
              <option value="bags">Enter by Number of Bags (auto-convert)</option>
            </select>
          </div>

          {formData.entryMode === 'kg' ? (
            <div className="field">
              <label>Quantity (kg) *</label>
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
          ) : (
            <>
              <div className="field">
                <label>Number of Bags *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="e.g. 4"
                  value={formData.bags}
                  onChange={(e) => setFormData({ ...formData, bags: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Bag Size (kg)</label>
                <select
                  value={formData.bagSize}
                  onChange={(e) => setFormData({ ...formData, bagSize: e.target.value })}
                >
                  <option value="25">25 kg</option>
                  <option value="50">50 kg</option>
                  <option value="70">70 kg</option>
                </select>
              </div>
              {autoQtyKg && (
                <div className="field full-width">
                  <div className="calc-insight">
                    <span>Auto-calculated total:</span>
                    <span><strong>{autoQtyKg} kg</strong></span>
                  </div>
                </div>
              )}
            </>
          )}

          {formData.type === 'purchase' && (
            formData.entryMode === 'bags' ? (
              <>
                <div className="field">
                  <label>Price Per Bag ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 3800"
                    value={formData.pricePerBag}
                    onChange={(e) => setFormData({ ...formData, pricePerBag: e.target.value })}
                  />
                </div>
                {autoCost && (
                  <div className="field full-width">
                    <div className="calc-insight">
                      <span>Total cost:</span>
                      <span><strong>{currency} {autoCost.toLocaleString()}</strong></span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="field">
                <label>Total Purchase Cost ({currency})</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 7600"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>
            )
          )}

          {/* Live insights */}
          {(feedPerBirdInsight || costPerKgInsight || stockWarning) && (
            <div className="field full-width">
              <div className="auto-calc-preview">
                {feedPerBirdInsight && (
                  <span><strong>{feedPerBirdInsight}g</strong>/bird/day</span>
                )}
                {costPerKgInsight && (
                  <span><strong>{currency} {costPerKgInsight}</strong>/kg</span>
                )}
                {stockWarning && (
                  <span style={{ width: '100%' }}>{stockWarning}</span>
                )}
              </div>
            </div>
          )}

          <div className="field full-width">
            <label>Notes</label>
            <input
              type="text"
              placeholder="e.g. Unga Farm Care, Supplier: ABC Agrovet"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Feed Record</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFeedModal;
