import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Save, FileText, Download, Upload, RefreshCw } from 'lucide-react';

const BatchView = ({ onOpenReport }) => {
  const { farmData, updateBatch, currency, resetAllData } = useFarm();
  const [formData, setFormData] = useState({ ...farmData.batch });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...farmData.batch });
  }, [farmData.batch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBatch({
      name: formData.name,
      date: formData.date,
      birds: Number(formData.birds),
      breed: formData.breed,
      supplier: formData.supplier,
      chickCost: Number(formData.chickCost || 0),
      targetAge: Number(formData.targetAge || 42),
      targetWeight: Number(formData.targetWeight || 2600),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(farmData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Rosestar_${farmData.batch.name.replace(/\s+/g, '_')}_Backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.batch && Array.isArray(parsed.weights)) {
          localStorage.setItem('broilerOS_v2', JSON.stringify(parsed));
          window.location.reload();
        } else {
          alert('Invalid backup format.');
        }
      } catch (err) {
        alert('Error parsing backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="min-flock-header">
        <div>
          <h1 className="min-flock-title">Flock Settings</h1>
          <div className="min-flock-sub">Configure batch parameters, breed targets, and data backup</div>
        </div>

        <button className="min-btn-sub" onClick={onOpenReport}>
          <FileText size={14} style={{ marginRight: '4px' }} />
          Print Performance Audit
        </button>
      </div>

      <div className="min-settings-split">
        {/* Settings Form */}
        <div className="min-card">
          <div className="min-card-head">
            <div>
              <h3>Batch Specifications</h3>
              <small>Flock production targets</small>
            </div>
            {savedSuccess && (
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="min-field" style={{ gridColumn: '1 / -1' }}>
                <label>Flock / Batch Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="min-field">
                <label>Chick Arrival Date</label>
                <input
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="min-field">
                <label>Chicks Placed (Count)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.birds || ''}
                  onChange={(e) => setFormData({ ...formData, birds: e.target.value })}
                />
              </div>

              <div className="min-field">
                <label>Commercial Breed</label>
                <select
                  value={formData.breed || 'Cobb 500'}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                >
                  <option value="Cobb 500">Cobb 500</option>
                  <option value="Ross 308">Ross 308</option>
                  <option value="Hubbard Classic">Hubbard Classic</option>
                  <option value="Kenbro Dual">Kenbro</option>
                </select>
              </div>

              <div className="min-field">
                <label>Hatchery Supplier</label>
                <input
                  type="text"
                  value={formData.supplier || ''}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>

              <div className="min-field">
                <label>Chick Cost ({currency})</label>
                <input
                  type="number"
                  min="0"
                  value={formData.chickCost || ''}
                  onChange={(e) => setFormData({ ...formData, chickCost: e.target.value })}
                />
              </div>

              <div className="min-field">
                <label>Target Age (Days)</label>
                <input
                  type="number"
                  min="20"
                  value={formData.targetAge || 42}
                  onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="min-pill-btn">
                Save Specifications
              </button>
            </div>
          </form>
        </div>

        {/* Data Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="min-card">
            <div className="min-card-head">
              <div>
                <h3>Data Portability</h3>
                <small>Backup or restore</small>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="min-btn-sub" style={{ textAlign: 'left', padding: '10px 14px' }} onClick={handleExportJSON}>
                <Download size={14} style={{ marginRight: '6px' }} />
                Export JSON Backup
              </button>

              <label className="min-btn-sub" style={{ textAlign: 'left', padding: '10px 14px', cursor: 'pointer' }}>
                <Upload size={14} style={{ marginRight: '6px' }} />
                Restore Backup File
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportJSON} />
              </label>

              <button
                className="min-btn-sub"
                style={{ textAlign: 'left', padding: '10px 14px', marginTop: '16px', color: 'var(--text-tertiary)' }}
                onClick={resetAllData}
              >
                <RefreshCw size={14} style={{ marginRight: '6px' }} />
                Reset & Start New Flock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchView;
