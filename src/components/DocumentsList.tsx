import React from 'react';
import { Document } from '../types';
import { FileText, ExternalLink } from 'lucide-react';

interface DocumentsListProps {
  documents: Document[];
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="mt-4 rounded-md bg-gray-50 p-4">
        <p className="text-sm text-gray-600">No documents uploaded to this agent yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-900">Uploaded Documents</h4>
      <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};