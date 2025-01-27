import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string | Blob;
  type: 'user' | 'received';
  timestamp: Date;
  isAudio?: boolean;
}

interface ChatProps {
    agentId: number;
  }

  export const ChatModal = ({ agentId, onClose }: { agentId: number; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Chat with Agent {agentId}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
          </div>
          <Chat agentId={agentId} />
        </div>
      </div>
    );
  };
  
export default function Chat({ agentId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Inicializar el grabador de audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (e) => {
            audioChunks.current.push(e.data);
          };
          mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            audioChunks.current = [];
          };
        })
        .catch(console.error);
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      // Enviar mensaje al endpoint
      const response = await fetch(
        `https://python-test-production.up.railway.app/agents/${agentId}/invoke?input=${encodeURIComponent(inputText)}`,{
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: inputText })
      });

      const data = await response.json();
      
      // Mensaje recibido
      const receivedMessage: Message = {
        id: Date.now().toString(),
        content: data.response || 'No response',
        type: 'received',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, receivedMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendAudio = () => {
    if (audioUrl) {
      const audioMessage: Message = {
        id: Date.now().toString(),
        content: audioUrl,
        type: 'user',
        timestamp: new Date(),
        isAudio: true
      };
      setMessages(prev => [...prev, audioMessage]);
      setAudioUrl(null);
      // Aquí iría la lógica para enviar el audio al endpoint
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.isAudio ? (
                <audio controls src={typeof message.content === 'string' ? message.content : URL.createObjectURL(message.content)} />
              ) : (
                <p>
                    {typeof message.content === 'string' 
                    ? message.content 
                    : 'Archivo adjunto'}
                </p>
              )}
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full ${
              isRecording 
                ? 'animate-pulse bg-red-500 hover:bg-red-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            ➤
          </button>
        </div>
        
        {audioUrl && (
          <div className="mt-4 flex items-center justify-between">
            <audio controls src={audioUrl} />
            <button
              onClick={handleSendAudio}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Enviar audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}