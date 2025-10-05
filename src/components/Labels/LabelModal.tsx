import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Label, LabelFormData } from '../../types/label';
import { labelService } from '../../services/labelService';

interface LabelModalProps {
  label?: Label | null;
  onClose: () => void;
  onSuccess: (label: Label) => void;
}

export const LabelModal: React.FC<LabelModalProps> = ({
  label,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<LabelFormData>({
    key: '',
    displayName: '',
    type: 'string',
    enumOptions: [],
    description: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (label) {
      setFormData({
        key: label.key,
        displayName: label.displayName,
        type: label.type,
        enumOptions: label.enumOptions || [],
        description: label.description || ''
      });
    }
  }, [label]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.key.trim() || !formData.displayName.trim()) {
      setError('Key and display name are required');
      return;
    }

    if (formData.type === 'enum' && formData.enumOptions.length === 0) {
      setError('At least one option is required for enum type');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let savedLabel: Label;
      if (label) {
        savedLabel = await labelService.updateLabel(label.id, formData);
      } else {
        savedLabel = await labelService.createLabel(formData);
      }
      onSuccess(savedLabel);
    } catch (err) {
      setError('Failed to save label. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addEnumOption = () => {
    if (newOption.trim() && !formData.enumOptions.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        enumOptions: [...prev.enumOptions, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const removeEnumOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      enumOptions: prev.enumOptions.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newOption.trim()) {
      e.preventDefault();
      addEnumOption();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            {label ? 'Edit Label' : 'Create New Label'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Key */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none font-mono"
              placeholder="e.g., department, priority"
            />
            <p className="text-xs text-[#5D5D5D] mt-1">
              Used internally as the field identifier (lowercase, no spaces)
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              placeholder="e.g., Department, Priority Level"
            />
            <p className="text-xs text-[#5D5D5D] mt-1">
              Human-readable name shown in the interface
            </p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                type: e.target.value as 'string' | 'enum',
                enumOptions: e.target.value === 'string' ? [] : prev.enumOptions
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
            >
              <option value="string">String (Free text)</option>
              <option value="enum">Enum (Predefined options)</option>
            </select>
          </div>

          {/* Enum Options */}
          {formData.type === 'enum' && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Options <span className="text-red-500">*</span>
              </label>
              
              {/* Add new option */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
                  placeholder="Add new option"
                />
                <button
                  type="button"
                  onClick={addEnumOption}
                  disabled={!newOption.trim()}
                  className="px-3 py-2 bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Options list */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {formData.enumOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-black">{option}</span>
                    <button
                      type="button"
                      onClick={() => removeEnumOption(index)}
                      className="text-[#5D5D5D] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {formData.enumOptions.length === 0 && (
                <p className="text-sm text-[#5D5D5D] text-center py-4 bg-gray-50 rounded-lg">
                  No options added yet
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none resize-none"
              placeholder="Optional description for this label"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? 'Saving...' : (label ? 'Update Label' : 'Create Label')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};