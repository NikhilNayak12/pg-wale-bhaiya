// src/data/pgs.js
// Static demo PG data for hackathon demo (no backend required)

export const demoFeaturedPGs = [
  {
    id: 'pg_featured_1',
    name: 'Green Valley PG',
    title: 'Green Valley PG',
    description: 'Premium PG with modern amenities near LPU campus. Spacious rooms with attached bathrooms, 24/7 security, and high-speed WiFi.',
    price: 8500,
    monthlyRent: 8500,
    location: 'Phagwara, Punjab',
    area: 'Near LPU Gate 3',
    locality: 'Phagwara',
    images: ['/pgs/green-1.jpg', '/pgs/green-2.jpg', '/pgs/green-3.jpg'],
    amenities: ['WiFi', 'AC', 'Laundry', 'Mess', 'Security', 'Power Backup'],
    availableRooms: 8,
    genderPreference: 'boys',
    status: 'approved',
    featured: true,
    pgCode: 'PG-10001',
    nearbyPlaces: [
      { name: 'LPU Main Gate', distance: '1.2 km', time: '15 min walk' },
      { name: 'Auto Stand', distance: '0.5 km', time: '5 min walk' },
      { name: 'Local Market', distance: '0.8 km', time: '10 min walk' },
      { name: 'City Hospital', distance: '2.5 km', time: '8 min drive' },
      { name: 'Bus Stand', distance: '1.5 km', time: '5 min auto' },
      { name: 'ATM', distance: '0.3 km', time: '3 min walk' }
    ],
    contact: {
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@greenvalley.com'
    }
  },
  {
    id: 'pg_featured_2',
    name: 'Sunshine Residency',
    title: 'Sunshine Residency',
    description: 'Comfortable and affordable PG for students. Includes free WiFi, mess facility, and study room. Walking distance from LPU.',
    price: 7000,
    monthlyRent: 7000,
    location: 'Phagwara, Punjab',
    area: 'LPU Campus Road',
    locality: 'Phagwara',
    images: ['/pgs/sunshine-1.jpg', '/pgs/sunshine-2.jpg', '/pgs/sunshine-3.jpg'],
    amenities: ['WiFi', 'Mess', 'Study Room', 'Security', 'Parking'],
    availableRooms: 12,
    genderPreference: 'girls',
    status: 'approved',
    featured: true,
    pgCode: 'PG-10002',
    nearbyPlaces: [
      { name: 'LPU Main Gate', distance: '0.8 km', time: '10 min walk' },
      { name: 'Auto Stand', distance: '0.4 km', time: '4 min walk' },
      { name: 'Local Market', distance: '1.0 km', time: '12 min walk' },
      { name: 'City Hospital', distance: '3.0 km', time: '10 min drive' },
      { name: 'Bus Stand', distance: '2.0 km', time: '6 min auto' },
      { name: 'Pharmacy', distance: '0.6 km', time: '7 min walk' }
    ],
    contact: {
      name: 'Priya Sharma',
      phone: '9876543211',
      email: 'priya@sunshine.com'
    }
  },
  {
    id: 'pg_featured_3',
    name: 'Campus Comfort PG',
    title: 'Campus Comfort PG',
    description: 'Budget-friendly PG with all basic amenities. Clean rooms, homely food, and friendly environment.',
    price: 6500,
    monthlyRent: 6500,
    location: 'Phagwara, Punjab',
    area: 'Behind LPU',
    locality: 'Phagwara',
    images: ['/pgs/campus-1.jpg', '/pgs/campus-2.jpg', '/pgs/campus-3.jpg'],
    amenities: ['WiFi', 'Mess', 'Security', 'Common TV'],
    availableRooms: 10,
    genderPreference: 'boys',
    status: 'approved',
    featured: true,
    pgCode: 'PG-10003',
    nearbyPlaces: [
      { name: 'LPU Main Gate', distance: '1.5 km', time: '18 min walk' },
      { name: 'Auto Stand', distance: '0.7 km', time: '8 min walk' },
      { name: 'Local Market', distance: '0.5 km', time: '6 min walk' },
      { name: 'City Hospital', distance: '2.8 km', time: '9 min drive' },
      { name: 'Bus Stand', distance: '1.8 km', time: '6 min auto' },
      { name: 'Grocery Store', distance: '0.2 km', time: '2 min walk' }
    ],
    contact: {
      name: 'Amit Singh',
      phone: '9876543212',
      email: 'amit@campuscomfort.com'
    }
  }
];

export const demoAllPGs = [
  ...demoFeaturedPGs,
  {
    id: 'pg_4',
    name: 'Elite Student PG',
    title: 'Elite Student PG',
    description: 'Luxury PG with AC rooms, gym, and recreational facilities.',
    price: 12000,
    monthlyRent: 12000,
    location: 'Phagwara, Punjab',
    area: 'LPU Main Road',
    locality: 'Phagwara',
    images: ['/pgs/elite-1.jpg', '/pgs/elite-2.jpg', '/pgs/elite-3.jpg'],
    amenities: ['WiFi', 'AC', 'Gym', 'Mess', 'Security', 'Power Backup', 'Laundry'],
    availableRooms: 6,
    genderPreference: 'any',
    status: 'approved',
    featured: false,
    pgCode: 'PG-10004',
    nearbyPlaces: [
      { name: 'LPU Main Gate', distance: '0.9 km', time: '11 min walk' },
      { name: 'Auto Stand', distance: '0.6 km', time: '7 min walk' },
      { name: 'Local Market', distance: '1.2 km', time: '14 min walk' },
      { name: 'City Hospital', distance: '2.2 km', time: '7 min drive' },
      { name: 'Bus Stand', distance: '1.3 km', time: '4 min auto' },
      { name: 'Shopping Complex', distance: '1.5 km', time: '5 min auto' }
    ],
    contact: {
      name: 'Vikram Patel',
      phone: '9876543213',
      email: 'vikram@elite.com'
    }
  },
  {
    id: 'pg_5',
    name: 'Royal PG',
    title: 'Royal PG',
    description: 'Well-maintained PG with excellent food and housekeeping services.',
    price: 9000,
    monthlyRent: 9000,
    location: 'Phagwara, Punjab',
    area: 'Near Railway Station',
    locality: 'Phagwara',
    images: ['/pgs/royal-1.jpg', '/pgs/royal-2.jpg', '/pgs/royal-3.jpg'],
    amenities: ['WiFi', 'Mess', 'Housekeeping', 'Security', 'Parking'],
    availableRooms: 8,
    genderPreference: 'boys',
    status: 'approved',
    featured: false,
    pgCode: 'PG-10005',
    nearbyPlaces: [
      { name: 'LPU Main Gate', distance: '3.5 km', time: '10 min auto' },
      { name: 'Auto Stand', distance: '0.3 km', time: '3 min walk' },
      { name: 'Local Market', distance: '0.4 km', time: '5 min walk' },
      { name: 'City Hospital', distance: '1.5 km', time: '5 min drive' },
      { name: 'Railway Station', distance: '0.2 km', time: '2 min walk' },
      { name: 'Bus Stand', distance: '0.5 km', time: '6 min walk' }
    ],
    contact: {
      name: 'Rohit Verma',
      phone: '9876543214',
      email: 'rohit@royal.com'
    }
  },
  {
    id: 'pg_6',
    name: 'Haven Residency',
    title: 'Haven Residency',
    description: 'Safe and secure PG for girls with CCTV surveillance and female caretaker.',
    price: 8000,
    monthlyRent: 8000,
    location: 'Phagwara, Punjab',
    area: 'LPU Gate 2',
    locality: 'Phagwara',
    images: ['/pgs/haven-1.jpg', '/pgs/haven-2.jpg', '/pgs/haven-3.jpg'],
    amenities: ['WiFi', 'Mess', 'Security', 'CCTV', 'Common Room'],
    availableRooms: 10,
    genderPreference: 'girls',
    status: 'approved',
    featured: false,
    pgCode: 'PG-10006',
    nearbyPlaces: [
      { name: 'LPU Main Gate', distance: '1.0 km', time: '12 min walk' },
      { name: 'Auto Stand', distance: '0.5 km', time: '6 min walk' },
      { name: 'Local Market', distance: '0.7 km', time: '8 min walk' },
      { name: 'City Hospital', distance: '2.6 km', time: '8 min drive' },
      { name: 'Bus Stand', distance: '1.6 km', time: '5 min auto' },
      { name: 'Ladies Hostel', distance: '0.8 km', time: '10 min walk' }
    ],
    contact: {
      name: 'Sunita Devi',
      phone: '9876543215',
      email: 'sunita@haven.com'
    }
  }
];

// Mock API response format
export const getPGs = async (params = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let pgs = params.featured ? demoFeaturedPGs : demoAllPGs;
  
  // Apply filters
  if (params.status === 'approved') {
    pgs = pgs.filter(pg => pg.status === 'approved');
  }
  
  if (params.limit) {
    pgs = pgs.slice(0, params.limit);
  }
  
  return pgs;
};

// Fallback for backward compatibility
export const fallbackPGs = demoAllPGs;
export const pgs = demoAllPGs;

export default { getPGs, demoFeaturedPGs, demoAllPGs, fallbackPGs };
