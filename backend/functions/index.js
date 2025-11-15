const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const config = require("./config");
const emailService = require("./emailService");

admin.initializeApp();

const db = admin.firestore();
if (process.env.FUNCTIONS_EMULATOR) {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Firebase Auth token validation middleware
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "No authorization token provided" 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request object
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

// Helper function to validate required fields
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return !value || (typeof value === 'string' && value.trim() === '') || 
           (typeof value === 'number' && isNaN(value));
  });
  return missingFields;
};

// Helper function to generate unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// ============= CASHBACK APIs =============

// Submit cashback request
app.post("/cashback-requests", async (req, res) => {
  try {
    const { pgId, fullName, contactInfo, pgName, bookingDate, amountPaid, bookingCode } = req.body;
    
    // Validate required fields
    const requiredFields = ['pgId', 'fullName', 'contactInfo', 'pgName', 'bookingDate', 'amountPaid', 'bookingCode'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Validate amount
    if (isNaN(amountPaid) || parseFloat(amountPaid) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount paid"
      });
    }
    
    // Validate contact info (basic email or phone validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!emailRegex.test(contactInfo) && !phoneRegex.test(contactInfo)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email or 10-digit phone number"
      });
    }
    
    // Create cashback request data
    const cashbackData = {
      pgId,
      fullName: fullName.trim(),
      contactInfo: contactInfo.trim(),
      pgName: pgName.trim(),
      bookingDate,
      amountPaid: parseFloat(amountPaid),
      bookingCode: bookingCode.trim(),
      status: 'pending', // pending, approved, rejected, paid
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Add to Firestore
    const docRef = await db.collection('cashback_requests').add(cashbackData);

    // Send email notification to admin
    await emailService.sendCashbackRequestNotification(cashbackData);

    // Log the submission
    console.log(`Cashback request submitted: ${docRef.id} for PG: ${pgName} by ${fullName}`);

    res.status(201).json({
      success: true,
      message: "Cashback request submitted successfully!",
      data: {
        id: docRef.id,
        status: 'pending',
        message: "Your cashback request has been received. We'll review it within 2-3 business days."
      }
    });
    
  } catch (error) {
    console.error('Error submitting cashback request:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error submitting cashback request. Please try again later." 
    });
  }
});

// Get all cashback requests (Admin only) - Protected route
app.get("/admin/cashback-requests", verifyFirebaseToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    // Verify admin privileges
    if (!req.user.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    let query = db.collection('cashback_requests').orderBy('createdAt', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();
    
    const requests = [];
    snapshot.forEach(doc => {
      requests.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        submittedAt: doc.data().submittedAt?.toDate()
      });
    });
    
    res.status(200).json({
      success: true,
      data: requests,
      total: requests.length
    });
    
  } catch (error) {
    console.error('Error fetching cashback requests:', error);
    res.status(500).json({ success: false, message: "Error fetching cashback requests" });
  }
});

// Update cashback request status (Admin only) - Protected route
app.patch("/admin/cashback-requests/:id/status", verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    // Verify admin privileges
    if (!req.user.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const validStatuses = ['pending', 'approved', 'rejected', 'paid'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes.trim();
    }
    
    if (status === 'approved') {
      updateData.approvedAt = admin.firestore.FieldValue.serverTimestamp();
    } else if (status === 'paid') {
      updateData.paidAt = admin.firestore.FieldValue.serverTimestamp();
    }
    
    await db.collection('cashback_requests').doc(id).update(updateData);
    
    res.status(200).json({
      success: true,
      message: `Cashback request status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Error updating cashback request:', error);
    res.status(500).json({ success: false, message: "Error updating cashback request" });
  }
});

// ============= CONTACT APIs =============

// Health check endpoint (public)
app.get("/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "PG Wale Bhaiya API is healthy!",
    timestamp: new Date().toISOString()
  });
});

// Create admin user endpoint (one-time setup)
app.post("/setup-admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // This is a one-time setup endpoint to create the admin user in Firebase Auth
    // In production, you would create this user through Firebase console
    const userRecord = await admin.auth().createUser({
      email: email || config.DEFAULT_ADMIN_EMAIL,
      password: password || config.DEFAULT_ADMIN_PASSWORD,
      emailVerified: true,
      displayName: 'PG Wale Bhaiya Admin'
    });
    
    // Set custom claims to mark as admin
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    
    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: { uid: userRecord.uid, email: userRecord.email }
    });
    
  } catch (error) {
    console.error('Admin setup error:', error);
    if (error.code === 'auth/email-already-exists') {
      // If admin already exists, set admin claims
      try {
        const existingUser = await admin.auth().getUserByEmail(config.DEFAULT_ADMIN_EMAIL);
        await admin.auth().setCustomUserClaims(existingUser.uid, { admin: true });
        return res.status(200).json({
          success: true,
          message: "Admin user already exists, claims updated",
          data: { uid: existingUser.uid, email: existingUser.email }
        });
      } catch (claimsError) {
        console.error('Claims update error:', claimsError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error creating admin user: " + error.message 
    });
  }
});

// ============= PG LISTINGS APIs =============

// Get all PG listings with optional filtering
app.get("/pgs", async (req, res) => {
  try {
    const { 
      status, 
      location, 
      minPrice, 
      maxPrice, 
      roomType, 
      amenities, 
      featured,
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = db.collection('pgs');
    
    // Start with a simple query - only filter by status if provided
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    // Get all documents first, then filter and sort in memory
    const snapshot = await query.get();
    let pgs = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      pgs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      });
    });
    
    // Sort by creation date (newest first) in memory
    pgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Client-side filtering for other parameters
    if (location) {
      pgs = pgs.filter(pg => {
        const pgLocation = typeof pg.location === 'object' 
          ? `${pg.location.area || ''} ${pg.location.locality || ''}`.toLowerCase()
          : (pg.location || '').toLowerCase();
        const searchLocation = location.toLowerCase();
        return pgLocation.includes(searchLocation) || 
               (pg.area || '').toLowerCase().includes(searchLocation) ||
               (pg.locality || '').toLowerCase().includes(searchLocation);
      });
    }
    
    if (minPrice) {
      pgs = pgs.filter(pg => (pg.price || pg.monthlyRent || 0) >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      pgs = pgs.filter(pg => (pg.price || pg.monthlyRent || 0) <= parseInt(maxPrice));
    }
    
    if (roomType) {
      pgs = pgs.filter(pg => (pg.type || pg.roomType) === roomType);
    }
    
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      pgs = pgs.filter(pg => 
        amenityList.every(amenity => 
          (pg.amenities || []).includes(amenity)
        )
      );
    }
    
    if (featured === 'true') {
      pgs = pgs.filter(pg => pg.featured === true);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPgs = pgs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedPgs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(pgs.length / limit),
        totalItems: pgs.length,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching PGs:', error);
    res.status(500).json({ success: false, message: "Error fetching PG listings" });
  }
});

// Get single PG by ID
app.get("/pgs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('pgs').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }
    
    const data = doc.data();
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    });
    
  } catch (error) {
    console.error('Error fetching PG:', error);
    res.status(500).json({ success: false, message: "Error fetching PG details" });
  }
});

// Create new PG listing
app.post("/pgs", async (req, res) => {
  try {
    const {
      name,           // New structure from frontend
      title,          // Old structure (keep for compatibility)
      description,
      type,
      roomType,       // Old structure
      location,       // Can be object or string
      area,           // Old structure
      locality,       // Old structure  
      fullAddress,
      price,
      monthlyRent,    // Old structure
      totalRooms,
      availableRooms,
      genderPreference,
      amenities,
      otherAmenities,
      contact,        // New structure - object with name, phone, email, whatsapp
      contactPerson,  // Old structure
      phoneNumber,    // Old structure
      email,          // Old structure
      whatsappNumber, // Old structure
      landlordId,
      status,
      featured,
      submissionType,
      submittedAt,
      images
    } = req.body;

    // Handle both new and old data structures
    const pgTitle = name || title;
    const pgType = type || roomType;
    const pgPrice = price || parseInt(monthlyRent);
    
    // Handle location - can be object or string
    const pgLocation = typeof location === 'object' 
      ? location 
      : {
          area: location || area,
          locality: locality,
          fullAddress: fullAddress
        };
    
    // Handle contact - can be object or separate fields
    const pgContact = contact || {
      name: contactPerson,
      phone: phoneNumber,
      email: email,
      whatsapp: whatsappNumber || phoneNumber
    };
    
    // Validate required fields
    const requiredFields = [
      pgTitle && 'name/title',
      pgType && 'type/roomType', 
      (pgLocation.area || area) && 'area',
      pgPrice && 'price/monthlyRent',
      availableRooms && 'availableRooms',
      genderPreference && 'genderPreference',
      pgContact.name && 'contact.name/contactPerson',
      pgContact.phone && 'contact.phone/phoneNumber',
      pgContact.email && 'contact.email/email'
    ].filter(Boolean);
    
    if (requiredFields.length < 9) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for PG creation"
      });
    }

    // Create PG data object
    const pgData = {
      name: pgTitle,
      title: pgTitle, // Keep for compatibility
      description: description || `${pgType} available in ${pgLocation.area || area}, ${pgLocation.locality || locality}`,
      type: pgType,
      roomType: pgType, // Keep for compatibility
      location: pgLocation,
      area: pgLocation.area || area, // Keep for compatibility
      locality: pgLocation.locality || locality, // Keep for compatibility
      fullAddress: pgLocation.fullAddress || fullAddress || '',
      distance: pgLocation.fullAddress ? `Near ${pgLocation.locality}` : `${pgLocation.area} area`,
      price: pgPrice,
      monthlyRent: pgPrice, // Keep for compatibility  
      totalRooms: totalRooms ? parseInt(totalRooms) : null,
      availableRooms: parseInt(availableRooms),
      genderPreference,
      contact: pgContact,
      // Keep old fields for compatibility - ensure no undefined values
      contactPerson: pgContact.name || '',
      phoneNumber: pgContact.phone || '',
      email: pgContact.email || '',
      whatsappNumber: pgContact.whatsapp || pgContact.phone || '',
      amenities: amenities || [],
      otherAmenities: otherAmenities?.trim() || '',
      tags: amenities || [],
      images: images || [],
      featured: featured || false,
      status: status || 'pending',
      submissionType: submissionType || 'manual',
      views: 0,
      inquiries: 0,
      landlordId: landlordId || null,
      submittedAt: submittedAt || admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Add to Firestore
    const docRef = await db.collection('pgs').add(pgData);
    
    // Send PG submission notification emails
    try {
      await emailService.sendPGSubmissionNotification({
        pgTitle: pgTitle,
        landlordName: pgContact.name,
        landlordEmail: pgContact.email,
        landlordPhone: pgContact.phone,
        location: `${pgLocation.area || area}, ${pgLocation.locality || locality}`,
        rent: `₹${pgPrice}`,
        roomType: pgType,
        genderPreference: genderPreference,
        availableRooms: availableRooms
      });
      console.log('PG submission notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send PG submission notification emails:', emailError);
      // Don't fail the PG creation if email fails
    }
    
    // Update landlord's total PGs count if landlordId is provided
    if (landlordId) {
      try {
        await db.collection('landlords').doc(landlordId).update({
          totalPGs: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (error) {
        console.error('Error updating landlord PG count:', error);
        // Don't fail the request if landlord update fails
      }
    }
    
    res.status(201).json({
      success: true,
      message: "PG listing created successfully!",
      data: {
        id: docRef.id,
        ...pgData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error creating PG listing:', error);
    res.status(500).json({ success: false, message: "Error creating PG listing" });
  }
});

// Update PG listing
app.put("/pgs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const docRef = db.collection('pgs').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }
    
    await docRef.update(updateData);
    
    res.json({
      success: true,
      message: "PG listing updated successfully!",
      data: { id, ...updateData }
    });
    
  } catch (error) {
    console.error('Error updating PG listing:', error);
    res.status(500).json({ success: false, message: "Error updating PG listing" });
  }
});

// Delete PG listing
app.delete("/pgs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = db.collection('pgs').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }
    
    await docRef.delete();
    
    res.json({
      success: true,
      message: "PG listing deleted successfully!"
    });
    
  } catch (error) {
    console.error('Error deleting PG listing:', error);
    res.status(500).json({ success: false, message: "Error deleting PG listing" });
  }
});

// Update PG status (approve/reject/feature)
app.patch("/pgs/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, featured, pgCode } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Initialize updateData object
    const updateData = {};
    if (status) updateData.status = status;
    if (typeof featured === 'boolean') updateData.featured = featured;
    if (pgCode) updateData.pgCode = pgCode;

    const docRef = db.collection('pgs').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }

    await docRef.update(updateData);

    res.json({
      success: true,
      message: "PG status updated successfully!",
      data: { id, ...updateData }
    });
    
  } catch (error) {
    console.error('Error updating PG status:', error);
    res.status(500).json({ success: false, message: "Error updating PG status" });
  }
});

// Increment PG views
app.post("/pgs/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = db.collection('pgs').doc(id);
    await docRef.update({
      views: admin.firestore.FieldValue.increment(1),
    });
    
    res.json({ success: true, message: "View count updated" });
    
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ success: false, message: "Error updating view count" });
  }
});

// ============= INQUIRY/CONTACT APIs =============

// Create inquiry for a PG
app.post("/pgs/:id/inquire", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, message, inquiryType = 'general' } = req.body;
    
    const requiredFields = ['name', 'phone'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if PG exists
    const pgDoc = await db.collection('pgs').doc(id).get();
    if (!pgDoc.exists) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }
    
    const pgData = pgDoc.data();
    
    // Create inquiry
    const inquiryData = {
      pgId: id,
      pgTitle: pgData.title,
      pgLocation: pgData.location,
      landlordEmail: pgData.email,
      landlordPhone: pgData.phoneNumber,
      inquirerName: name.trim(),
      inquirerPhone: phone.trim(),
      inquirerEmail: email?.trim().toLowerCase() || '',
      message: message?.trim() || '',
      inquiryType,
      status: 'new', // new, contacted, resolved
    };
    
    const docRef = await db.collection('inquiries').add(inquiryData);
    
    // Increment inquiry count in PG
    await db.collection('pgs').doc(id).update({
      inquiries: admin.firestore.FieldValue.increment(1),
    });
    
    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully!",
      data: {
        id: docRef.id,
        ...inquiryData,
        createdAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ success: false, message: "Error submitting inquiry" });
  }
});

// Get inquiries for a PG (for landlords)
app.get("/pgs/:id/inquiries", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    
    let query = db.collection('inquiries').where('pgId', '==', id);
    
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const inquiries = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      inquiries.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    res.json({
      success: true,
      data: inquiries
    });
    
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: "Error fetching inquiries" });
  }
});

// Get all inquiries (for admin)
app.get("/inquiries", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = db.collection('inquiries');
    
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const inquiries = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      inquiries.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedInquiries = inquiries.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedInquiries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(inquiries.length / limit),
        totalItems: inquiries.length,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: "Error fetching inquiries" });
  }
});

// Update inquiry status
app.patch("/inquiries/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'contacted', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const docRef = db.collection('inquiries').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }
    
    await docRef.update({
      status,
    });
    
    res.json({
      success: true,
      message: "Inquiry status updated successfully!",
      data: { id, status }
    });
    
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ success: false, message: "Error updating inquiry status" });
  }
});

// ============= LANDLORD APIs =============

// Landlord Authentication
app.post("/landlord-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    // Check in Firestore for landlord credentials
    const landlordSnapshot = await db.collection('landlords')
      .where('email', '==', email.trim().toLowerCase())
      .get();
    
    if (landlordSnapshot.empty) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
    
    const landlordDoc = landlordSnapshot.docs[0];
    const landlordData = landlordDoc.data();
    
    // Simple password check (in production, use proper hashing)
    if (landlordData.password === password) {
      // Send login notification emails
      try {
        await emailService.sendLandlordLoginNotification({
          name: landlordData.name,
          email: landlordData.email,
          phone: landlordData.phone
        });
        console.log('Login notification emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send login notification emails:', emailError);
        // Don't fail the login if email fails
      }
      
      return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: {
          landlord: {
            id: landlordDoc.id,
            email: landlordData.email,
            name: landlordData.name,
            phone: landlordData.phone,
            status: landlordData.status
          }
        }
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });
  } catch (error) {
    console.error('Landlord login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

// Landlord Registration
app.post("/landlord-register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      whatsapp,
      address,
      documentType,
      documentNumber
    } = req.body;
    
    const requiredFields = ['name', 'email', 'phone', 'password'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if landlord already exists
    const existingLandlord = await db.collection('landlords')
      .where('email', '==', email.trim().toLowerCase())
      .get();
    
    if (!existingLandlord.empty) {
      return res.status(400).json({
        success: false,
        message: "Landlord with this email already exists"
      });
    }
    
    const landlordData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password, // In production, hash this
      whatsapp: whatsapp?.trim() || phone.trim(),
      address: address?.trim() || '',
      documentType: documentType || '',
      documentNumber: documentNumber?.trim() || '',
      status: 'pending', // pending, verified, suspended
      totalPGs: 0,
      totalInquiries: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('landlords').add(landlordData);
    
    // Send email notifications
    try {
      await emailService.sendLandlordRegistrationNotification({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        businessName: null // Registration doesn't have business name
      });
      console.log('Registration notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send registration notification emails:', emailError);
      // Don't fail the registration if email fails
    }
    
    res.status(201).json({
      success: true,
      message: "Landlord account created successfully! Please wait for verification.",
      data: {
        id: docRef.id,
        name: landlordData.name,
        email: landlordData.email,
        phone: landlordData.phone,
        status: landlordData.status
      }
    });
    
  } catch (error) {
    console.error('Error creating landlord:', error);
    res.status(500).json({ success: false, message: "Error creating landlord account" });
  }
});

// Create landlord account (Admin endpoint)
app.post("/landlords", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp,
      address,
      documentType,
      documentNumber
    } = req.body;
    
    const requiredFields = ['name', 'email', 'phone'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if landlord already exists
    const existingLandlord = await db.collection('landlords')
      .where('email', '==', email.trim().toLowerCase())
      .get();
    
    if (!existingLandlord.empty) {
      // Return existing landlord instead of error for form submissions
      const existingDoc = existingLandlord.docs[0];
      const existingData = existingDoc.data();
      
      // Update the existing landlord's info if needed
      const updateData = {};
      if (name.trim() !== existingData.name) updateData.name = name.trim();
      if (phone.trim() !== existingData.phone) updateData.phone = phone.trim();
      if ((whatsapp?.trim() || phone.trim()) !== existingData.whatsapp) {
        updateData.whatsapp = whatsapp?.trim() || phone.trim();
      }
      
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        await existingDoc.ref.update(updateData);
      }
      
      return res.status(200).json({
        success: true,
        message: "Landlord account found and updated",
        data: {
          id: existingDoc.id,
          ...existingData,
          ...updateData,
          createdAt: existingData.createdAt?.toDate?.() || new Date(),
          updatedAt: new Date()
        },
        isExisting: true
      });
    }
    
    const landlordData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || phone.trim(),
      address: address?.trim() || '',
      documentType: documentType || '',
      documentNumber: documentNumber?.trim() || '',
      status: 'active', // Make them active instead of pending for form submissions
      totalPGs: 0,
      totalInquiries: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('landlords').add(landlordData);
    
    // Send email notifications for new landlord creation
    try {
      await emailService.sendLandlordRegistrationNotification({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        businessName: null // Form submissions don't have business name
      });
      console.log('Landlord creation notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send landlord creation notification emails:', emailError);
      // Don't fail the creation if email fails
    }
    
    res.status(201).json({
      success: true,
      message: "Landlord account created successfully!",
      data: {
        id: docRef.id,
        ...landlordData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error creating landlord:', error);
    res.status(500).json({ success: false, message: "Error creating landlord account" });
  }
});

// Get landlord dashboard stats
app.get("/landlord/:landlordId/dashboard", async (req, res) => {
  try {
    const { landlordId } = req.params;
    
    // Verify landlord exists
    const landlordDoc = await db.collection('landlords').doc(landlordId).get();
    if (!landlordDoc.exists) {
      return res.status(404).json({ success: false, message: "Landlord not found" });
    }
    
    // Get landlord's PGs
    const pgsSnapshot = await db.collection('pgs')
      .where('landlordId', '==', landlordId)
      .get();
    
    const pgStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      featured: 0
    };
    
    let totalViews = 0;
    let totalInquiries = 0;
    
    pgsSnapshot.forEach(doc => {
      const data = doc.data();
      pgStats.total++;
      pgStats[data.status] = (pgStats[data.status] || 0) + 1;
      if (data.featured) pgStats.featured++;
      totalViews += data.views || 0;
      totalInquiries += data.inquiries || 0;
    });
    
    // Get recent inquiries for this landlord's PGs
    const pgIds = [];
    pgsSnapshot.forEach(doc => pgIds.push(doc.id));
    
    let recentInquiries = [];
    if (pgIds.length > 0) {
      const inquiriesSnapshot = await db.collection('inquiries')
        .where('pgId', 'in', pgIds)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
      
      inquiriesSnapshot.forEach(doc => {
        const data = doc.data();
        recentInquiries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date()
        });
      });
    }
    
    res.json({
      success: true,
      data: {
        pgStats,
        totalViews,
        totalInquiries,
        recentInquiries
      }
    });
    
  } catch (error) {
    console.error('Error fetching landlord dashboard:', error);
    res.status(500).json({ success: false, message: "Error fetching dashboard data" });
  }
});

// Get landlord's PG listings
app.get("/landlord/:landlordId/pgs", async (req, res) => {
  try {
    const { landlordId } = req.params;
    const { status, page = 1, limit = 12 } = req.query;
    
    let query = db.collection('pgs').where('landlordId', '==', landlordId);
    
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const pgs = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      pgs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      });
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPgs = pgs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedPgs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(pgs.length / limit),
        totalItems: pgs.length,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching landlord PGs:', error);
    res.status(500).json({ success: false, message: "Error fetching PG listings" });
  }
});

// Get landlord's inquiries
app.get("/landlord/:landlordId/inquiries", async (req, res) => {
  try {
    const { landlordId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;
    
    // First get all PGs for this landlord
    const pgsSnapshot = await db.collection('pgs')
      .where('landlordId', '==', landlordId)
      .get();
    
    const pgIds = [];
    pgsSnapshot.forEach(doc => pgIds.push(doc.id));
    
    if (pgIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit)
        }
      });
    }
    
    // Get inquiries for all landlord's PGs
    let query = db.collection('inquiries').where('pgId', 'in', pgIds);
    
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const inquiries = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      inquiries.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedInquiries = inquiries.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedInquiries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(inquiries.length / limit),
        totalItems: inquiries.length,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching landlord inquiries:', error);
    res.status(500).json({ success: false, message: "Error fetching inquiries" });
  }
});

// Update landlord profile
app.put("/landlord/:landlordId/profile", async (req, res) => {
  try {
    const { landlordId } = req.params;
    const { name, phone, whatsapp, address, documentType, documentNumber } = req.body;
    
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (whatsapp) updateData.whatsapp = whatsapp.trim();
    if (address) updateData.address = address.trim();
    if (documentType) updateData.documentType = documentType;
    if (documentNumber) updateData.documentNumber = documentNumber.trim();
    
    const docRef = db.collection('landlords').doc(landlordId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Landlord not found" });
    }
    
    await docRef.update(updateData);
    
    res.json({
      success: true,
      message: "Profile updated successfully!",
      data: { id: landlordId, ...updateData }
    });
    
  } catch (error) {
    console.error('Error updating landlord profile:', error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// Get all landlords (for admin)
app.get("/landlords", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = db.collection('landlords');
    
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const landlords = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      landlords.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      });
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLandlords = landlords.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedLandlords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(landlords.length / limit),
        totalItems: landlords.length,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching landlords:', error);
    res.status(500).json({ success: false, message: "Error fetching landlords" });
  }
});

// Get landlord by ID
app.get("/landlords/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('landlords').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Landlord not found" });
    }
    
    const data = doc.data();
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    });
    
  } catch (error) {
    console.error('Error fetching landlord:', error);
    res.status(500).json({ success: false, message: "Error fetching landlord details" });
  }
});

// Update landlord status (admin only)
app.patch("/landlords/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'verified', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const docRef = db.collection('landlords').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Landlord not found" });
    }
    
    await docRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: "Landlord status updated successfully!",
      data: { id, status }
    });
    
  } catch (error) {
    console.error('Error updating landlord status:', error);
    res.status(500).json({ success: false, message: "Error updating landlord status" });
  }
});

// ============= DASHBOARD/ANALYTICS APIs =============

// Get admin dashboard stats - Protected route
app.get("/admin/dashboard", verifyFirebaseToken, async (req, res) => {
  try {
    // Get PG stats
    const pgsSnapshot = await db.collection('pgs').get();
    const pgStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      featured: 0
    };
    
    pgsSnapshot.forEach(doc => {
      const data = doc.data();
      pgStats.total++;
      pgStats[data.status]++;
      if (data.featured) pgStats.featured++;
    });
    
    // Get landlord stats
    const landlordsSnapshot = await db.collection('landlords').get();
    const landlordStats = {
      total: landlordsSnapshot.size,
      verified: 0,
      pending: 0,
      suspended: 0
    };
    
    landlordsSnapshot.forEach(doc => {
      const data = doc.data();
      landlordStats[data.status]++;
    });
    
    // Get inquiry stats
    const inquiriesSnapshot = await db.collection('inquiries').get();
    const inquiryStats = {
      total: inquiriesSnapshot.size,
      new: 0,
      contacted: 0,
      resolved: 0
    };
    
    inquiriesSnapshot.forEach(doc => {
      const data = doc.data();
      inquiryStats[data.status]++;
    });
    
    // Get recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPGsSnapshot = await db.collection('pgs')
      .where('createdAt', '>=', thirtyDaysAgo)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    const recentActivities = [];
    recentPGsSnapshot.forEach(doc => {
      const data = doc.data();
      recentActivities.push({
        id: doc.id,
        type: 'pg_created',
        title: data.title,
        location: data.location,
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    res.json({
      success: true,
      data: {
        pgStats,
        landlordStats,
        inquiryStats,
        recentActivities
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: "Error fetching dashboard data" });
  }
});

// ============= SEARCH API =============

// Advanced search API
app.get("/search", async (req, res) => {
  try {
    const { 
      query, 
      location,
      minPrice,
      maxPrice,
      roomType,
      amenities,
      page = 1,
      limit = 12
    } = req.query;
    
    let pgsQuery = db.collection('pgs').where('status', '==', 'approved');
    
    // Apply basic filters
    if (location) {
      pgsQuery = pgsQuery.where('location', '>=', location)
                        .where('location', '<=', location + '\uf8ff');
    }
    
    const snapshot = await pgsQuery.get();
    let pgs = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      pgs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    // Text search in title, location, locality
    if (query) {
      const searchQuery = query.toLowerCase();
      pgs = pgs.filter(pg => 
        pg.title.toLowerCase().includes(searchQuery) ||
        pg.location.toLowerCase().includes(searchQuery) ||
        pg.locality.toLowerCase().includes(searchQuery)
      );
    }
    
    // Price filtering
    if (minPrice) {
      pgs = pgs.filter(pg => pg.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      pgs = pgs.filter(pg => pg.price <= parseInt(maxPrice));
    }
    
    // Room type filtering
    if (roomType) {
      pgs = pgs.filter(pg => pg.roomType === roomType);
    }
    
    // Amenities filtering
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      pgs = pgs.filter(pg => 
        amenityList.some(amenity => 
          pg.amenities?.includes(amenity)
        )
      );
    }
    
    // Sort by relevance (featured first, then by date)
    pgs.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPgs = pgs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedPgs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(pgs.length / limit),
        totalItems: pgs.length,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error searching PGs:', error);
    res.status(500).json({ success: false, message: "Error searching PG listings" });
  }
});

// ============= STUDENT PROFILE APIs =============

// Register student
app.post("/students/register", async (req, res) => {
  try {
    const { name, email, college, phone, password } = req.body;
    
    const requiredFields = ['name', 'email'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if student already exists
    const existingStudent = await db.collection('students')
      .where('email', '==', email.trim().toLowerCase())
      .get();
    
    if (!existingStudent.empty) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists"
      });
    }
    
    const studentData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      college: college?.trim() || '',
      phone: phone?.trim() || '',
      password: password, // In production, hash this
      aadhaarVerified: false,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('students').add(studentData);
    
    res.status(201).json({
      success: true,
      message: "Student account created successfully!",
      data: {
        id: docRef.id,
        name: studentData.name,
        email: studentData.email,
        college: studentData.college,
        phone: studentData.phone
      }
    });
    
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, message: "Error creating student account" });
  }
});

// Student login
app.post("/students/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    const studentSnapshot = await db.collection('students')
      .where('email', '==', email.trim().toLowerCase())
      .get();
    
    if (studentSnapshot.empty) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
    
    const studentDoc = studentSnapshot.docs[0];
    const studentData = studentDoc.data();
    
    if (studentData.password === password) {
      return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: {
          student: {
            id: studentDoc.id,
            email: studentData.email,
            name: studentData.name,
            college: studentData.college,
            phone: studentData.phone,
            aadhaarVerified: studentData.aadhaarVerified,
            status: studentData.status
          }
        }
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });
  } catch (error) {
    console.error('Student login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

// Get student profile
app.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('students').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    const data = doc.data();
    // Don't send password in response
    delete data.password;
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    });
    
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ success: false, message: "Error fetching student details" });
  }
});

// Update student profile
app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, college, phone } = req.body;
    
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (name) updateData.name = name.trim();
    if (college) updateData.college = college.trim();
    if (phone) updateData.phone = phone.trim();
    
    const docRef = db.collection('students').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    await docRef.update(updateData);
    
    res.json({
      success: true,
      message: "Profile updated successfully!",
      data: { id, ...updateData, updatedAt: new Date() }
    });
    
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// Upload student Aadhaar
app.post("/students/:id/aadhaar", async (req, res) => {
  try {
    const { id } = req.params;
    const { aadhaarData, aadhaarNumber } = req.body;
    
    if (!aadhaarData) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar document is required"
      });
    }
    
    const docRef = db.collection('students').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    await docRef.update({
      aadhaarData,
      aadhaarNumber: aadhaarNumber?.trim() || '',
      aadhaarVerified: false,
      aadhaarUploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: "Aadhaar uploaded successfully! It will be verified within 24-48 hours.",
      data: { id, aadhaarVerified: false }
    });
    
  } catch (error) {
    console.error('Error uploading Aadhaar:', error);
    res.status(500).json({ success: false, message: "Error uploading Aadhaar" });
  }
});

// Verify student Aadhaar (Admin only)
app.patch("/students/:id/verify-aadhaar", verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    
    if (!req.user.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const docRef = db.collection('students').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    await docRef.update({
      aadhaarVerified: verified === true,
      aadhaarVerifiedAt: verified ? admin.firestore.FieldValue.serverTimestamp() : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: `Aadhaar ${verified ? 'verified' : 'rejected'} successfully!`,
      data: { id, aadhaarVerified: verified === true }
    });
    
  } catch (error) {
    console.error('Error verifying Aadhaar:', error);
    res.status(500).json({ success: false, message: "Error verifying Aadhaar" });
  }
});

// Get all students (Admin only)
app.get("/students", verifyFirebaseToken, async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const { page = 1, limit = 20 } = req.query;
    
    const snapshot = await db.collection('students')
      .orderBy('createdAt', 'desc')
      .get();
    
    const students = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      delete data.password; // Don't send passwords
      students.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      });
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedStudents = students.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedStudents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(students.length / limit),
        totalItems: students.length,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: "Error fetching students" });
  }
});

// ============= MISC APIs =============

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "PG Wale Bhaiya API is running!", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all available amenities
app.get("/amenities", (req, res) => {
  const amenities = [
    'WiFi', 'AC', 'TV', 'Mess', 'Parking', 
    'Washing Machine', 'Power Backup', 
    'Refrigerator', 'Security', 'Geyser',
    'Gym', 'Laundry', 'Study Room', 'Garden',
    'Swimming Pool', 'CCTV', '24/7 Water',
    'Housekeeping', 'Medical Facility', 'Recreation Room'
  ];
  
  res.json({
    success: true,
    data: amenities
  });
});

// Contact form submission
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || 'General Inquiry',
      message: message.trim(),
      status: 'new',
    };
    
    const docRef = await db.collection('contacts').add(contactData);
    
    res.status(201).json({
      success: true,
      message: "Contact message sent successfully!",
      data: {
        id: docRef.id,
        ...contactData,
        createdAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, message: "Error submitting contact form" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    availableEndpoints: [
      'GET /health',
      'POST /setup-admin',
      // Student APIs
      'POST /students/register',
      'POST /students/login',
      'GET /students',
      'GET /students/:id',
      'PUT /students/:id',
      'POST /students/:id/aadhaar',
      'PATCH /students/:id/verify-aadhaar',
      // Landlord APIs
      'POST /landlord-login',
      'POST /landlord-register', 
      'POST /landlords',
      'GET /landlords',
      'GET /landlords/:id',
      'PATCH /landlords/:id/status',
      'GET /landlord/:landlordId/dashboard',
      'GET /landlord/:landlordId/pgs',
      'GET /landlord/:landlordId/inquiries',
      'PUT /landlord/:landlordId/profile',
      // PG APIs
      'GET /pgs',
      'POST /pgs',
      'GET /pgs/:id',
      'PUT /pgs/:id',
      'DELETE /pgs/:id',
      'PATCH /pgs/:id/status',
      'POST /pgs/:id/view',
      'POST /pgs/:id/inquire',
      'GET /pgs/:id/inquiries',
      // Inquiry APIs
      'GET /inquiries',
      'PATCH /inquiries/:id/status',
      // Dashboard APIs
      'GET /admin/dashboard',
      // Search & Filter APIs
      'GET /search',
      'GET /amenities',
      // Contact APIs
      'POST /contact',
      // Cashback APIs
      'POST /cashback-requests',
      'GET /admin/cashback-requests',
      'PATCH /admin/cashback-requests/:id/status'
    ]
  });
});

exports.api = functions.https.onRequest(app);