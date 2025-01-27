// OrganizationCard.tsx
import React, { useState } from 'react';
import { Agent, Organization } from '../types';
import { AgentCard } from './AgentCard';
import { Plus, Building2 } from 'lucide-react';
import { CreateAgentModal } from './CreateAgentModal'; // Importar el modal

interface OrganizationCardProps {
  organization: Organization;
  // onAddAgent: (organizationId: number) => void;
  agents: Agent[]; // Asegurarse de recibir los agentes como prop
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  // onAddAgent,
  agents,
}) => {
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">{organization.name}</h2>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
        
        {/* Nuevo botón al final de la lista */}
        <div 
          className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => setShowCreateAgentModal(true)}
        >
          <div className="text-center">
            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-600">Add Agent</span>
          </div>
        </div>
      </div>

      {/* Modal de creación */}
      <CreateAgentModal
        isOpen={showCreateAgentModal}
        onClose={() => setShowCreateAgentModal(false)}
        organizationId={organization.id}
      />
    </div>
  );
};