// Mock Storage Service (No Firebase Storage)
// Uses localStorage and base64 encoding for demo purposes

// Mock file upload - converts to base64 and stores in localStorage
export const mockUploadFile = async (file, path) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const base64Data = reader.result;
      const fileKey = `file_${path}_${Date.now()}`;
      
      try {
        // Store in localStorage (max ~5-10MB depending on browser)
        localStorage.setItem(fileKey, base64Data);
        
        // Return mock URL
        const mockUrl = base64Data;
        resolve(mockUrl);
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          reject(new Error('Storage quota exceeded. Please use smaller images.'));
        } else {
          reject(error);
        }
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Mock multiple file uploads
export const mockUploadMultipleFiles = async (files, basePath) => {
  const uploadPromises = files.map((file, index) => 
    mockUploadFile(file, `${basePath}/${index}`)
  );
  
  return Promise.all(uploadPromises);
};

// Get stored file (just returns the base64 data)
export const mockGetFileUrl = (path) => {
  return localStorage.getItem(path) || null;
};

// Delete file from localStorage
export const mockDeleteFile = (path) => {
  localStorage.removeItem(path);
};
