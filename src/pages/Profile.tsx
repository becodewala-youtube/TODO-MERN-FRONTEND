import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, type RootState } from '../store'; // Correct import for useAppDispatch
import { updateProfile } from '../store/slice/authSlice';
import { AxiosError } from 'axios'; // Import AxiosError to properly type the error

// Define a type for the error response data
interface ErrorResponse {
  message: string;
  // You can add more properties if the API returns additional data
}


const Profile = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { isDark } = useSelector((state: RootState) => state.theme);
  const dispatch = useAppDispatch(); // Use the typed dispatch hook

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage('');

  if (newPassword && newPassword !== confirmPassword) {
    setMessage('New passwords do not match');
    return;
  }

  try {
    await dispatch(updateProfile({ name, currentPassword, newPassword })).unwrap(); // 👈 important
    setMessage('Profile updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    setMessage(axiosError?.response?.data?.message || 'An error occurred');
  }
};


  return (
    <div className="max-w-2xl mx-auto">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

        {message && (
          <div
            className={`p-4 rounded-md mb-6 ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email (cannot be changed)</label>
            <input
              type="email"
              value={user?.email}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
              disabled
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
