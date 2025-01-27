import React, { useState } from 'react';
import { Agent } from '../types';
import { Settings, FileText, Plus, Upload } from 'lucide-react';
import { ToolsList } from './ToolsList';
import { DocumentsList } from './DocumentsList';
import { AddToolModal } from './AddToolModal';
import { UploadDocumentModal } from './UploadDocumentalModal';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const [showTools, setShowTools] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showAddTool, setShowAddTool] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">  {agent.name}</h3>
      
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTools(!showTools)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDocs(!showDocs)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <h5 className="text-sm text-gray-600">Id: {agent.id}</h5>
        <p className="text-sm text-gray-600">Model: {agent.model_name}</p>
        <p className="text-sm text-gray-600">Temperature: {agent.temperature}</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setShowAddTool(true)}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tools
        </button>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {showTools && <ToolsList tools={agent.tools} />}
      {showDocs && <DocumentsList documents={agent.documents} />}
      
      <AddToolModal
        isOpen={showAddTool}
        onClose={() => setShowAddTool(false)}
        agentId={agent.id}
        currentTools={agent.tools}
      />
      
      <UploadDocumentModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        agentId={agent.id}
      />
    </div>
  );
};