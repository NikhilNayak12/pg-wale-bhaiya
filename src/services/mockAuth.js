// Mock Authentication Service (No Firebase)
// Uses localStorage for demo purposes

const MOCK_USERS = {
  // Demo landlord accounts
  'demo@landlord.com': {
    password: 'demo123',
    type: 'landlord',
    id: 'landlord-1',
    name: 'Demo Landlord',
    email: 'demo@landlord.com'
  },
  'landlord@test.com': {
    password: 'password123',
    type: 'landlord',
    id: 'landlord-2',
    name: 'Test Landlord',
    email: 'landlord@test.com'
  },
  // Demo admin account
  'admin@pgwalebhaiya.com': {
    password: 'admin123',
    type: 'admin',
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@pgwalebhaiya.com'
  },
  // Demo student account
  'student@test.com': {
    password: 'student123',
    type: 'student',
    id: 'student-1',
    name: 'Rahul Kumar',
    email: 'student@test.com',
    college: 'Lovely Professional University'
  }
};

// Mock login function
export const mockLogin = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS[email];
      
      if (!user) {
        reject({ message: 'EMAIL_NOT_FOUND' });
        return;
      }
      
      if (user.password !== password) {
        reject({ message: 'INVALID_PASSWORD' });
        return;
      }
      
      // Create mock token
      const mockToken = btoa(JSON.stringify({ email, id: user.id, timestamp: Date.now() }));
      
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        token: mockToken
      };
      
      // Save to localStorage
      localStorage.setItem(`${user.type}LoggedIn`, 'true');
      localStorage.setItem(`${user.type}Data`, JSON.stringify(userData));
      
      // Also set adminAuthenticated for ProtectedAdminRoute
      if (user.type === 'admin') {
        localStorage.setItem('adminAuthenticated', 'true');
      }
      
      if (user.type === 'landlord') {
        localStorage.setItem('landlordEmail', email);
      }
      
      resolve(userData);
    }, 500); // Simulate network delay
  });
};

// Mock signup function
export const mockSignup = async (email, password, name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      if (MOCK_USERS[email]) {
        reject({ message: 'EMAIL_EXISTS' });
        return;
      }
      
      // Create new mock user
      const newUser = {
        id: `landlord-${Date.now()}`,
        email,
        name,
        type: 'landlord',
        token: btoa(JSON.stringify({ email, timestamp: Date.now() }))
      };
      
      // Save to localStorage
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
      existingUsers[email] = { password, ...newUser };
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
      
      localStorage.setItem('landlordLoggedIn', 'true');
      localStorage.setItem('landlordData', JSON.stringify(newUser));
      localStorage.setItem('landlordEmail', email);
      
      resolve(newUser);
    }, 500);
  });
};

// Mock password reset
export const mockPasswordReset = async (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS[email];
      const customUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
      
      if (!user && !customUsers[email]) {
        reject({ message: 'EMAIL_NOT_FOUND' });
        return;
      }
      
      // In a real app, this would send an email
      console.log(`Password reset link sent to ${email}`);
      resolve({ success: true });
    }, 500);
  });
};

// Mock logout
export const mockLogout = (userType = 'landlord') => {
  localStorage.removeItem(`${userType}LoggedIn`);
  localStorage.removeItem(`${userType}Data`);
  
  // Also remove adminAuthenticated for admin users
  if (userType === 'admin') {
    localStorage.removeItem('adminAuthenticated');
  }
  
  if (userType === 'landlord') {
    localStorage.removeItem('landlordEmail');
  }
};

// Check if user is logged in
export const isLoggedIn = (userType = 'landlord') => {
  return localStorage.getItem(`${userType}LoggedIn`) === 'true';
};

// Get current user data
export const getCurrentUser = (userType = 'landlord') => {
  const userData = localStorage.getItem(`${userType}Data`);
  return userData ? JSON.parse(userData) : null;
};

// Mock student login function
export const mockStudentLogin = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS[email];
      const customUsers = JSON.parse(localStorage.getItem('mockStudents') || '{}');
      const customUser = customUsers[email];
      
      const targetUser = user || customUser;
      
      if (!targetUser) {
        reject({ message: 'EMAIL_NOT_FOUND' });
        return;
      }
      
      if (targetUser.password !== password) {
        reject({ message: 'INVALID_PASSWORD' });
        return;
      }
      
      // Create mock token
      const mockToken = btoa(JSON.stringify({ email, id: targetUser.id, timestamp: Date.now() }));
      
      const userData = {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        college: targetUser.college,
        type: 'student',
        token: mockToken
      };
      
      // Save to localStorage
      localStorage.setItem('studentLoggedIn', 'true');
      localStorage.setItem('studentData', JSON.stringify(userData));
      
      resolve(userData);
    }, 500);
  });
};

// Mock student signup function
export const mockStudentSignup = async (email, password, name, college) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      if (MOCK_USERS[email]) {
        reject({ message: 'EMAIL_EXISTS' });
        return;
      }
      
      const customUsers = JSON.parse(localStorage.getItem('mockStudents') || '{}');
      if (customUsers[email]) {
        reject({ message: 'EMAIL_EXISTS' });
        return;
      }
      
      // Create new mock student
      const newStudent = {
        id: `student-${Date.now()}`,
        email,
        name,
        college,
        type: 'student',
        token: btoa(JSON.stringify({ email, timestamp: Date.now() }))
      };
      
      // Save to localStorage
      customUsers[email] = { password, ...newStudent };
      localStorage.setItem('mockStudents', JSON.stringify(customUsers));
      
      localStorage.setItem('studentLoggedIn', 'true');
      localStorage.setItem('studentData', JSON.stringify(newStudent));
      
      resolve(newStudent);
    }, 500);
  });
};

// Demo credentials for display
export const DEMO_CREDENTIALS = {
  landlord: {
    email: 'demo@landlord.com',
    password: 'demo123'
  },
  admin: {
    email: 'admin@pgwalebhaiya.com',
    password: 'admin123'
  },
  student: {
    email: 'student@test.com',
    password: 'student123'
  }
};
