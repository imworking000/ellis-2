import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  FileText, 
  Tag,
  BarChart3, 
  ChevronRight,
  Calendar
} from 'lucide-react';

interface RightMenuProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    description: 'Manage your learning content'
  },
  {
    id: 'labels',
    label: 'Labels',
    icon: Tag,
    description: 'Define metadata labels'
  },
  //{
  //  id: 'jobs',
  //  label: 'Jobs',
  //  icon: BarChart3,
  //  description: 'Track asynchronous operations'
  //},
  {
    id: 'tests',
    label: 'Tests',
    icon: FileText,
    description: 'Create and manage assessments'
  },
  {
    id: 'planned-tests',
    label: 'Planned Tests',
    icon: Calendar,
    description: 'Schedule and track test sessions'
  },
];

export const RightMenu: React.FC<RightMenuProps> = ({ currentPage, onPageChange, isExpanded, onToggle }) => {

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-200"
          onClick={onToggle}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isExpanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-black">Navigation</h2>
            <p className="text-sm text-[#5D5D5D] mt-1">E-Learning Platform</p>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#5D5D5D]" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onToggle();
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#F8AF00] bg-opacity-10 border-2 border-[#F8AF00] border-opacity-30'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#F8AF00] bg-opacity-20' 
                    : 'bg-gray-100 group-hover:bg-[#F8AF00] group-hover:bg-opacity-20'
                }`}>
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive 
                      ? 'text-[#F8AF00]' 
                      : 'text-[#5D5D5D] group-hover:text-[#F8AF00]'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium transition-colors ${
                    isActive ? 'text-black' : 'text-black group-hover:text-black'
                  }`}>
                    {item.label}
                  </div>
                  <div className="text-sm text-[#5D5D5D] mt-0.5">
                    {item.description}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                  isActive 
                    ? 'text-[#F8AF00] opacity-100' 
                    : 'text-[#5D5D5D] opacity-0 group-hover:opacity-100 group-hover:text-[#F8AF00]'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-[#5D5D5D]">E-Learning Platform MVP</p>
            <p className="text-xs text-[#5D5D5D] mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};