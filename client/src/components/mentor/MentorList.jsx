import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaUserTie, FaEnvelope, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const { data } = await api.get('/chat/users?role=mentor');
      setMentors(data);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (mentorId) => {
    navigate(`/chat/${mentorId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Connect with Mentors</h2>
        <p className="text-gray-600">Find experienced mentors to guide your business journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No mentors available at the moment.
          </div>
        ) : (
          mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex flex-col items-center text-center mb-4">
                {mentor.profileImage ? (
                  <img
                    src={mentor.profileImage}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <FaUserTie className="text-4xl text-blue-600" />
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{mentor.name}</h3>
                
                {mentor.expertise && mentor.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {mentor.expertise.map((exp, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {exp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {mentor.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mentor.bio}</p>
              )}

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {mentor.location && (
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>{mentor.location}</span>
                  </div>
                )}
                
                {mentor.experience && (
                  <div className="flex items-center space-x-2">
                    <FaBriefcase className="text-blue-600" />
                    <span>{mentor.experience} years experience</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-blue-600" />
                  <span className="truncate">{mentor.email}</span>
                </div>
              </div>

              <button
                onClick={() => handleConnect(mentor._id)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Connect with Mentor
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MentorList;
