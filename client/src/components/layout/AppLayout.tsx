import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';
import { QuickAddModal } from '../dashboard/QuickAddModal';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Sidebar (Desktop) */}
      <Sidebar onOpenAI={() => setIsAIOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Navbar
          onOpenAI={() => setIsAIOpen(true)}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Quick Add Modal */}
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
