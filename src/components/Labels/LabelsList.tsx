import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Tag, Type, List, Calendar } from 'lucide-react';
import { Label } from '../../types/label';
import { labelService } from '../../services/labelService';
import { LabelModal } from './LabelModal';

export const LabelsList: React.FC = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState<Label | null>(null);

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      const labelsList = await labelService.getAllLabels();
      setLabels(labelsList);
    } catch (error) {
      console.error('Failed to load labels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabel = () => {
    setEditingLabel(null);
    setShowModal(true);
  };

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label);
    setShowModal(true);
  };

  const handleDeleteClick = (label: Label) => {
    setLabelToDelete(label);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!labelToDelete) return;
    
    setDeletingId(labelToDelete.id);
    try {
      await labelService.deleteLabel(labelToDelete.id);
      setLabels(prev => prev.filter(label => label.id !== labelToDelete.id));
    } catch (error) {
      console.error('Failed to delete label:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setLabelToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setLabelToDelete(null);
  };

  const handleDeleteLabel = async (id: string) => {
    setDeletingId(id);
    try {
      await labelService.deleteLabel(id);
      setLabels(prev => prev.filter(label => label.id !== id));
    } catch (error) {
      console.error('Failed to delete label:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = (label: Label) => {
    if (editingLabel) {
      // Update existing label
      setLabels(prev => prev.map(l => l.id === label.id ? label : l));
    } else {
      // Add new label
      setLabels(prev => [label, ...prev]);
    }
    setShowModal(false);
    setEditingLabel(null);
  };

  const getTypeIcon = (type: string) => {
    return type === 'enum' ? <List className="w-4 h-4" /> : <Type className="w-4 h-4" />;
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    return type === 'enum' 
      ? `${baseClasses} bg-blue-100 text-blue-800`
      : `${baseClasses} bg-green-100 text-green-800`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Label Management</h1>
          <p className="text-[#5D5D5D]">Define and manage metadata labels for your documents</p>
        </div>
        <button
          onClick={handleCreateLabel}
          className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Label
        </button>
      </div>

      {/* Labels Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-black">Label</th>
                <th className="text-left py-3 px-4 font-medium text-black">Key</th>
                <th className="text-left py-3 px-4 font-medium text-black">Type</th>
                <th className="text-left py-3 px-4 font-medium text-black">Options/Description</th>
                <th className="text-left py-3 px-4 font-medium text-black">Updated</th>
                <th className="text-right py-3 px-4 font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {labels.map((label) => (
                <tr key={label.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Tag className="w-4 h-4 text-[#5D5D5D]" />
                      </div>
                      <div>
                        <div className="font-medium text-black">{label.displayName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-[#5D5D5D]">
                      {label.key}
                    </code>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(label.type)}
                      <span className={getTypeBadge(label.type)}>
                        {label.type.charAt(0).toUpperCase() + label.type.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {label.type === 'enum' && label.enumOptions ? (
                      <div className="flex flex-wrap gap-1">
                        {label.enumOptions.slice(0, 3).map((option, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {option}
                          </span>
                        ))}
                        {label.enumOptions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{label.enumOptions.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-[#5D5D5D]">
                        {label.description || 'Free text input'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-[#5D5D5D]">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(label.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditLabel(label)}
                        className="p-2 text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded-lg transition-colors"
                        title="Edit label"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(label)}
                        disabled={deletingId === label.id}
                        className="p-2 text-[#5D5D5D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete label"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {labels.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">No labels defined</h3>
          <p className="text-[#5D5D5D] mb-4">
            Create your first label to start organizing document metadata
          </p>
          <button
            onClick={handleCreateLabel}
            className="bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
          >
            Create First Label
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <LabelModal
          label={editingLabel}
          onClose={() => {
            setShowModal(false);
            setEditingLabel(null);
          }}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && labelToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-black">Delete Label</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-[#5D5D5D] mb-3">
                Are you sure you want to delete the label <strong>"{labelToDelete.displayName}"</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> This action cannot be undone. Any documents using this label will lose this metadata field.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId === labelToDelete.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {deletingId === labelToDelete.id ? 'Deleting...' : 'Delete Label'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};