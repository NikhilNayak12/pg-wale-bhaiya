import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { getPGs } from '../data/pgs';
import { mockGetAll, mockUpdate } from '../services/mockDB';
import { mockUploadMultipleFiles } from '../services/mockStorage';
import { mockUpdate as updateMock } from '../services/mockDB';

const AdminPGListings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPG, setEditingPG] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]); // { url, name }
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Real submissions from database  
  const [realListings, setRealListings] = useState([]);
  
  // Combined listings (only real data)
  const [pgListings, setPgListings] = useState([]);

  // Fetch real listings from API
  useEffect(() => {
    fetchRealListings();
  }, []);

  const fetchRealListings = async () => {
    try {
      setLoading(true);
      
      // Get PGs from static data + landlord-added PGs from localStorage
      const staticPGs = await getPGs({});
      const landlordPGs = mockGetAll('landlordPGs') || [];
      
      // Combine both sources
      const allPGs = [...staticPGs, ...landlordPGs];
      
      const apiListings = allPGs.map(pg => {
        // Safe date handling - avoid invalid dates
        let submittedDate;
        try {
          if (pg.submittedAt) {
            const date = new Date(pg.submittedAt);
            submittedDate = isNaN(date.getTime()) 
              ? new Date().toISOString().split('T')[0]
              : date.toISOString().split('T')[0];
          } else if (pg.createdAt) {
            const date = new Date(pg.createdAt);
            submittedDate = isNaN(date.getTime()) 
              ? new Date().toISOString().split('T')[0]
              : date.toISOString().split('T')[0];
          } else {
            submittedDate = new Date().toISOString().split('T')[0];
          }
        } catch (error) {
          console.warn('Invalid date for PG:', pg.id, error);
          submittedDate = new Date().toISOString().split('T')[0];
        }

        return {
          id: pg.id || pg._id,
          name: pg.name || pg.title,
          landlord: pg.contact?.name || pg.contactPerson || 'Unknown',
          location: typeof pg.location === 'object' 
            ? `${pg.location.locality || ''}, ${pg.location.area || ''}`.trim() 
            : pg.location || `${pg.area || ''}, ${pg.locality || ''}`.trim(),
          price: pg.price || pg.monthlyRent || 0,
          status: pg.status || 'pending',
          submittedDate,
          type: pg.submissionType === 'form' ? 'Form Submission' : 'Manual Entry',
          contact: pg.contact || {
            name: pg.contactPerson,
            phone: pg.phoneNumber,
            email: pg.email
          },
          description: pg.description,
          amenities: pg.amenities || [],
          availableRooms: pg.availableRooms,
          genderPreference: pg.genderPreference,
          pgCode: pg.pgCode || ''
        };
      });
      
      setRealListings(apiListings);
      setPgListings(apiListings);
      console.log('Loaded PG listings:', apiListings.length);
      setError(null);
    } catch (err) {
      console.warn('Failed to fetch listings:', err);
      setError('Could not load some listings');
      setRealListings([]);
      setPgListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      console.log('Approving PG with ID:', id);
      // Generate unique PG code
      const pgCode = `PG-${Math.floor(10000 + Math.random() * 90000)}`;
        // Update status and pgCode in mock local DB
        await mockUpdate('pgs', id, { status: 'approved', pgCode });
        // Update local state
        setPgListings(prev => 
          prev.map(pg => 
            pg.id === id ? { ...pg, status: 'approved', pgCode } : pg
          )
        );
        alert(`✅ PG approved successfully!\nPG Code: ${pgCode}`);
    } catch (error) {
      console.error('Failed to approve PG:', error);
      alert('❌ Failed to approve PG. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      console.log('Rejecting PG with ID:', id);
      await mockUpdate('pgs', id, { status: 'rejected' });
      
      // Update local state
      setPgListings(prev => 
        prev.map(pg => 
          pg.id === id ? { ...pg, status: 'rejected' } : pg
        )
      );
      
      alert('✅ PG rejected successfully!');
    } catch (error) {
      console.error('Failed to reject PG:', error);
      alert('❌ Failed to reject PG. Please try again.');
    }
  };

  const handleEdit = (id) => {
    console.log('Editing PG:', id);
    const pgToEdit = pgListings.find(pg => pg.id === id);
    if (pgToEdit) {
      // Extract coordinates if present
      let latitude = '';
      let longitude = '';
      if (pgToEdit.location && typeof pgToEdit.location === 'object') {
        latitude = pgToEdit.location.latitude || '';
        longitude = pgToEdit.location.longitude || '';
      }
      setEditingPG(pgToEdit);
      setEditFormData({
        name: pgToEdit.name || '',
        description: pgToEdit.description || '',
        price: pgToEdit.price || '',
        location: typeof pgToEdit.location === 'object' ? (pgToEdit.location.area || '') : (pgToEdit.location || ''),
        latitude,
        longitude,
        amenities: pgToEdit.amenities || [],
        genderPreference: pgToEdit.genderPreference || 'any',
        availableRooms: pgToEdit.availableRooms || '',
        contact: pgToEdit.contact || {}
      });
      setUploadedImages((pgToEdit.images || []).map(url => ({ url, name: '' })));
      setEditModalOpen(true);
    }
  };

  const handleViewDetails = (id) => {
    console.log('Navigating to PG details:', id);
    navigate(`/pg/${id}`);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (files) => {
    setImageUploadLoading(true);
    try {
      const pgId = editingPG?.id || `pg_${Date.now()}`;
      // Use mock storage to convert files to base64 and store in localStorage
      const urls = await mockUploadMultipleFiles(Array.from(files), `pg-images/${pgId}`);
      const newImages = urls.map((url, idx) => ({ url, name: files[idx]?.name || `image_${idx}` }));
      setUploadedImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload images. Try smaller files.');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      // Compose location object with coordinates
      const locationData = {
        area: editFormData.location || '',
        latitude: editFormData.latitude || '',
        longitude: editFormData.longitude || ''
      };
      const updateData = {
        name: editFormData.name,
        description: editFormData.description,
        price: parseFloat(editFormData.price) || 0,
        location: locationData,
        amenities: editFormData.amenities,
        genderPreference: editFormData.genderPreference,
        availableRooms: editFormData.availableRooms,
        contact: editFormData.contact,
        images: uploadedImages.map(img => img.url), // Only store URLs
      };

      // Update mock DB instead of Firestore
      await mockUpdate('pgs', editingPG.id, updateData);

      // Update local state
      setPgListings(prev =>
        prev.map(pg =>
          pg.id === editingPG.id ? { ...pg, ...updateData } : pg
        )
      );

      setEditModalOpen(false);
      setEditingPG(null);
      alert('✅ PG updated successfully!');

    } catch (error) {
      console.error('Failed to update PG:', error);
      alert('❌ Failed to update PG. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = pgListings.filter(pg => {
    const matchesSearch = pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pg.landlord.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pg.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      sold: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 pt-8 mb-6">PG Listings Management</h1>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {error && (
          <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search PGs, landlords, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchRealListings}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            All PG Listings ({filteredListings.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PG Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PG Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Landlord
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.map((pg) => (
                <tr key={pg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pg.name}</div>
                      <div className="text-sm text-gray-500">{pg.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold">
                    {pg.pgCode ? pg.pgCode : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pg.landlord}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{pg.price.toLocaleString()}/month
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(pg.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pg.type === 'Demo' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {pg.type || 'Real Submission'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pg.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(pg.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(pg.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                        {/* Mark Sold button temporarily removed */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No PG listings found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit PG Details</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PG Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => handleEditFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
                    <input
                      type="number"
                      value={editFormData.price || ''}
                      onChange={(e) => handleEditFormChange('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
                    <input
                      type="number"
                      value={editFormData.availableRooms || ''}
                      onChange={(e) => handleEditFormChange('availableRooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
                    <select
                      value={editFormData.genderPreference || 'any'}
                      onChange={(e) => handleEditFormChange('genderPreference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="any">Any</option>
                      <option value="male">Male Only</option>
                      <option value="female">Female Only</option>
                    </select>
                  </div>
                </div>

                {/* Location & Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area/Locality</label>
                    <input
                      type="text"
                      value={editFormData.location || ''}
                      onChange={(e) => handleEditFormChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="text"
                      value={editFormData.latitude || ''}
                      onChange={(e) => handleEditFormChange('latitude', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 28.6139"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="text"
                      value={editFormData.longitude || ''}
                      onChange={(e) => handleEditFormChange('longitude', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 77.2090"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PG Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {imageUploadLoading && (
                    <p className="text-sm text-gray-500 mt-2">Uploading images...</p>
                  )}
                  
                  {/* Image Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={typeof image === 'string' ? image : image.url}
                            alt={`PG Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPGListings;
