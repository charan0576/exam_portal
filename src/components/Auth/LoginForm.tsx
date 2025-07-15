import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, UserPlus, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login state
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const { login } = useAuth();

  // Register state
  const [formData, setFormData] = useState({ name: '', regno: '', password: '' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await apiService.login(regno, password);
      login(response.token, response.user);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    setRegSuccess('');

    try {
      const { name, regno, password } = formData;
      await apiService.createUsers(name, regno, password);
      setRegSuccess('User created successfully!');
      setFormData({ name: '', regno: '', password: '' });
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        {/* Tab Selector */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              tab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab('register')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              tab === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" /> Sign In
            </h2>

            {loginError && (
              <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="regno" className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                id="regno"
                name="regno"
                type="text"
                required
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm pr-10 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Add User Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-6">
            <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" /> Sign Up
            </h2>

            {regError && (
              <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="flex items-start space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{regSuccess}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="regno" className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                type="text"
                id="regno"
                name="regno"
                value={formData.regno}
                onChange={(e) => setFormData({ ...formData, regno: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {regLoading ? 'Adding...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
