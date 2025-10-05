import { Label, LabelFormData } from '../types/label';

// Dummy data for development
const sampleLabels: Label[] = [
  {
    id: 'label-1',
    key: 'department',
    displayName: 'Department',
    type: 'enum',
    enumOptions: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'],
    description: 'The department responsible for this content',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: 'label-2',
    key: 'priority',
    displayName: 'Priority',
    type: 'enum',
    enumOptions: ['Low', 'Medium', 'High', 'Critical'],
    description: 'Priority level for this content',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-15'
  },
  {
    id: 'label-3',
    key: 'author',
    displayName: 'Author',
    type: 'string',
    description: 'The person who created this content',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'label-4',
    key: 'category',
    displayName: 'Category',
    type: 'string',
    description: 'Content category or topic',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20'
  },
  {
    id: 'label-5',
    key: 'status',
    displayName: 'Status',
    type: 'enum',
    enumOptions: ['Draft', 'Review', 'Approved', 'Archived'],
    description: 'Current status of the content',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22'
  }
];

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const labelService = {
  async getAllLabels(): Promise<Label[]> {
    await delay(300);
    return [...sampleLabels];
  },

  async getLabel(id: string): Promise<Label | null> {
    await delay(200);
    return sampleLabels.find(label => label.id === id) || null;
  },

  async createLabel(labelData: LabelFormData): Promise<Label> {
    await delay(500);
    const newLabel: Label = {
      id: `label-${Date.now()}`,
      ...labelData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    sampleLabels.push(newLabel);
    return newLabel;
  },

  async updateLabel(id: string, labelData: LabelFormData): Promise<Label> {
    await delay(500);
    const labelIndex = sampleLabels.findIndex(label => label.id === id);
    if (labelIndex === -1) {
      throw new Error('Label not found');
    }
    
    const updatedLabel: Label = {
      ...sampleLabels[labelIndex],
      ...labelData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    sampleLabels[labelIndex] = updatedLabel;
    return updatedLabel;
  },

  async deleteLabel(id: string): Promise<void> {
    await delay(300);
    const labelIndex = sampleLabels.findIndex(label => label.id === id);
    if (labelIndex === -1) {
      throw new Error('Label not found');
    }
    sampleLabels.splice(labelIndex, 1);
  }
};