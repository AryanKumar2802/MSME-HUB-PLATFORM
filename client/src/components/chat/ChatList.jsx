import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { FaUser, FaComments } from 'react-icons/fa';

const ChatList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/chat/list');
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (chat) => {
    const msg = chat.lastMessage;
    return msg.sender._id === user._id ? msg.receiver : msg.sender;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <FaComments className="text-blue-600" />
          <span>Your Conversations</span>
        </h2>
      </div>

      <div className="divide-y">
        {chats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No conversations yet. Connect with mentors or lawyers to start chatting!
          </div>
        ) : (
          chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const lastMsg = chat.lastMessage;

            return (
              <div
                key={chat._id}
                onClick={() => navigate(`/chat/${otherUser._id}`)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-center space-x-4">
                  {otherUser.profileImage ? (
                    <img
                      src={otherUser.profileImage}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{otherUser.name}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(lastMsg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {lastMsg.sender._id === user._id ? 'You: ' : ''}
                      {lastMsg.content}
                    </p>
                  </div>

                  {chat.unreadCount > 0 && (
                    <div className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;