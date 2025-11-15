import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Clock, DollarSign, FileText, Phone, Mail, Calendar, Hash } from 'lucide-react';
import { mockGetAll, mockUpdate } from '../services/mockDB';

const CashbackRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCashbackRequests();
  }, [filter]);

  // Replace fetchCashbackRequests to use mock localStorage
  const fetchCashbackRequests = async () => {
    setLoading(true);
    try {
      let data = mockGetAll('cashbackRequests');
      if (filter !== 'all') {
        data = data.filter(r => r.status === filter);
      }
      setRequests(data);
    } catch (error) {
      console.error('Error fetching cashback requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Admin approval: update mock localStorage (no real storage upload)
  const updateRequestStatus = async (requestId, status, adminNotes = '') => {
    setIsUpdating(true);
    try {
      const updateData = { 
        status, 
        adminNotes, 
        updatedAt: new Date().toISOString() 
      };
      
      await mockUpdate('cashbackRequests', requestId, updateData);
      setRequests(prev => prev.map(req => req.id === requestId ? { ...req, ...updateData } : req));
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Error updating request status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <X size={16} />;
      case 'paid': return <DollarSign size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cashback Requests</h2>
          <p className="text-gray-600 mt-1">Manage student cashback requests</p>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected', 'paid'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' ? ` (${requests.length})` : 
               ` (${requests.filter(r => r.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cashback requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' ? 'No requests have been submitted yet.' : `No ${filter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{request.fullName}</h3>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{request.contactInfo}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-gray-600">PG:</span>
                      <span className="font-medium">{request.pgName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatAmount(request.amountPaid)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">{new Date(request.bookingDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Hash size={16} className="text-gray-400" />
                      <span className="text-gray-600">Booking Code:</span>
                      <span className="font-medium font-mono">{request.bookingCode}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">{formatDate(request.submittedAt)}</span>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {request.adminNotes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Admin Notes:</span> {request.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'approved')}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-green-400"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'rejected')}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:bg-red-400"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {request.status === 'approved' && (
                    <button
                      onClick={() => updateRequestStatus(request.id, 'paid')}
                      disabled={isUpdating}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      Mark as Paid
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Cashback Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.contactInfo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PG Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.pgName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Booking Date</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedRequest.bookingDate).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                  <p className="mt-1 text-sm text-gray-900">{formatAmount(selectedRequest.amountPaid)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Booking Code</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{selectedRequest.bookingCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRequest.submittedAt)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Proof</label>
                {selectedRequest.paymentProofUrl ? (
                  <a href={selectedRequest.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download / View</a>
                ) : selectedRequest.paymentProofBase64 ? (
                  <img src={selectedRequest.paymentProofBase64} alt="Payment Proof" className="mt-2 max-h-48 rounded" />
                ) : (
                  <span className="text-gray-500">No payment proof</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashbackRequests;
