import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTools, addToolToAgent } from '../api';
import { Tool } from '../types';
import { X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: number;
  currentTools: Tool[];
}

export const AddToolModal: React.FC<AddToolModalProps> = ({
  isOpen,
  onClose,
  agentId,
  currentTools,
}) => {
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: getTools,
  });

  const addToolMutation = useMutation({
    mutationFn: (toolId: number) => addToolToAgent(agentId, toolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: (error) => {
      toast.error('Failed to add tool to agent');
      console.error('Error adding tool:', error);
    },
  });

  const handleSubmit = async () => {
    try {
      await Promise.all(selectedTools.map(toolId => addToolMutation.mutateAsync(toolId)));
      toast.success('Tools added successfully');
      setSelectedTools([]);
      onClose();
    } catch (error) {
      console.error('Error adding tools:', error);
    }
  };

  const toggleTool = (toolId: number) => {
    setSelectedTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const availableTools = tools?.filter(
    tool => !currentTools.some(currentTool => currentTool.id === tool.id)
  ) || [];

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
            Add Tools to Agent
          </h3>

          {isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading available tools...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">Error loading tools</p>
            </div>
          )}

          {availableTools.length === 0 && !isLoading && !error && (
            <div className="text-center py-4">
              <p className="text-gray-600">No additional tools available</p>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {availableTools.map((tool) => (
              <div
                key={tool.id}
                className="mb-4 flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  id={`tool-${tool.id}`}
                  checked={selectedTools.includes(tool.id)}
                  onChange={() => toggleTool(tool.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`tool-${tool.id}`}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {tool.name}
                  </label>
                  <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                  {tool.json_schema && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        View Schema
                      </summary>
                      <pre className="mt-2 p-2 text-xs bg-gray-50 rounded-md overflow-auto">
                        {JSON.stringify(tool.json_schema, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedTools.length === 0 || addToolMutation.isPending}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {addToolMutation.isPending ? (
                'Adding...'
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Add Selected Tools
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};