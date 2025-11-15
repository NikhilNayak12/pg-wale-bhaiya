import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, mockLogout } from '../services/mockAuth';
import { 
  User, 
  Mail, 
  GraduationCap, 
  LogOut, 
  Home, 
  Calendar,
  MapPin,
  Phone,
  Settings,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Generate a consistent avatar based on user name
const generateAvatar = (name) => {
  const colors = [
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-amber-400 to-amber-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
  ];
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colorIndex = name.length % colors.length;
  
  return { initials, colorClass: colors[colorIndex] };
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [avatar, setAvatar] = useState({ initials: '', colorClass: '' });
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('none'); // none, uploading, success, error
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    college: '',
    phone: ''
  });

  useEffect(() => {
    const userData = getCurrentUser('student');
    if (userData) {
      setStudent(userData);
      setAvatar(generateAvatar(userData.name));
      setEditedData({
        name: userData.name || '',
        email: userData.email || '',
        college: userData.college || '',
        phone: userData.phone || ''
      });
    } else {
      navigate('/student/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    mockLogout('student');
    navigate('/student/login');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditedData({
        name: student.name || '',
        email: student.email || '',
        college: student.college || '',
        phone: student.phone || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // Update student data
    const updatedStudent = {
      ...student,
      ...editedData
    };
    
    // Save to localStorage
    const allUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    if (!allUsers.students) allUsers.students = [];
    
    const studentIndex = allUsers.students.findIndex(s => s.id === student.id);
    if (studentIndex !== -1) {
      allUsers.students[studentIndex] = updatedStudent;
    }
    
    localStorage.setItem('mockUsers', JSON.stringify(allUsers));
    localStorage.setItem('currentUser', JSON.stringify({ type: 'student', data: updatedStudent }));
    
    // Update state
    setStudent(updatedStudent);
    setAvatar(generateAvatar(updatedStudent.name));
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const joinedDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap size={32} className="text-amber-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">PG wale Bhaiya</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-all duration-300"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 ${avatar.colorClass} rounded-full flex items-center justify-center shadow-2xl border-4 border-white`}>
              <span className="text-3xl font-bold text-white">{avatar.initials}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Welcome, {student.name}!</h2>
              <p className="text-amber-100">Ready to find your perfect PG accommodation?</p>
            </div>
          </div>
        </div>

        {/* Document Verification Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Document Verification</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Upload your Aadhaar Card for identity verification. This helps landlords trust your profile and increases your chances of booking.
              </p>
              
              {/* Upload Status */}
              {uploadStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Document Uploaded Successfully!</p>
                    <p className="text-xs text-green-600">Your Aadhaar card has been uploaded and is pending verification.</p>
                  </div>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Upload Failed</p>
                    <p className="text-xs text-red-600">Please try again with a valid image file (PNG, JPG, PDF).</p>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-400 transition-all duration-300">
                {aadhaarPreview ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={aadhaarPreview} 
                        alt="Aadhaar Preview" 
                        className="max-h-48 rounded-lg border border-gray-300 shadow-md"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setUploadStatus('uploading');
                          setTimeout(() => {
                            localStorage.setItem(`student_${student.id}_aadhaar`, aadhaarPreview);
                            setUploadStatus('success');
                          }, 1500);
                        }}
                        disabled={uploadStatus === 'uploading'}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {uploadStatus === 'uploading' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            Upload Document
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setAadhaarFile(null);
                          setAadhaarPreview(null);
                          setUploadStatus('none');
                        }}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setAadhaarFile(file);
                          if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAadhaarPreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                        <Upload size={32} className="text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 mb-1">Upload Aadhaar Card</p>
                        <p className="text-sm text-gray-600">Click to browse or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-2">Supported: PNG, JPG, PDF (Max 5MB)</p>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* Verification Status */}
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600" />
                  <p className="text-xs text-amber-800">
                    <span className="font-semibold">Note:</span> Your document will be verified within 24-48 hours. Keep your information secure and don't share it with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <User size={24} className="text-amber-600" />
                Profile Details
              </h3>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      <CheckCircle size={16} />
                      Save Changes
                    </button>
                    <button 
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    <Settings size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {/* Avatar Display */}
            <div className="flex justify-center mb-8">
              <div className={`w-32 h-32 ${avatar.colorClass} rounded-full flex items-center justify-center shadow-2xl border-4 border-amber-100 transform transition-all duration-300 hover:scale-110`}>
                <span className="text-5xl font-bold text-white">{avatar.initials}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="group">
                <label className="flex text-sm font-semibold text-gray-500 mb-2 items-center gap-2">
                  <User size={16} className="text-amber-600" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-4 bg-white rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 text-lg font-medium text-gray-900 outline-none"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:border-amber-300 group-hover:shadow-md transition-all duration-300">
                    <p className="text-lg font-medium text-gray-900">{student.name}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="flex text-sm font-semibold text-gray-500 mb-2 items-center gap-2">
                  <Mail size={16} className="text-amber-600" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-4 bg-white rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 text-lg font-medium text-gray-900 outline-none"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:border-amber-300 group-hover:shadow-md transition-all duration-300">
                    <p className="text-lg font-medium text-gray-900">{student.email}</p>
                  </div>
                )}
              </div>

              {/* College */}
              <div className="group">
                <label className="flex text-sm font-semibold text-gray-500 mb-2 items-center gap-2">
                  <GraduationCap size={16} className="text-amber-600" />
                  College/University
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    className="w-full p-4 bg-white rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 text-lg font-medium text-gray-900 outline-none"
                    placeholder="Enter your college/university"
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:border-amber-300 group-hover:shadow-md transition-all duration-300">
                    <p className="text-lg font-medium text-gray-900">{student.college || 'Not specified'}</p>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div className="group">
                <label className="flex text-sm font-semibold text-gray-500 mb-2 items-center gap-2">
                  <Calendar size={16} className="text-amber-600" />
                  Member Since
                </label>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:border-amber-300 group-hover:shadow-md transition-all duration-300">
                  <p className="text-lg font-medium text-gray-900">{joinedDate}</p>
                </div>
              </div>

              {/* Account Type */}
              <div className="group">
                <label className="flex text-sm font-semibold text-gray-500 mb-2 items-center gap-2">
                  <User size={16} className="text-amber-600" />
                  Account Type
                </label>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:border-amber-300 group-hover:shadow-md transition-all duration-300">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-semibold rounded-full border border-amber-200">
                    Student Account
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="group">
                <label className="flex text-sm font-semibold text-gray-500 mb-2 items-center gap-2">
                  <Settings size={16} className="text-amber-600" />
                  Account Status
                </label>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:border-amber-300 group-hover:shadow-md transition-all duration-300">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-semibold rounded-full border border-green-200">
                    ✓ Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/listings')}
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-amber-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Browse PGs</h4>
            <p className="text-sm text-gray-600">Find your perfect accommodation</p>
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-amber-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Phone size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h4>
            <p className="text-sm text-gray-600">Get help and support</p>
          </button>

          <button
            onClick={() => navigate('/')}
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-amber-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Home size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Go Home</h4>
            <p className="text-sm text-gray-600">Return to homepage</p>
          </button>
        </div>
      </main>
    </div>
  );
}
