import React, { useState } from 'react';
import { useFarm } from './context/FarmContext';
import MinimalNav from './components/Layout/MinimalNav';
import BottomNav from './components/Layout/BottomNav';
import LandingPage from './components/Landing/LandingPage';
import DashboardView from './components/Dashboard/DashboardView';
import WeightsView from './components/Weights/WeightsView';
import FeedView from './components/Feed/FeedView';
import HealthView from './components/Health/HealthView';
import MortalityView from './components/Mortality/MortalityView';
import FinanceView from './components/Finance/FinanceView';
import BatchView from './components/Batch/BatchView';
import PerformanceStandards from './components/Standards/PerformanceStandards';
import LoginPage from './components/Auth/LoginPage';

// Modals
import AddWeightModal from './components/Modals/AddWeightModal';
import AddFeedModal from './components/Modals/AddFeedModal';
import AddHealthModal from './components/Modals/AddHealthModal';
import AddMortalityModal from './components/Modals/AddMortalityModal';
import AddExpenseModal from './components/Modals/AddExpenseModal';
import AddSaleModal from './components/Modals/AddSaleModal';
import QuickActionModal from './components/Modals/QuickActionModal';
import BatchReportModal from './components/Modals/BatchReportModal';

function App() {
  const { activeTab, setActiveTab } = useFarm();
  const [activeModal, setActiveModal] = useState(null);

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // If on Landing Page, display full Steve Jobs keynote style presentation
  if (activeTab === 'landing') {
    return (
      <LandingPage onEnterApp={(tab = 'dashboard') => setActiveTab(tab)} />
    );
  }

  // If on Login Page, display dedicated minimalist authentication screen
  if (activeTab === 'login') {
    return (
      <LoginPage
        onNavigate={(tab) => setActiveTab(tab)}
        onBack={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <div className="min-app">
      {/* Clean Apple-style Navigation Bar */}
      <MinimalNav
        onOpenQuickLog={() => setActiveModal('quick')}
        onOpenReport={() => setActiveModal('report')}
      />

      {/* Main Focus Canvas */}
      <main className="min-content">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenModal={handleOpenModal}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'weights' && (
          <WeightsView onOpenAddModal={() => handleOpenModal('weight')} />
        )}

        {activeTab === 'feed' && (
          <FeedView onOpenAddModal={() => handleOpenModal('feed')} />
        )}

        {activeTab === 'health' && (
          <HealthView onOpenAddModal={() => handleOpenModal('health')} />
        )}

        {activeTab === 'mortality' && (
          <MortalityView onOpenAddModal={() => handleOpenModal('mortality')} />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            onOpenExpenseModal={() => handleOpenModal('expense')}
            onOpenSaleModal={() => handleOpenModal('sale')}
          />
        )}

        {activeTab === 'standards' && (
          <PerformanceStandards />
        )}

        {activeTab === 'batch' && (
          <BatchView onOpenReport={() => setActiveModal('report')} />
        )}
      </main>

      {/* iOS Style Mobile Bottom Navigation */}
      <BottomNav onOpenReport={() => setActiveModal('report')} />

      {/* Modals */}
      <AddWeightModal
        isOpen={activeModal === 'weight'}
        onClose={handleCloseModal}
      />

      <AddFeedModal
        isOpen={activeModal === 'feed'}
        onClose={handleCloseModal}
      />

      <AddHealthModal
        isOpen={activeModal === 'health'}
        onClose={handleCloseModal}
      />

      <AddMortalityModal
        isOpen={activeModal === 'mortality'}
        onClose={handleCloseModal}
      />

      <AddExpenseModal
        isOpen={activeModal === 'expense'}
        onClose={handleCloseModal}
      />

      <AddSaleModal
        isOpen={activeModal === 'sale'}
        onClose={handleCloseModal}
      />

      <QuickActionModal
        isOpen={activeModal === 'quick'}
        onClose={handleCloseModal}
        onSelectAction={(action) => setActiveModal(action)}
      />

      <BatchReportModal
        isOpen={activeModal === 'report'}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
