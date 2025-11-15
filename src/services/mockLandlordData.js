// Mock data for landlord dashboard (localStorage based)

// Get landlord PGs from localStorage
export const getLandlordPGs = () => {
  const storedPGs = localStorage.getItem('mockDB_landlordPGs');
  if (storedPGs) {
    return JSON.parse(storedPGs);
  }
  
  // Default sample PG for demo
  const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
  if (!landlordData.id) return [];
  
  const samplePGs = [
    {
      id: 'pg-demo-1',
      landlordId: landlordData.id,
      title: 'Cozy PG near Metro',
      name: 'Cozy PG near Metro',
      location: 'Sector 21, Dwarka',
      area: 'Dwarka',
      status: 'live',
      price: 8000,
      monthlyRent: 8000,
      rooms: 12,
      totalRooms: 12,
      occupied: 8,
      availableRooms: 4,
      datePosted: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      views: 145,
      image: '/pgs/green-1.jpg',
      images: ['/pgs/green-1.jpg', '/pgs/green-2.jpg'],
      featured: true,
      type: 'Triple Sharing',
      roomType: 'Triple Sharing',
      pgCode: 'PGW001'
    },
    {
      id: 'pg-demo-2',
      landlordId: landlordData.id,
      title: 'Modern PG with AC',
      name: 'Modern PG with AC',
      location: 'Sector 18, Noida',
      area: 'Noida',
      status: 'pending',
      price: 12000,
      monthlyRent: 12000,
      rooms: 8,
      totalRooms: 8,
      occupied: 0,
      availableRooms: 8,
      datePosted: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      views: 23,
      image: '/pgs/royal-1.jpg',
      images: ['/pgs/royal-1.jpg', '/pgs/royal-2.jpg'],
      featured: false,
      type: 'Double Sharing',
      roomType: 'Double Sharing',
      pgCode: 'PGW002'
    }
  ];
  
  // Store in localStorage
  localStorage.setItem('mockDB_landlordPGs', JSON.stringify(samplePGs));
  return samplePGs;
};

// Add new PG
export const addLandlordPG = (pgData) => {
  const pgs = getLandlordPGs();
  const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
  
  const newPG = {
    ...pgData,
    id: `pg-${Date.now()}`,
    landlordId: landlordData.id,
    status: 'pending',
    datePosted: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    views: 0,
    pgCode: `PGW${String(pgs.length + 1).padStart(3, '0')}`
  };
  
  pgs.push(newPG);
  localStorage.setItem('mockDB_landlordPGs', JSON.stringify(pgs));
  return newPG;
};

// Update PG
export const updateLandlordPG = (pgId, updates) => {
  const pgs = getLandlordPGs();
  const index = pgs.findIndex(pg => pg.id === pgId);
  
  if (index !== -1) {
    pgs[index] = { ...pgs[index], ...updates };
    localStorage.setItem('mockDB_landlordPGs', JSON.stringify(pgs));
    return pgs[index];
  }
  
  return null;
};

// Delete PG
export const deleteLandlordPG = (pgId) => {
  const pgs = getLandlordPGs();
  const filtered = pgs.filter(pg => pg.id !== pgId);
  localStorage.setItem('mockDB_landlordPGs', JSON.stringify(filtered));
  return true;
};

// Get dashboard stats
export const getLandlordStats = () => {
  const pgs = getLandlordPGs();
  
  return {
    totalPGs: pgs.length,
    livePGs: pgs.filter(pg => pg.status === 'live').length,
    pendingPGs: pgs.filter(pg => pg.status === 'pending').length,
    totalViews: pgs.reduce((sum, pg) => sum + (pg.views || 0), 0),
    totalRooms: pgs.reduce((sum, pg) => sum + (pg.totalRooms || 0), 0),
    occupiedRooms: pgs.reduce((sum, pg) => sum + (pg.occupied || 0), 0)
  };
};
