import React, { useState } from 'react';
import { uploadDocument } from '../api';
import toast from 'react-hot-toast';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: number;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  agentId
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select a document to upload');
      return;
    }

    try {
      // Here you can add more logic if needed
      const uploadedFiles = (await Promise.all(
          selectedFiles.map(async (file) => {
              const result = await uploadDocument(agentId, file);
              return { file, response: result };
          })
      )).filter((item) => item.response?.status === 200);

      // If all uploads are successful
      if (uploadedFiles.length > 0) {
        toast.success('Documents uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload documents');
    }

    setSelectedFiles([]);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <h3 className="mb-6 text-lg font-medium text-gray-900">Upload Document</h3>
          
          <form onSubmit={handleUpload}>
            <div className="space-y-4">
              <label 
                htmlFor="file" 
                className="block text-sm font-medium text-gray-700"
              >
                Select Document
              </label>
              
              <input
                type="file"
                id="file"
                multiple
                onChange={handleFileSelect}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2"
                accept=".txt,.pdf,.doc,.docx"
              />
              
              <button
                type="submit"
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-2"
              >
                Upload Selected Files
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};