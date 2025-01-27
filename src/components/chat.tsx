import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export const ChatModal = ({ agentId, onClose, agentName }: { agentId: number; onClose: () => void, agentName: string }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Chat with Agent {agentName}</h3>
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  const [volume, setVolume] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setIsRecording(true);
      
      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunks.current = [];
      };

      const analyzeAudio = () => {
        if (!analyserRef.current) return;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setVolume(averageVolume);

        // Detener grabación si el volumen es menor a 20 por 15 cuadros consecutivos
        if (averageVolume < 10) {
        } else {
          animationRef.current = requestAnimationFrame(analyzeAudio);
        }
      };

      animationRef.current = requestAnimationFrame(analyzeAudio);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
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
    }
  };

  const Waveform = () => {
    const heights = [Math.min(volume * 0.5, 30), Math.min(volume * 0.3, 25), Math.min(volume * 0.4, 28), Math.min(volume * 0.3, 25), Math.min(volume * 0.5, 30)];
    
    return (
      <motion.div 
        className="flex items-center h-8 gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {heights.map((height, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white rounded-full"
            animate={{ height }}
            transition={{ duration: 0.2 }}
            style={{ height: `${height}px` }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.isAudio ? (
                <audio controls src={typeof message.content === 'string' ? message.content : URL.createObjectURL(message.content)} />
              ) : (
                 <p>{typeof message.content === 'string' && message.content}</p>
              )}
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 border-t p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full ${
              isRecording ? 'bg-blue-100' : 'bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode='wait'>
              {isRecording ? (
                <Waveform />
              ) : (
                <motion.span
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🎤
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ➤
          </motion.button>
        </div>
        
        {audioUrl && (
          <motion.div 
            className="mt-4 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <audio controls src={audioUrl} />
            <button
              onClick={handleSendAudio}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Enviar audio
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}