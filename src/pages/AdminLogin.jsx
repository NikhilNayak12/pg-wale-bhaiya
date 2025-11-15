import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { mockLogin, DEMO_CREDENTIALS } from '@/services/mockAuth';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Mock admin login (no Firebase)
      const userData = await mockLogin(credentials.email, credentials.password);
      
      // Check if user is admin type
      if (userData.type !== 'admin') {
        setError("Access denied. This is for admin accounts only.");
        setLoading(false);
        return;
      }
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Mock auth error:', error);
      
      let errorMessage = 'Invalid credentials. Please try again.';
      if (error.message === 'EMAIL_NOT_FOUND') {
        errorMessage = 'Admin account not found.';
      } else if (error.message === 'INVALID_PASSWORD') {
        errorMessage = 'Invalid password.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <LockClosedIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500 bg-green-50 p-3 rounded border border-green-200">
            <p className="font-medium text-green-900 mb-1">🎭 Demo Mode (No Backend)</p>
            <p className="text-green-700">Email: <code className="bg-white px-1 rounded text-green-800">{DEMO_CREDENTIALS.admin.email}</code></p>
            <p className="text-green-700">Password: <code className="bg-white px-1 rounded text-green-800">{DEMO_CREDENTIALS.admin.password}</code></p>
          </div>
          
          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Back to Home Page
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
