import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaGavel, FaEnvelope, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const LawyerSection = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const { data } = await api.get('/lawyer');
      setLawyers(data);
    } catch (error) {
      console.error('Failed to fetch lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsult = (lawyerId) => {
    navigate(`/chat/${lawyerId}`);
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
        <h2 className="text-3xl font-bold mb-2">Legal Consultation</h2>
        <p className="text-gray-600">Get expert legal advice for your business</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Why Legal Support Matters</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Ensure compliance with business regulations</li>
          <li>• Protect your business from legal risks</li>
          <li>• Get help with contracts and agreements</li>
          <li>• Understand tax and GST obligations</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No lawyers available at the moment.
          </div>
        ) : (
          lawyers.map((lawyer) => (
            <div key={lawyer._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex flex-col items-center text-center mb-4">
                {lawyer.profileImage ? (
                  <img
                    src={lawyer.profileImage}
                    alt={lawyer.name}
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <FaGavel className="text-4xl text-red-600" />
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{lawyer.name}</h3>
                
                {lawyer.expertise && lawyer.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {lawyer.expertise.map((exp, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {exp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {lawyer.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lawyer.bio}</p>
              )}

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {lawyer.location && (
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    <span>{lawyer.location}</span>
                  </div>
                )}
                
                {lawyer.experience && (
                  <div className="flex items-center space-x-2">
                    <FaBriefcase className="text-red-600" />
                    <span>{lawyer.experience} years experience</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-red-600" />
                  <span className="truncate">{lawyer.email}</span>
                </div>
              </div>

              <button
                onClick={() => handleConsult(lawyer._id)}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Consult Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LawyerSection;