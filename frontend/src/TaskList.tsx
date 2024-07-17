import React, { useEffect, useState } from 'react';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:3000/api/tasks');
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

   return (
    <div className="container mt-5">
      <h2>All Tasks</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="w-50" scope="col">Task Name</th>
            <th className="w-25" scope="col">Type</th>
            <th className="w-25" scope="col">Schedule</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.type}</td>
              <td>{task.schedule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
