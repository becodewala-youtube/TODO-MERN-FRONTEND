import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { createTask, updateTask } from '../store/slice/taskSlice';
import type { RootState, AppDispatch } from '../store';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    _id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    status: 'pending' | 'completed';
  } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDark } = useSelector((state: RootState) => state.theme);

  // State for task fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');

  // Reset form fields when modal opens for creating a new task
  useEffect(() => {
    if (task) {
      // Populate form fields with task data for editing
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      const formatedDate = task.dueDate.split('T')[0] || '';
      setDueDate(formatedDate)
      setStatus(task.status);
    } else {
      // Reset form fields for creating a new task
      setTitle('');
      setDescription('');
      setPriority('low');
      setDueDate('');
      setStatus('pending');
    }
  }, [task, isOpen]); // Re-run whenever task or isOpen changes

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const selectedDueDate = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to ignore time

  if (!task && selectedDueDate < today) {
    alert('Cannot create a task with a past due date.');
    return;
  }

  const taskData = { title, description, priority, dueDate, status };

  if (task) {
    // Update existing task
    await dispatch(updateTask({ id: task._id, task: taskData }));
  } else {
    // Create new task
    await dispatch(createTask(taskData));
  }

  onClose(); // Close modal after submission
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
      <div
        className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className={`w-full p-2 mt-1 border rounded ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
              className={`w-full p-2 mt-1 border rounded ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
