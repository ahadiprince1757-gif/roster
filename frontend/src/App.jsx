import React, { useState } from 'react';
import { useFarm } from './context/FarmContext';
import MinimalNav from './components/Layout/MinimalNav';
import BottomNav from './components/Layout/BottomNav';
import LandingPage from './components/Landing/LandingPage';
import LoginPage from './components/Auth/LoginPage';

// The 5 Painkiller Destinations
import HomePainkillerView from './components/Dashboard/HomePainkillerView';
import DiagnoseView from './components/Diagnose/DiagnoseView';
import FlockPainkillerView from './components/Flock/FlockPainkillerView';
import FinancePainkillerView from './components/Finance/FinancePainkillerView';
import ProtocolPainkillerView from './components/Protocol/ProtocolPainkillerView';

// Secondary Views
import BatchView from './components/Batch/BatchView';
import PerformanceStandards from './components/Standards/PerformanceStandards';

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

  // If on Landing Page, display presentation
  if (activeTab === 'landing') {
    return (
      <LandingPage onEnterApp={(tab = 'dashboard') => setActiveTab(tab)} />
    );
  }

  // If on Login Page, display authentication screen
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
      {/* Quiet Luxury Navigation Bar */}
      <MinimalNav
        onOpenQuickLog={() => setActiveModal('quick')}
        onOpenReport={() => setActiveModal('report')}
      />

      {/* Main Focus Canvas */}
      <main className="min-content">
        {/* Destination 1: Home (Flock Status & Urgent Radar) */}
        {activeTab === 'dashboard' && (
          <HomePainkillerView
            onOpenModal={handleOpenModal}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Destination 2: Diagnose (Poultry Doctor / Triage Engine) */}
        {activeTab === 'diagnose' && (
          <DiagnoseView
            onNavigate={(tab) => setActiveTab(tab)}
            onSaveToRecords={() => setActiveTab('records')}
          />
        )}

        {/* Destination 3: Flock (Growth, Benchmark & Gap Solver) */}
        {(activeTab === 'flock' || activeTab === 'weights' || activeTab === 'feed' || activeTab === 'mortality') && (
          <FlockPainkillerView
            onOpenAddModal={handleOpenModal}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Destination 4: Finance (Real-Time Economics & Profit Leaks) */}
        {activeTab === 'finance' && (
          <FinancePainkillerView
            onOpenExpenseModal={() => handleOpenModal('expense')}
            onOpenSaleModal={() => handleOpenModal('sale')}
          />
        )}

        {/* Destination 5: Records / Protocol (Day-by-Day Sequence & Vaccines) */}
        {(activeTab === 'records' || activeTab === 'health') && (
          <ProtocolPainkillerView
            onOpenAddModal={() => handleOpenModal('health')}
          />
        )}

        {/* Auxiliary Views */}
        {activeTab === 'standards' && (
          <PerformanceStandards />
        )}

        {activeTab === 'batch' && (
          <BatchView onOpenReport={() => setActiveModal('report')} />
        )}
      </main>

      {/* iOS Style Mobile Bottom Navigation */}
      <BottomNav
        onOpenReport={() => setActiveModal('report')}
        onOpenQuickLog={() => setActiveModal('quick')}
      />

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
