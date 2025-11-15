import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockLogout } from '@/services/mockAuth';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'listings', label: 'PG Listings', icon: BuildingOfficeIcon },
    { id: 'landlords', label: 'Landlords', icon: UserGroupIcon },
    { id: 'cashback', label: 'Cashback Requests', icon: CurrencyDollarIcon },
  ];

  const handleLogout = () => {
    mockLogout('admin');
    navigate('/admin-final-boss-1q2w/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg pt-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                : 'text-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors text-red-600 mt-8"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
