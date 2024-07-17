import React, { useEffect, useState } from 'react';
import { Task } from './types'; 

const TaskLog: React.FC = () => {
  const [executedTasks, setExecutedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchExecutedTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tasks/executed');
        if (!response.ok) {
          throw new Error('Failed to fetch executed tasks');
        }
        const data: Task[] = await response.json();
        setExecutedTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExecutedTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Executed Tasks</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="w-50" scope="col">Task Name</th>
            <th className="w-25" scope="col">Type</th>
            <th className="w-25" scope="col">Executed At</th>
          </tr>
        </thead>
        <tbody>
          {executedTasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.type}</td>
              <td>{task.executedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskLog;
