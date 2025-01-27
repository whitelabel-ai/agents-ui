/* tslint:disable */
/* eslint-disable */

// Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAgents } from '../api'; // Cambiar la importación
import { OrganizationCard } from '../components/OrganizationCard';
import { CreateOrganizationModal } from '../components/CreateOrganizationModal';
import { Plus } from 'lucide-react';
import { Agent, Organization } from '../types';

export const Dashboard: React.FC = () => {

  // Cambiar a usar getAgents
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
  });
  const[ showCreateOrg, setShowCreateOrgModal] = React.useState(false);

  // Obtener organizaciones únicas de los agentes
  const organizations = agents?.reduce((acc, agent) => {
    if (agent.organization) {
      const existing = acc.find((org: { id: any; }) => org.id === agent.organization?.id);
      if (!existing) {
        acc.push(agent.organization);
      }
    }
    return acc;
  }, [] as Organization[]);

  // Agrupar agentes por organización
  const agentsByOrganization = agents?.reduce((acc, agent) => {
    if (agent.organization) {
      const orgId = agent.organization.id;
      if (!acc[orgId]) {
        acc[orgId] = [];
      }
      acc[orgId].push(agent);
    }
    return acc;
  }, {} as Record<number, Agent[]>);


  if (isLoading) {
    return <div className="...">Loading agents...</div>;
  }

  if (error) {
    return <div className="...">Error loading agents</div>;
  }

  function setShowCreateOrg(show: boolean): void {
    setShowCreateOrgModal(show);
  }

  return (
    <div>
      {organizations?.length === 0 ? (
        <div className="...">
          <button onClick={() => setShowCreateOrg(true)}>
            <Plus /> Create First Organization
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="...">
            <button onClick={() => setShowCreateOrg(true)}>
              <Plus /> New Organization
            </button>
          </div>
          {organizations?.map((org: Organization) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              agents={agentsByOrganization?.[org.id] || []}
            />
          ))}
        </div>
      )}

      {/* Modales se mantienen igual */}
      <CreateOrganizationModal
        isOpen={showCreateOrg}
        onClose={() => setShowCreateOrg(false)}
      />
    </div>
  );
};