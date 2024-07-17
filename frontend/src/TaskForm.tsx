import React, { useState } from 'react';

const TaskForm: React.FC = () => {
  const [task, setTask] = useState({ name: '', type: 'immediate', schedule: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    setTask({ name: '', type: 'immediate', schedule: '' });
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-3 border rounded">
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            className="form-control"
            id="taskName"
            value={task.name}
            onChange={e => setTask({ ...task, name: e.target.value })}
            placeholder="Task Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="taskType">Task Type</label>
          <select
            className="form-control"
            id="taskType"
            value={task.type}
            onChange={e => setTask({ ...task, type: e.target.value })}
          >
            <option value="immediate">Immediate</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        {task.type === 'scheduled' && (
          <div className="form-group">
            <label htmlFor="taskSchedule">Task Schedule</label>
            <input
              type="text"
              className="form-control"
              id="taskSchedule"
              value={task.schedule}
              onChange={e => setTask({ ...task, schedule: e.target.value })}
              placeholder="Task Schedule"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-3">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
