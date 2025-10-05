import React, { useState } from 'react';
import { Save, ArrowDown, Building, FileText, Type, Plus, X } from 'lucide-react';
import { Chapter, Department } from '../../types/document';
import { documentService } from '../../services/documentService';

interface MetadataPanelProps {
  chapter: Chapter;
  documentId: string;
  isReadonly: boolean;
}

const DEPARTMENTS: Department[] = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

// Available metadata fields that can be added
const AVAILABLE_METADATA_FIELDS = [
  { key: 'department', label: 'Department', type: 'enum', options: DEPARTMENTS },
  { key: 'priority', label: 'Priority', type: 'enum', options: ['Low', 'Medium', 'High', 'Critical'] },
  { key: 'category', label: 'Category', type: 'string' },
  { key: 'author', label: 'Author', type: 'string' },
  { key: 'reviewDate', label: 'Review Date', type: 'date' },
  { key: 'status', label: 'Status', type: 'enum', options: ['Draft', 'Review', 'Approved', 'Archived'] }
];

export const MetadataPanel: React.FC<MetadataPanelProps> = ({
  chapter,
  documentId,
  isReadonly
}) => {
  const [metadata, setMetadata] = useState(() => ({
    ...chapter.metadata,
    // Add any additional metadata fields that might exist
    ...(chapter.metadata as any).additionalFields || {}
  }));
  const [saving, setSaving] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<Record<string, any>>(() => {
    const { documentName, description, department, ...rest } = chapter.metadata as any;
    return rest.additionalFields || {};
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await documentService.updateDocumentMetadata(documentId, chapter.id, metadata);
      // In a real app, you'd update the chapter data here
    } catch (error) {
      console.error('Failed to save metadata:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCascade = () => {
    // Implement cascade logic here
    console.log('Cascading metadata to child chapters:', metadata);
  };

  const addMetadataField = (fieldKey: string) => {
    const field = AVAILABLE_METADATA_FIELDS.find(f => f.key === fieldKey);
    if (field) {
      const defaultValue = field.type === 'enum' ? field.options![0] : 
                          field.type === 'date' ? new Date().toISOString().split('T')[0] : '';
      setAdditionalFields(prev => ({
        ...prev,
        [fieldKey]: defaultValue
      }));
      setMetadata(prev => ({
        ...prev,
        [fieldKey]: defaultValue
      }));
    }
    setShowAddField(false);
  };

  const removeMetadataField = (fieldKey: string) => {
    const { [fieldKey]: removed, ...restAdditional } = additionalFields;
    const { [fieldKey]: removedFromMetadata, ...restMetadata } = metadata;
    setAdditionalFields(restAdditional);
    setMetadata(restMetadata);
  };

  const updateAdditionalField = (fieldKey: string, value: any) => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    setMetadata(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const availableFieldsToAdd = AVAILABLE_METADATA_FIELDS.filter(
    field => !additionalFields.hasOwnProperty(field.key) && field.key !== 'department'
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-black">Chapter Metadata</h2>
          {!isReadonly && (
            <div className="flex gap-2">
              <button
                onClick={handleCascade}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowDown className="w-3 h-3" />
                Cascade
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 transition-colors font-medium"
              >
                <Save className="w-3 h-3" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-[#5D5D5D] mt-1">{chapter.title}</p>
      </div>

      {/* Metadata Form */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Document Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
            <FileText className="w-4 h-4" />
            Document Name
          </label>
          <input
            type="text"
            value={metadata.documentName}
            onChange={(e) => setMetadata(prev => ({ ...prev, documentName: e.target.value }))}
            disabled={isReadonly}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
          />
        </div>

        {/* Department */}
        {(additionalFields.department !== undefined || metadata.department) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-black">
                <Building className="w-4 h-4" />
                Department
              </label>
              {!isReadonly && (
                <button
                  onClick={() => removeMetadataField('department')}
                  className="text-[#5D5D5D] hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <select
              value={metadata.department || ''}
              onChange={(e) => updateAdditionalField('department', e.target.value as Department)}
              disabled={isReadonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        )}

        {/* Additional Dynamic Fields */}
        {Object.entries(additionalFields).map(([fieldKey, fieldValue]) => {
          const fieldConfig = AVAILABLE_METADATA_FIELDS.find(f => f.key === fieldKey);
          if (!fieldConfig || fieldKey === 'department') return null;

          return (
            <div key={fieldKey}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-black">
                  {fieldConfig.label}
                </label>
                {!isReadonly && (
                  <button
                    onClick={() => removeMetadataField(fieldKey)}
                    className="text-[#5D5D5D] hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              {fieldConfig.type === 'enum' ? (
                <select
                  value={fieldValue}
                  onChange={(e) => updateAdditionalField(fieldKey, e.target.value)}
                  disabled={isReadonly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
                >
                  {fieldConfig.options!.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : fieldConfig.type === 'date' ? (
                <input
                  type="date"
                  value={fieldValue}
                  onChange={(e) => updateAdditionalField(fieldKey, e.target.value)}
                  disabled={isReadonly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
                />
              ) : (
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => updateAdditionalField(fieldKey, e.target.value)}
                  disabled={isReadonly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
                />
              )}
            </div>
          );
        })}

        {/* Add Field Button */}
        {!isReadonly && availableFieldsToAdd.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowAddField(!showAddField)}
              className="flex items-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-[#5D5D5D] hover:border-[#F8AF00] hover:text-[#F8AF00] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add metadata field
            </button>
            
            {showAddField && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {availableFieldsToAdd.map(field => (
                  <button
                    key={field.key}
                    onClick={() => addMetadataField(field.key)}
                    className="w-full px-3 py-2 text-left text-sm text-black hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description - moved to bottom */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
            <Type className="w-4 h-4" />
            Description
          </label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            disabled={isReadonly}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none resize-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
            placeholder="Enter chapter description..."
          />
        </div>

        {/* Chapter Info */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-black mb-3">Chapter Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5D5D5D]">Level:</span>
              <span className="text-black">{chapter.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5D5D5D]">ID:</span>
              <span className="text-black font-mono text-xs">{chapter.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5D5D5D]">Subsections:</span>
              <span className="text-black">{chapter.children.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};