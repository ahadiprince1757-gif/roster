import React from 'react';
import Modal from '../Common/Modal';
import { Scale, Wheat, Activity, HeartCrack, MinusCircle, ShoppingCart } from 'lucide-react';

const QuickActionModal = ({ isOpen, onClose, onSelectAction }) => {
  const actions = [
    { id: 'weight', title: 'Record Weight', desc: 'Sample flock body weight', icon: Scale, color: 'var(--primary)' },
    { id: 'feed', title: 'Log Feed', desc: 'Feed consumed or purchased', icon: Wheat, color: 'var(--accent-amber)' },
    { id: 'health', title: 'Schedule Health', desc: 'Vaccine or medication task', icon: Activity, color: 'var(--accent-blue)' },
    { id: 'mortality', title: 'Record Mortality', desc: 'Log bird loss / cull', icon: HeartCrack, color: 'var(--accent-red)' },
    { id: 'expense', title: 'Record Expense', desc: 'Litter, heat, vaccines, labor', icon: MinusCircle, color: 'var(--accent-purple)' },
    { id: 'sale', title: 'Record Bird Sale', desc: 'Flock slaughter / live sale', icon: ShoppingCart, color: 'var(--primary)' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Action Center">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => {
                onClose();
                onSelectAction(act.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = act.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--card-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: act.color,
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-main)' }}>
                  {act.title}
                </strong>
                <small style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {act.desc}
                </small>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

export default QuickActionModal;
