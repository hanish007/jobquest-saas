import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <DashboardLayout>
      <KanbanBoard />
    </DashboardLayout>
  );
}

export default App;
