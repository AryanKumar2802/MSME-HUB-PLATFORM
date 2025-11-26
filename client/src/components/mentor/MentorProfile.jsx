// ==================== client/src/components/mentor/MentorProfile.jsx ====================
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaUserTie, FaEnvelope, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const MentorProfile = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentor();
  }, [mentorId]);

  const fetchMentor = async () => {
    try {
      const { data } = await api.get(`/chat/users`);
      const foundMentor = data.find(u => u._id === mentorId);

      setMentor(foundMentor);
    } catch (error) {
      console.error('Failed to load mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    navigate(`/chat/${mentorId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="text-center text-gray-600 mt-20">
        Mentor not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="text-xl" />
        </button>

        <h2 className="text-3xl font-bold">Mentor Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center mb-6">
          {mentor.profileImage ? (
            <img 
              src={mentor.profileImage}
              alt={mentor.name}
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <FaUserTie className="text-4xl text-blue-600" />
            </div>
          )}

          <h3 className="text-2xl font-bold">{mentor.name}</h3>

          {/* Expertise Tags */}
          {mentor.expertise?.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {mentor.expertise.map((exp, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                >
                  {exp}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="space-y-4 text-gray-700">
          
          {/* Email */}
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-blue-600" />
            <span>{mentor.email}</span>
          </div>

          {/* Phone */}
          {mentor.phone && (
            <div className="flex items-center space-x-3">
              <FaPhone className="text-blue-600" />
              <span>{mentor.phone}</span>
            </div>
          )}

          {/* Bio */}
          {mentor.bio && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">About</h4>
              <p className="text-gray-600">{mentor.bio}</p>
            </div>
          )}
        </div>

        {/* Start Chat Button */}
        <button
          onClick={handleStartChat}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default MentorProfile;
