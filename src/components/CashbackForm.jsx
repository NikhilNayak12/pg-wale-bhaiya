import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { mockAdd } from '@/services/mockDB';

const CashbackForm = ({ isOpen, onClose, pgId, pgName }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactInfo: '',
    pgName: pgName || '',
    bookingDate: '',
    amountPaid: '',
    bookingCode: '',
    paymentProof: null,
    paymentProofBase64: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          paymentProof: 'Please upload a valid image (JPEG, PNG, WebP) or PDF file'
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          paymentProof: 'File size must be less than 5MB'
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          paymentProof: file,
          paymentProofBase64: reader.result
        }));
        setErrors(prev => ({
          ...prev,
          paymentProof: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact number or email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!emailRegex.test(formData.contactInfo) && !phoneRegex.test(formData.contactInfo)) {
        newErrors.contactInfo = 'Please enter a valid email or 10-digit phone number';
      }
    }
    if (!formData.pgName.trim()) {
      newErrors.pgName = 'PG name is required';
    }
    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Booking date is required';
    }
    if (!formData.amountPaid) {
      newErrors.amountPaid = 'Amount paid is required';
    } else if (isNaN(formData.amountPaid) || parseFloat(formData.amountPaid) <= 0) {
      newErrors.amountPaid = 'Please enter a valid amount';
    }
    if (!formData.bookingCode.trim()) {
      newErrors.bookingCode = 'Booking code is required';
    }
    if (!formData.paymentProof) {
      newErrors.paymentProof = 'Payment proof is required';
    }
    if (!formData.paymentProofBase64) {
      newErrors.paymentProof = 'Payment proof is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await mockAdd('cashbackRequests', {
        pgId,
        fullName: formData.fullName,
        contactInfo: formData.contactInfo,
        pgName: formData.pgName,
        bookingDate: formData.bookingDate,
        amountPaid: formData.amountPaid,
        bookingCode: formData.bookingCode,
        paymentProofBase64: formData.paymentProofBase64,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          fullName: '',
          contactInfo: '',
          pgName: pgName || '',
          bookingDate: '',
          amountPaid: '',
          bookingCode: '',
          paymentProof: null,
          paymentProofBase64: ''
        });
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting cashback request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cashback Request</h2>
            <p className="text-sm text-gray-600 mt-1">Fill out the form to claim your booking cashback</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="text-green-600 mr-3" size={20} />
            <div>
              <p className="text-green-800 font-medium">Cashback request submitted successfully!</p>
              <p className="text-green-600 text-sm">We'll review your request and get back to you within 2-3 business days.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="text-red-600 mr-3" size={20} />
            <div>
              <p className="text-red-800 font-medium">Failed to submit cashback request</p>
              <p className="text-red-600 text-sm">Please try again later or contact support.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number / Email *
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.contactInfo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Email or 10-digit phone number"
              />
              {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>}
            </div>

            {/* PG Name */}
            <div>
              <label htmlFor="pgName" className="block text-sm font-medium text-gray-700 mb-2">
                PG Name *
              </label>
              <input
                type="text"
                id="pgName"
                name="pgName"
                value={formData.pgName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.pgName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter PG name"
              />
              {errors.pgName && <p className="text-red-500 text-sm mt-1">{errors.pgName}</p>}
            </div>

            {/* Booking Date */}
            <div>
              <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-2">
                Booking Date *
              </label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.bookingDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bookingDate && <p className="text-red-500 text-sm mt-1">{errors.bookingDate}</p>}
            </div>

            {/* Amount Paid */}
            <div>
              <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid (₹) *
              </label>
              <input
                type="number"
                id="amountPaid"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleInputChange}
                min="1"
                step="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.amountPaid ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
              />
              {errors.amountPaid && <p className="text-red-500 text-sm mt-1">{errors.amountPaid}</p>}
            </div>

            {/* Booking Code */}
            <div>
              <label htmlFor="bookingCode" className="block text-sm font-medium text-gray-700 mb-2">
                Booking Code *
              </label>
              <input
                type="text"
                id="bookingCode"
                name="bookingCode"
                value={formData.bookingCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.bookingCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter booking code"
              />
              {errors.bookingCode && <p className="text-red-500 text-sm mt-1">{errors.bookingCode}</p>}
            </div>
          </div>

          {/* Payment Proof */}
          <div className="mt-6">
            <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Proof (Image/PDF) *
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              errors.paymentProof ? 'border-red-500' : 'border-gray-300'
            }`}>
              <input
                type="file"
                id="paymentProof"
                name="paymentProof"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
              <label
                htmlFor="paymentProof"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="text-gray-400 mb-3" size={48} />
                <p className="text-sm text-gray-600 mb-2">
                  {formData.paymentProof 
                    ? `Selected: ${formData.paymentProof.name}` 
                    : 'Click to upload payment proof'}
                  {formData.paymentProofBase64 && (
                    <img src={formData.paymentProofBase64} alt="Preview" className="mt-2 mx-auto max-h-32 rounded" />
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Supports: JPEG, PNG, WebP, PDF (Max 5MB)
                </p>
              </label>
            </div>
            {errors.paymentProof && <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Submitted
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashbackForm;
