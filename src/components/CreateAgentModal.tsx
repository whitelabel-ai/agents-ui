import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAgent } from '../api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number | null;
}

const MODEL_OPTIONS = [
  'gpt-4o-mini',
  'gpt-3.5-turbo',
];

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  organizationId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    model_name: MODEL_OPTIONS[0],
    temperature: 0.7,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: typeof formData & { organization_id: number }) => createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Agent created successfully');
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast.error('Failed to create agent');
      console.error('Error creating agent:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      prompt: '',
      model_name: MODEL_OPTIONS[0],
      temperature: 0.7,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) {
      toast.error('Please select an organization');
      return;
    }
    
    createMutation.mutate({
      ...formData,
      organization_id: organizationId,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'temperature' ? parseFloat(value) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="mb-6 text-lg font-medium text-gray-900">
            Create New Agent
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Agent Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter agent name"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                System Prompt
              </label>
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter system prompt"
                required
              />
            </div>

            <div>
              <label htmlFor="model_name" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <select
                id="model_name"
                name="model_name"
                value={formData.model_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                {MODEL_OPTIONS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                Temperature: {formData.temperature}
              </label>
              <input
                type="range"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                min="0"
                max="2"
                step="0.1"
                className="mt-1 block w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Precise (0)</span>
                <span>Balanced (1)</span>
                <span>Creative (2)</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || !formData.name.trim() || !formData.prompt.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};