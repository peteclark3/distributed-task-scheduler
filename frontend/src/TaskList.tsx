import React, { useEffect, useState } from 'react';

const TaskList: React.FC<{ refresh: number }> = ({ refresh }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ name: '', type: '', schedule: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:3000/api/tasks');
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks(); // Fetch immediately
  }, [refresh]);

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEdit = (task: any) => {
    if (task.schedule === 'immediate') {
      alert("Immediate tasks cannot be edited.");
      return;
    }
    setEditingTaskId(task.id);
    setTaskForm({ name: task.name, type: task.type, schedule: task.schedule });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleFormSubmit = async (id: string) => {
    await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskForm),
    });
    setEditingTaskId(null);
    setTaskForm({ name: '', type: '', schedule: '' });
    const response = await fetch('http://localhost:3000/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setTaskForm({ name: '', type: '', schedule: '' });
  };

  return (
    <div className="container mt-5">
      <h2>All Tasks</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="w-25" scope="col">Task Name</th>
            <th className="w-25" scope="col">Type</th>
            <th className="w-25" scope="col">Schedule</th>
            <th className="w-25" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={taskForm.name}
                    onChange={handleFormChange}
                  />
                ) : (
                  task.name
                )}
              </td>
              <td>{task.type}</td>
              <td>
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="schedule"
                    value={taskForm.schedule}
                    onChange={handleFormChange}
                  />
                ) : (
                  task.schedule
                )}
              </td>
              <td>
                {editingTaskId === task.id ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => handleFormSubmit(task.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    {task.type !== 'immediate' && (
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(task)}>Edit</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
