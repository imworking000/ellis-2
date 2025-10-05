import React, { useState } from 'react';
import { GraduationCap, User, Hash, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { UserTestLogin as UserTestLoginType, UserTestSession } from '../../types/userTest';
import { PlannedTest } from '../../types/plannedTest';
import { userTestService } from '../../services/userTestService';

interface UserTestLoginProps {
  onLoginSuccess: (session: UserTestSession, plannedTest: PlannedTest) => void;
  onBack?: () => void;
}

export const UserTestLogin: React.FC<UserTestLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [formData, setFormData] = useState<UserTestLoginType>({
    testCode: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.testCode.trim() || !formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { session, plannedTest } = await userTestService.loginToTest(formData);
      onLoginSuccess(session, plannedTest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#5D5D5D] hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#F8AF00] rounded-full">
              <GraduationCap className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Join Test Session</h1>
          <p className="text-[#5D5D5D]">Enter your details to access the test</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Code */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
              <Hash className="w-4 h-4" />
              Test Code
            </label>
            <input
              type="text"
              value={formData.testCode}
              onChange={(e) => setFormData(prev => ({ ...prev, testCode: e.target.value.toUpperCase() }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none font-mono text-center text-lg tracking-wider"
              placeholder="REACT-2024-001"
              maxLength={20}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                <User className="w-4 h-4" />
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#F8AF00] text-black py-3 px-4 rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Joining Test...
              </>
            ) : (
              'Join Test'
            )}
          </button>
        </form>

        {/* Test Codes for Demo */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-[#5D5D5D] text-center mb-3">Demo Test Codes:</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono">TS-ADV-2024-002</span>
              <span className="text-green-600">✓ Available</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono">REACT-2024-001</span>
              <span className="text-red-600">✗ Full</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono">INVALID-CODE</span>
              <span className="text-gray-500">Not Found</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};