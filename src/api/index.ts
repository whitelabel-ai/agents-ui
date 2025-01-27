import axios from 'axios';
import { Organization, Agent, Tool } from '../types';

const api = axios.create({
  baseURL: 'https://python-test-production.up.railway.app/',
});

export const getOrganizations = async () => {
  const { data } = await api.get<Organization[]>('/organizations/');
  return data;
};

export const getAgents = async () => {
  const { data } = await api.get<any[]>('/agents/');
  return data;
};

export const getTools = async () => {
  const { data } = await api.get<Tool[]>('/tools/');
  return data;
};

export const createOrganization = async (name: string) => {
  const { data } = await api.post<Organization>('/organizations/', { name });
  return data;
};

export const createAgent = async (agentData: Omit<Agent, 'id' | 'tools' | 'documents'>) => {
  const { data } = await api.post<Agent>('/agents/', agentData);
  return data;
};

export const addToolToAgent = async (agentId: number, toolId: number) => {
  const { data } = await api.post(`/agents/${agentId}/add-tool/${toolId}`);
  return data;
};

export const uploadDocument = async (agentId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/agents/${agentId}/documents/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};