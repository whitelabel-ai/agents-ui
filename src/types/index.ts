export interface Organization {
  id: number;
  name: string;
  agents: Agent[];
}

export interface Agent {
  id: number;
  name: string;
  prompt: string;
  model_name: string;
  temperature: number;
  organization_id: number;
  tools: Tool[];
  documents: Document[];
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  json_schema: Record<string, any>;
}

export interface Document {
  id: number;
  name: string;
  url: string;
  created_at: string;
}

export interface ApiError {
  message: string;
  status: number;
}