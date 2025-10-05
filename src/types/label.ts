export interface Label {
  id: string;
  key: string;
  displayName: string;
  type: 'string' | 'enum';
  enumOptions?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabelFormData {
  key: string;
  displayName: string;
  type: 'string' | 'enum';
  enumOptions: string[];
  description: string;
}