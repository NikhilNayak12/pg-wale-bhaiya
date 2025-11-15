// Mock Database Service (No Firebase/Firestore)
// Uses localStorage for all data operations

// Initialize mock database with default data
export const initMockDB = () => {
  if (!localStorage.getItem('mockDB_initialized')) {
    // Default PG listings will come from pgs.js
    localStorage.setItem('mockDB_cashbackRequests', JSON.stringify([]));
    localStorage.setItem('mockDB_landlordPGs', JSON.stringify([]));
    localStorage.setItem('mockDB_initialized', 'true');
  }
};

// Generic CRUD operations
export const mockGet = (collection, id) => {
  const data = JSON.parse(localStorage.getItem(`mockDB_${collection}`) || '[]');
  if (id) {
    return data.find(item => item.id === id) || null;
  }
  return data;
};

export const mockGetAll = (collection) => {
  return JSON.parse(localStorage.getItem(`mockDB_${collection}`) || '[]');
};

export const mockAdd = (collection, data) => {
  const items = JSON.parse(localStorage.getItem(`mockDB_${collection}`) || '[]');
  const newItem = {
    ...data,
    id: data.id || `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  items.push(newItem);
  localStorage.setItem(`mockDB_${collection}`, JSON.stringify(items));
  return newItem;
};

export const mockUpdate = (collection, id, updates) => {
  const items = JSON.parse(localStorage.getItem(`mockDB_${collection}`) || '[]');
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('Item not found');
  }
  
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(`mockDB_${collection}`, JSON.stringify(items));
  return items[index];
};

export const mockDelete = (collection, id) => {
  const items = JSON.parse(localStorage.getItem(`mockDB_${collection}`) || '[]');
  const filtered = items.filter(item => item.id !== id);
  localStorage.setItem(`mockDB_${collection}`, JSON.stringify(filtered));
  return true;
};

// Query with filters
export const mockQuery = (collection, filters = {}) => {
  let items = JSON.parse(localStorage.getItem(`mockDB_${collection}`) || '[]');
  
  Object.keys(filters).forEach(key => {
    items = items.filter(item => item[key] === filters[key]);
  });
  
  return items;
};

// Specific helpers for PG data
export const mockGetPGsByLandlord = (landlordId) => {
  return mockQuery('landlordPGs', { landlordId });
};

export const mockGetCashbackRequests = (status = null) => {
  if (status) {
    return mockQuery('cashbackRequests', { status });
  }
  return mockGetAll('cashbackRequests');
};

// Initialize on import
initMockDB();
