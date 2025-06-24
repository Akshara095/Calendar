import React from 'react';
import Calendar from './components/Calendar';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center py-6">📅 My Custom Event Calendar</h1>
      <Calendar />
    </div>
  );
}

export default App;
