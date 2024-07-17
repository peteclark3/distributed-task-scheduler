import React from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskLog from './TaskLog';

const App: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="display-4" style={{ fontSize: '2.5rem' }}>Distributed Task Scheduler</h2>
      </div>
      <TaskForm />
      <TaskList />
      <TaskLog />
    </div>
  );
};

export default App;
