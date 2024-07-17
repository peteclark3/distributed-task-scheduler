import React, { useState } from 'react';
import cronValidate from 'cron-validate'; // Import the cron validator

interface TaskFormProps {
  onTaskSubmit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskSubmit }) => {
  const [task, setTask] = useState({ name: '', type: 'immediate', schedule: '' });
  const [errors, setErrors] = useState({ name: '', schedule: '' });

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', schedule: '' };

    if (!task.name) {
      newErrors.name = 'Task name is required';
      valid = false;
    }

    if (task.type === 'scheduled' && !cronValidate(task.schedule, {preset: 'npm-node-cron'}).isValid()) {
      newErrors.schedule = 'Invalid cron syntax.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    setTask({ name: '', type: 'immediate', schedule: '' });
    setErrors({ name: '', schedule: '' });
    onTaskSubmit(); // Refresh the task list after submitting a new task
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-3 border rounded">
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="taskName"
            value={task.name}
            onChange={e => setTask({ ...task, name: e.target.value })}
            placeholder="Task Name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
            <label htmlFor="taskSchedule">Task Schedule (use <a href="https://github.com/kelektiv/node-cron?tab=readme-ov-file#cron-patterns" target="cron">cron syntax</a>)</label>
            <input
              type="text"
              className={`form-control ${errors.schedule ? 'is-invalid' : ''}`}
              id="taskSchedule"
              value={task.schedule}
              onChange={e => setTask({ ...task, schedule: e.target.value })}
              placeholder="Task Schedule"
            />
            {errors.schedule && <div className="invalid-feedback">{errors.schedule}</div>}
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-3">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
