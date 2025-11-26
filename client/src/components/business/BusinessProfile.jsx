import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const BusinessProfile = () => {
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    panNumber: '',
    businessType: 'Manufacturing',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    website: '',
    employees: '',
    annualTurnover: ''
  });

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const { data } = await api.get('/business/my-business');
      if (data) {
        setBusiness(data);
        setFormData(data);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (business) {
        const { data } = await api.put(`/business/${business._id}`, formData);
        setBusiness(data);
      } else {
        const { data } = await api.post('/business', formData);
        setBusiness(data);
      }
      setIsEditing(false);
      toast.success('Business profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save business profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (!business && !isEditing) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Create Business Profile</h2>
        <p className="text-gray-600 mb-4">You haven't created your business profile yet.</p>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Business Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Business Type *</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Manufacturing">Manufacturing</option>
                <option value="Trading">Trading</option>
                <option value="Service">Service</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address?.city || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address?.state || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Number of Employees</label>
              <input
                type="number"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Profile
            </button>
            {business && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(business);
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Business Name</p>
              <p className="font-semibold">{business?.businessName}</p>
            </div>
            <div>
              <p className="text-gray-600">Business Type</p>
              <p className="font-semibold">{business?.businessType}</p>
            </div>
            {business?.gstNumber && (
              <div>
                <p className="text-gray-600">GST Number</p>
                <p className="font-semibold">{business.gstNumber}</p>
              </div>
            )}
            {business?.panNumber && (
              <div>
                <p className="text-gray-600">PAN Number</p>
                <p className="font-semibold">{business.panNumber}</p>
              </div>
            )}
            {business?.address?.city && (
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-semibold">
                  {business.address.city}, {business.address.state}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;