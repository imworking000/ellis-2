# E-Learning Platform Style Guide

## Table of Contents
1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Patterns](#component-patterns)
6. [Layout Guidelines](#layout-guidelines)
7. [Interactive States](#interactive-states)
8. [Icons & Imagery](#icons--imagery)
9. [Animation & Transitions](#animation--transitions)
10. [Accessibility](#accessibility)
11. [Code Standards](#code-standards)

---

## Brand Identity

### Logo & Branding
- **App Name**: LearnHub
- **Tagline**: E-Learning Platform
- **Logo Icon**: Graduation Cap (`GraduationCap` from Lucide React)
- **Logo Background**: Primary color (#F8AF00) with rounded corners (8px)

### Brand Personality
- **Professional**: Clean, organized, trustworthy
- **Modern**: Contemporary design with subtle animations
- **Accessible**: Clear hierarchy and high contrast
- **Efficient**: Focused on productivity and learning outcomes

---

## Color System

### Primary Colors
```css
/* Primary Brand Color */
--primary: #F8AF00;           /* Main brand color */
--primary-hover: #E69F00;     /* Hover state */
--primary-light: rgba(248, 175, 0, 0.1);  /* Light background */
--primary-border: rgba(248, 175, 0, 0.3); /* Light border */

/* Text Colors */
--text-primary: #000000;      /* Main text */
--text-secondary: #5D5D5D;    /* Secondary text */
--text-muted: #9CA3AF;        /* Muted text */

/* Background Colors */
--bg-primary: #FFFFFF;        /* Main background */
--bg-secondary: #F9FAFB;      /* Secondary background */
--bg-tertiary: #F3F4F6;       /* Tertiary background */
```

### Status Colors
```css
/* Success */
--success: #10B981;
--success-light: #D1FAE5;
--success-border: #A7F3D0;

/* Warning */
--warning: #F59E0B;
--warning-light: #FEF3C7;
--warning-border: #FDE68A;

/* Error */
--error: #EF4444;
--error-light: #FEE2E2;
--error-border: #FECACA;

/* Info */
--info: #3B82F6;
--info-light: #DBEAFE;
--info-border: #BFDBFE;
```

### Semantic Colors
```css
/* Processing/Loading */
--processing: #3B82F6;        /* Blue for processing states */
--processing-light: #EBF8FF;

/* Draft */
--draft: #F59E0B;             /* Orange for draft states */
--draft-light: #FEF3C7;

/* Published */
--published: #10B981;         /* Green for published states */
--published-light: #D1FAE5;

/* Archived */
--archived: #6B7280;          /* Gray for archived states */
--archived-light: #F3F4F6;
```

### Border & Divider Colors
```css
--border-light: #E5E7EB;      /* Light borders */
--border-medium: #D1D5DB;     /* Medium borders */
--border-dark: #9CA3AF;       /* Dark borders */
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

### Font Sizes & Weights
```css
/* Headings */
--text-3xl: 1.875rem;         /* 30px - Main page titles */
--text-2xl: 1.5rem;           /* 24px - Section titles */
--text-xl: 1.25rem;           /* 20px - Card titles */
--text-lg: 1.125rem;          /* 18px - Subsection titles */

/* Body Text */
--text-base: 1rem;            /* 16px - Body text */
--text-sm: 0.875rem;          /* 14px - Secondary text */
--text-xs: 0.75rem;           /* 12px - Captions, badges */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.2;         /* Headings */
--leading-normal: 1.5;        /* Body text */
--leading-relaxed: 1.625;     /* Long-form content */
```

### Typography Usage
- **Page Titles**: `text-3xl font-bold text-black`
- **Section Titles**: `text-xl font-bold text-black`
- **Card Titles**: `text-lg font-semibold text-black`
- **Body Text**: `text-base text-black`
- **Secondary Text**: `text-sm text-[#5D5D5D]`
- **Captions**: `text-xs text-[#5D5D5D]`
- **Code/Monospace**: `font-mono text-sm`

---

## Spacing System

### Base Unit: 4px (0.25rem)
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Common Spacing Patterns
- **Component Padding**: 16px (space-4) or 24px (space-6)
- **Section Margins**: 32px (space-8) or 48px (space-12)
- **Element Gaps**: 8px (space-2), 12px (space-3), or 16px (space-4)
- **Page Margins**: 24px (space-6) on mobile, 48px (space-12) on desktop

---

## Component Patterns

### Buttons

#### Primary Button
```tsx
<button className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium">
  <Icon className="w-4 h-4" />
  Button Text
</button>
```

#### Secondary Button
```tsx
<button className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
  <Icon className="w-4 h-4" />
  Button Text
</button>
```

#### Danger Button
```tsx
<button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
  <Icon className="w-4 h-4" />
  Delete
</button>
```

### Cards
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
  {/* Card content */}
</div>
```

### Status Badges
```tsx
{/* Success */}
<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
  Published
</span>

{/* Warning */}
<span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
  Draft
</span>

{/* Error */}
<span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
  Failed
</span>

{/* Info */}
<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
  Processing
</span>
```

### Form Elements
```tsx
{/* Input */}
<input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none" />

{/* Select */}
<select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none">
  <option>Option</option>
</select>

{/* Textarea */}
<textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none resize-none" />
```

### Tables
```tsx
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="text-left py-3 px-4 font-medium text-black">Header</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="py-4 px-4">Content</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modals
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
    {/* Modal content */}
  </div>
</div>
```

---

## Layout Guidelines

### Container Widths
```css
/* Page Containers */
--container-sm: 640px;        /* Small screens */
--container-md: 768px;        /* Medium screens */
--container-lg: 1024px;       /* Large screens */
--container-xl: 1280px;       /* Extra large screens */
--container-2xl: 1536px;      /* 2X large screens */

/* Common Usage */
max-width: 1280px;            /* Most pages */
max-width: 1536px;            /* Wide layouts */
```

### Grid Systems
```tsx
{/* 2-column grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* 3-column grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* 4-column grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Responsive Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### Page Structure
```tsx
<div className="bg-white">
  {/* Header */}
  <div className="border-b border-gray-200 px-6 py-4">
    <div className="max-w-7xl mx-auto">
      {/* Header content */}
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-7xl mx-auto p-6">
    {/* Page content */}
  </div>
</div>
```

---

## Interactive States

### Hover States
```css
/* Buttons */
hover:bg-[#E69F00]           /* Primary button hover */
hover:bg-gray-50             /* Secondary button hover */
hover:shadow-lg              /* Card hover */

/* Text Links */
hover:text-[#F8AF00]         /* Link hover */
hover:text-black             /* Secondary text hover */
```

### Focus States
```css
/* Form Elements */
focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent

/* Buttons */
focus:outline-none focus:ring-2 focus:ring-[#F8AF00] focus:ring-offset-2
```

### Active States
```css
/* Selected Items */
bg-[#F8AF00] bg-opacity-10 border-r-2 border-[#F8AF00]

/* Pressed Buttons */
active:bg-[#D69E00]
```

### Disabled States
```css
/* Disabled Elements */
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## Icons & Imagery

### Icon Library
- **Primary**: Lucide React icons
- **Size Standards**: 
  - Small: `w-3 h-3` (12px)
  - Medium: `w-4 h-4` (16px)
  - Large: `w-5 h-5` (20px)
  - Extra Large: `w-6 h-6` (24px)

### Common Icons
```tsx
// Navigation & Actions
<ArrowLeft className="w-5 h-5" />
<Plus className="w-4 h-4" />
<Edit3 className="w-4 h-4" />
<Trash2 className="w-4 h-4" />
<Save className="w-4 h-4" />

// Status Indicators
<CheckCircle className="w-4 h-4 text-green-600" />
<XCircle className="w-4 h-4 text-red-500" />
<AlertTriangle className="w-4 h-4 text-orange-500" />
<Clock className="w-4 h-4 text-blue-500" />

// Content Types
<FileText className="w-4 h-4" />
<Users className="w-4 h-4" />
<Calendar className="w-4 h-4" />
<BarChart3 className="w-4 h-4" />
```

### Icon Usage Guidelines
- Always use consistent sizing within the same context
- Pair icons with text for clarity
- Use semantic colors for status icons
- Maintain 16px minimum touch target for interactive icons

---

## Animation & Transitions

### Standard Transitions
```css
/* Default Transition */
transition-colors            /* Color changes */
transition-all               /* All properties */
transition-transform         /* Transform changes */

/* Duration */
duration-200                 /* Fast (200ms) */
duration-300                 /* Standard (300ms) */
duration-500                 /* Slow (500ms) */
```

### Loading States
```tsx
{/* Spinner */}
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>

{/* Pulse */}
<div className="animate-pulse bg-gray-200 rounded"></div>
```

### Hover Animations
```css
/* Scale on hover */
hover:scale-105 transition-transform

/* Shadow on hover */
hover:shadow-lg transition-shadow

/* Color transitions */
hover:bg-[#E69F00] transition-colors
```

---

## Accessibility

### Color Contrast
- **Text on White**: Minimum 4.5:1 ratio
- **Primary Color**: Ensure sufficient contrast with white text
- **Status Colors**: Meet WCAG AA standards

### Focus Management
- Always provide visible focus indicators
- Use `focus:ring-2 focus:ring-[#F8AF00]` for form elements
- Ensure logical tab order

### Screen Reader Support
```tsx
{/* Descriptive labels */}
<button aria-label="Delete document">
  <Trash2 className="w-4 h-4" />
</button>

{/* Status announcements */}
<div role="status" aria-live="polite">
  Document uploaded successfully
</div>
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Provide keyboard shortcuts for common actions
- Support arrow key navigation in lists and tables

---

## Code Standards

### Component Structure
```tsx
interface ComponentProps {
  // Props interface
}

export const Component: React.FC<ComponentProps> = ({
  // Destructured props
}) => {
  // State and hooks
  
  // Event handlers
  
  // Effects
  
  // Render helpers
  
  return (
    // JSX
  );
};
```

### CSS Class Naming
```tsx
{/* Use semantic class combinations */}
<div className="bg-white border border-gray-200 rounded-lg p-6">

{/* Group related classes */}
<button className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium">

{/* Use conditional classes */}
<div className={`p-4 rounded-lg ${isActive ? 'bg-[#F8AF00] bg-opacity-10' : 'bg-gray-50'}`}>
```

### File Organization
```
src/
├── components/
│   ├── Common/          # Reusable components
│   ├── Layout/          # Layout components
│   └── Feature/         # Feature-specific components
├── types/               # TypeScript types
├── services/            # API services
├── hooks/               # Custom hooks
└── utils/               # Utility functions
```

### Import Organization
```tsx
// React imports
import React, { useState, useEffect } from 'react';

// Third-party imports
import { SomeLibrary } from 'some-library';

// Internal imports
import { Component } from '../components/Component';
import { useCustomHook } from '../hooks/useCustomHook';
import { ApiService } from '../services/ApiService';
import { ComponentProps } from '../types/component';
```

---

## Usage Examples

### Page Header Pattern
```tsx
<div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-3xl font-bold text-black mb-2">Page Title</h1>
    <p className="text-[#5D5D5D]">Page description</p>
  </div>
  <button className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium">
    <Plus className="w-4 h-4" />
    Create New
  </button>
</div>
```

### Status Display Pattern
```tsx
<div className="flex items-center gap-2">
  {getStatusIcon(status)}
  <span className={getStatusBadge(status)}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
</div>
```

### Loading State Pattern
```tsx
{loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
  </div>
) : (
  // Content
)}
```

### Empty State Pattern
```tsx
<div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
  <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
  <h3 className="text-lg font-medium text-black mb-2">No items found</h3>
  <p className="text-[#5D5D5D] mb-4">Description of empty state</p>
  <button className="bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium">
    Create First Item
  </button>
</div>
```

---

This style guide should be used as the foundation for all microfrontends in the E-Learning Platform ecosystem to ensure visual and functional consistency across the entire application suite.