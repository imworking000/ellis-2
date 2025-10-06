import React, { useState } from 'react';
import { GraduationCap, User, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { UserTestLogin as UserTestLoginType, User as UserType, UserTestAssignment } from '../../types/userTest';
import { userTestService } from '../../services/userTestService';

interface UserTestLoginProps {
  onLoginSuccess: (user: UserType, assignments: UserTestAssignment[]) => void;
  onBack?: () => void;
}

export const UserTestLogin: React.FC<UserTestLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [formData, setFormData] = useState<UserTestLoginType>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user, assignments } = await userTestService.login(formData);
      onLoginSuccess(user, assignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#5D5D5D] hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </button>
        )}

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#F8AF00] rounded-full">
              <GraduationCap className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Welcome Back</h1>
          <p className="text-[#5D5D5D]">Sign in to access your tests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
              <User className="w-4 h-4" />
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#F8AF00] text-black py-3 px-4 rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-[#5D5D5D] text-center mb-3">Demo Credentials:</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono">sjohnson / pass123</span>
              <span className="text-green-600">Active Tests: 1</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono">mchen / pass123</span>
              <span className="text-green-600">Active Tests: 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
