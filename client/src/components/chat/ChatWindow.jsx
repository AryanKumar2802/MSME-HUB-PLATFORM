import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { io } from 'socket.io-client';
import { FaPaperPlane, FaArrowLeft, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const chatId = [user?._id, userId].sort().join('-');

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('join-chat', chatId);
    });

    newSocket.on('receive-message', (message) => {
      if (message.sender._id !== user._id) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, chatId]);

  useEffect(() => {
    fetchMessages();
    fetchOtherUser();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/chat/messages/${userId}`);
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const fetchOtherUser = async () => {
    try {
      const { data } = await api.get(`/chat/users`);
      const foundUser = data.find(u => u._id === userId);
      setOtherUser(foundUser);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await api.post('/chat/messages', {
        receiverId: userId,
        content: newMessage
      });

      setMessages(prev => [...prev, data]);
      
      // Emit to socket
      if (socket) {
        socket.emit('send-message', {
          ...data,
          chatId
        });
      }

      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!otherUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white rounded-t-lg shadow-md p-4 flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        
        {otherUser.profileImage ? (
          <img
            src={otherUser.profileImage}
            alt={otherUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FaUser className="text-blue-600 text-xl" />
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-bold">{otherUser.name}</h2>
          <p className="text-sm text-gray-600 capitalize">{otherUser.role}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="bg-gray-50 p-4 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender._id === user._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow'
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-xs font-semibold mb-1">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white rounded-b-lg shadow-md p-4 flex items-center space-x-4"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;