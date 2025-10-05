import React from 'react';
import { GraduationCap, Search, User, Menu, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onMenuToggle: () => void;
}

const getPageTitle = (page: string) => {
  switch (page) {
    case 'documents':
      return 'Document Library';
    case 'labels':
      return 'Label Management';
    case 'jobs':
      return 'Jobs & Processing';
    case 'analytics':
      return 'Analytics';
    case 'users':
      return 'User Management';
    case 'settings':
      return 'Settings';
    case 'help':
      return 'Help & Support';
    default:
      return 'E-Learning Platform';
  }
};

export const Header: React.FC<HeaderProps> = ({ currentPage, onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Page Title */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F8AF00] rounded-lg">
                <GraduationCap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">LearnHub</h1>
                <p className="text-xs text-[#5D5D5D]">E-Learning Platform</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-300" />
            
            <div>
              <h2 className="text-lg font-semibold text-black">{getPageTitle(currentPage)}</h2>
            </div>
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* Test Interface Link */}
            <a
              href="/test"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded-lg transition-colors"
              title="Open Test Interface"
            >
              <ExternalLink className="w-4 h-4" />
              Take Test
            </a>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5D5D5D]" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Menu Button */}
            <button 
              onClick={onMenuToggle}
              className="p-2 text-[#5D5D5D] hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-black">John Doe</div>
                <div className="text-xs text-[#5D5D5D]">Administrator</div>
              </div>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <User className="w-5 h-5 text-[#5D5D5D]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};