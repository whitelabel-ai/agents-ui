import React from 'react';
import { Tool } from '../types';
import { Wrench } from 'lucide-react';

interface ToolsListProps {
  tools: Tool[];
}

export const ToolsList: React.FC<ToolsListProps> = ({ tools }) => {
  if (tools.length === 0) {
    return (
      <div className="mt-4 rounded-md bg-gray-50 p-4">
        <p className="text-sm text-gray-600">No tools associated with this agent yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-900">Associated Tools</h4>
      <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
        {tools.map((tool) => (
          <div key={tool.id} className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Wrench className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                {tool.json_schema && (
                  <div className="mt-2">
                    <details className="group">
                      <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700">
                        View Schema
                      </summary>
                      <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-gray-50 p-2 text-xs">
                        {JSON.stringify(tool.json_schema, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};