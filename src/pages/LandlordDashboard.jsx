import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Home, 
  Eye, 
  MapPin, 
  Edit, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Building,
  Users,
  Calendar,
  Settings,
  BarChart3,
  RefreshCw,
  Upload,
  FileText,
  AlertCircle
} from 'lucide-react';
import { mockLogout } from '@/services/mockAuth';
import { getLandlordPGs, getLandlordStats, updateLandlordPG } from '@/services/mockLandlordData';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    live: { 
      label: 'Live', 
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle 
    },
    pending: { 
      label: 'Pending', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock 
    },
    sold: { 
      label: 'Sold Out', 
      className: 'bg-red-100 text-red-800 border-red-200',
      icon: DollarSign 
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: Clock
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600", 
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-soft-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick, variant = 'secondary' }) => {
  const baseClasses = "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors";
  const variants = {
    primary: "bg-amber-600 text-white hover:bg-amber-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
};

const EmptyState = ({ onAddPG }) => (
  <div className="text-center py-16">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Building className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No PG listings found</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      You haven't submitted any PG listings yet. Get started by posting your first PG - it only takes a few minutes!
    </p>
    <div className="space-y-4">
      <button 
        onClick={onAddPG}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Plus size={20} />
        Post Your First PG
      </button>
      <p className="text-sm text-gray-500">
        Once submitted, your PG will appear here with status updates
      </p>
    </div>
  </div>
);

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [pgData, setPgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [landlordName, setLandlordName] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const fetchLandlordName = () => {
    const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
    setLandlordName(landlordData.name || "Landlord");
  };

  useEffect(() => {
    fetchDashboardData();
    fetchLandlordName();
    loadSavedDocument();
  }, []);

  const loadSavedDocument = () => {
    const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
    const savedDoc = localStorage.getItem(`landlord_${landlordData.id || 'demo'}_aadhaar`);
    if (savedDoc) {
      setAadhaarPreview(savedDoc);
      setUploadStatus('verified');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadhaarFile(file);
        setAadhaarPreview(reader.result);
        setUploadStatus(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadDocument = () => {
    if (aadhaarPreview) {
      const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
      localStorage.setItem(`landlord_${landlordData.id || 'demo'}_aadhaar`, aadhaarPreview);
      setUploadStatus('verified');
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleRemoveDocument = () => {
    const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
    localStorage.removeItem(`landlord_${landlordData.id || 'demo'}_aadhaar`);
    setAadhaarFile(null);
    setAadhaarPreview(null);
    setUploadStatus(null);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get landlord PGs from mock data (localStorage)
      const landlordPGs = getLandlordPGs();
      
      setPgData(landlordPGs);
      
      // Show empty state if no PGs
      if (landlordPGs.length === 0) {
        console.log('No PGs found - showing empty state');
      }
    } catch (err) {
      console.warn('Failed to fetch dashboard data:', err.message);
      setPgData([]);
      setError(`Unable to load your PGs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  // Calculate stats from mock data
  const stats = getLandlordStats();

  // Filter PGs based on search and status
  const filteredPGs = pgData.filter(pg => {
  const matchesSearch = pg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pg.location?.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter === 'all' || pg.status === statusFilter;
  return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-gray-300 rounded-xl h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddPG = () => {
    // Navigate to add PG page
    navigate('/post-pg');
  };

  const handleEdit = (pgId) => {
    // Navigate to edit PG page (if exists) or show edit modal
    console.log('Edit PG:', pgId);
    // For now, show an alert with edit functionality
    alert(`Edit functionality for PG ${pgId} will be implemented. For now, please post a new PG if you need to make changes.`);
  };

  const handleMarkSold = async (pgId) => {
    try {
      await updatePGStatus(pgId, { status: 'sold' });
      alert('PG marked as sold successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error marking PG as sold:', error);
      alert('Failed to update PG status. Please try again.');
    }
  };

  const handleViewDetails = (pgId) => {
    // Navigate to PG details page
    navigate(`/pg/${pgId}`);
  };

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-amber-700">Welcome, {landlordName || 'Landlord'}!</h1>
              <p className="text-sm text-gray-600">Manage your property listings</p>
            </div>
            {/* Logout button top right */}
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to logout?')) {
                  mockLogout('landlord');
                  window.location.href = '/';
                }
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-5 py-2 rounded-full shadow transition-all text-base"
              style={{ marginLeft: 'auto' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Properties" 
            value={stats.total} 
            icon={Building} 
            color="blue"
          />
          <StatsCard 
            title="Live Listings" 
            value={stats.live} 
            icon={CheckCircle} 
            color="green"
          />
          <StatsCard 
            title="Pending Review" 
            value={stats.pending} 
            icon={Clock} 
            color="yellow"
          />
          <StatsCard 
            title="Sold Out" 
            value={stats.sold} 
            icon={DollarSign} 
            color="red"
          />
        </div>

        {/* Document Verification Section */}
        <div className="bg-white rounded-xl shadow-soft-lg p-6 mb-8 border-2 border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Document Verification</h2>
              <p className="text-sm text-gray-600">Upload your Aadhaar card for landlord verification</p>
            </div>
          </div>

          <div className="space-y-4">
            {!aadhaarPreview ? (
              <div className="border-2 border-dashed border-amber-200 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
                <Upload className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium mb-2">Upload Aadhaar Card</p>
                <p className="text-sm text-gray-500 mb-4">Supports: JPG, PNG, PDF (Max 5MB)</p>
                <label className="btn-primary inline-flex items-center gap-2 cursor-pointer">
                  <Upload size={18} />
                  Choose File
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {aadhaarPreview.includes('application/pdf') ? (
                        <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-10 h-10 text-red-600" />
                        </div>
                      ) : (
                        <img
                          src={aadhaarPreview}
                          alt="Aadhaar preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-gray-900">
                          {aadhaarFile?.name || 'Aadhaar Card'}
                        </span>
                      </div>
                      {uploadStatus === 'verified' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">Document verified successfully!</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Document ready to upload</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {uploadStatus !== 'verified' && (
                    <button
                      onClick={handleUploadDocument}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Upload size={18} />
                      Upload & Verify
                    </button>
                  )}
                  <button
                    onClick={handleRemoveDocument}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={18} />
                    Remove Document
                  </button>
                </div>
              </div>
            )}

            {uploadStatus === 'verified' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Verification Complete</p>
                  <p className="text-sm text-green-700">
                    Your Aadhaar card has been uploaded and saved successfully. This helps build trust with potential tenants.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-soft-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search your properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold Out</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Add New PG Button */}
            <div className="flex gap-3">
              <button 
                onClick={handleRetry}
                className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap"
                disabled={loading}
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button 
                onClick={handleAddPG}
                className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} />
                Add New PG
              </button>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        {filteredPGs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft-lg">
            <EmptyState onAddPG={handleAddPG} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-soft-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PG Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPGs.map((pg) => (
                    <tr key={pg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={pg.image} 
                            alt={pg.title}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {pg.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Posted {new Date(pg.datePosted).toLocaleDateString('en-GB')}
                            </div>
                            {pg.status === 'rejected' && (
                              <div className="mt-1 text-xs text-red-600 font-semibold">This PG was rejected by admin.</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700 font-bold">
                        {pg.pgCode ? pg.pgCode : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin size={16} className="mr-1 text-gray-400" />
                          {pg.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={pg.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{pg.price.toLocaleString()}/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Eye size={16} className="mr-1 text-gray-400" />
                          {pg.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButton
                            icon={Eye}
                            label="View"
                            onClick={() => handleViewDetails(pg.id)}
                            variant="secondary"
                          />
                          {/* Mark Sold button temporarily removed */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
