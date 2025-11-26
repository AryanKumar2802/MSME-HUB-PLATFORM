import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FaSearch, FaEye, FaBookOpen } from 'react-icons/fa';

const GSTGuides = () => {
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, [category, search]);

  const fetchGuides = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      const { data } = await api.get('/guides', { params });
      setGuides(data);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    }
  };

  const categories = ['Registration', 'Filing', 'Compliance', 'Returns', 'General'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">GST Guides & Resources</h2>
        <p className="text-gray-600">Learn about GST compliance and best practices</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Guides Grid */}
      {selectedGuide ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <button
            onClick={() => setSelectedGuide(null)}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to guides
          </button>
          
          <h3 className="text-2xl font-bold mb-4">{selectedGuide.title}</h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {selectedGuide.category}
            </span>
            <span className="flex items-center space-x-1">
              <FaEye />
              <span>{selectedGuide.views} views</span>
            </span>
            {selectedGuide.author && (
              <span>By {selectedGuide.author.name}</span>
            )}
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{selectedGuide.content}</div>
          </div>

          {selectedGuide.tags && selectedGuide.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedGuide.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No guides found. Try adjusting your search or filters.
            </div>
          ) : (
            guides.map((guide) => (
              <div
                key={guide._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedGuide(guide)}
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBookOpen className="text-blue-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {guide.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {guide.content.substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FaEye />
                    <span>{guide.views} views</span>
                  </span>
                  {guide.author && (
                    <span className="text-xs">By {guide.author.name}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GSTGuides;