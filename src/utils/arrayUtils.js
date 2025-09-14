// Modern Array Utilities with ES6+ Features

/**
 * Array manipulation utilities showcasing modern JavaScript
 */

// Array methods and functional programming
export const arrayUtils = {
  // Remove duplicates using Set
  removeDuplicates: (arr) => [...new Set(arr)],
  
  // Group array elements by a property
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
  
  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
  
  // Find intersection of two arrays
  intersection: (arr1, arr2) => arr1.filter(x => arr2.includes(x)),
  
  // Flatten nested arrays
  flatten: (arr) => arr.flat(Infinity),
  
  // Sort array of objects by property
  sortBy: (arr, key, direction = 'asc') => {
    return [...arr].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  },
  
  // Get random element from array
  random: (arr) => arr[Math.floor(Math.random() * arr.length)],
  
  // Shuffle array using Fisher-Yates algorithm
  shuffle: (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// Async utilities
export const asyncUtils = {
  // Delay function
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Retry function with exponential backoff
  retry: async (fn, maxAttempts = 3, baseDelay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await asyncUtils.delay(baseDelay * Math.pow(2, attempt - 1));
      }
    }
  },
  
  // Batch process array with concurrency limit
  batchProcess: async (items, processor, batchSize = 5) => {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(processor));
      results.push(...batchResults);
    }
    return results;
  }
};

// String utilities
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  
  // Convert to camelCase
  toCamelCase: (str) => {
    return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
  },
  
  // Convert to kebab-case
  toKebabCase: (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },
  
  // Truncate string with ellipsis
  truncate: (str, length, suffix = '...') => {
    return str.length > length ? str.substring(0, length) + suffix : str;
  },
  
  // Generate random string
  randomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
};

// Object utilities
export const objectUtils = {
  // Deep clone object
  deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
  
  // Pick specific properties from object
  pick: (obj, keys) => {
    return keys.reduce((result, key) => {
      if (key in obj) result[key] = obj[key];
      return result;
    }, {});
  },
  
  // Omit specific properties from object
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },
  
  // Check if object is empty
  isEmpty: (obj) => Object.keys(obj).length === 0,
  
  // Merge objects deeply
  deepMerge: (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = objectUtils.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
};

// Math utilities
export const mathUtils = {
  // Clamp number between min and max
  clamp: (num, min, max) => Math.min(Math.max(num, min), max),
  
  // Generate random number between min and max
  randomBetween: (min, max) => Math.random() * (max - min) + min,
  
  // Round to specific decimal places
  roundTo: (num, decimals) => Number(num.toFixed(decimals)),
  
  // Calculate percentage
  percentage: (value, total) => (value / total) * 100,
  
  // Calculate average
  average: (arr) => arr.reduce((sum, num) => sum + num, 0) / arr.length,
  
  // Find median
  median: (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }
};

// DOM utilities
export const domUtils = {
  // Query selector with error handling
  qs: (selector, parent = document) => {
    const element = parent.querySelector(selector);
    if (!element) console.warn(`Element not found: ${selector}`);
    return element;
  },
  
  // Query all with array return
  qsAll: (selector, parent = document) => {
    return Array.from(parent.querySelectorAll(selector));
  },
  
  // Add event listener with cleanup
  addListener: (element, event, handler, options = {}) => {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
  },
  
  // Create element with attributes
  createElement: (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, value);
      } else {
        element[key] = value;
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }
};

// Validation utilities
export const validationUtils = {
  // Email validation
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  // Phone validation (basic)
  isPhone: (phone) => /^\+?[\d\s-()]+$/.test(phone),
  
  // URL validation
  isUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // Check if string is numeric
  isNumeric: (str) => !isNaN(str) && !isNaN(parseFloat(str)),
  
  // Password strength checker
  passwordStrength: (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return {
      score,
      strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
      checks
    };
  }
};

// Local storage utilities with error handling
export const storageUtils = {
  // Set item with JSON serialization
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },
  
  // Get item with JSON parsing
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },
  
  // Remove item
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  },
  
  // Clear all items
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
};

// Date utilities
export const dateUtils = {
  // Format date
  format: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
  },
  
  // Get relative time (e.g., "2 hours ago")
  timeAgo: (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'just now';
  },
  
  // Add days to date
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  // Check if date is today
  isToday: (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
};

// Performance utilities
export const performanceUtils = {
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Memoization
  memoize: (fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  },
  
  // Measure execution time
  measureTime: async (fn, label = 'Function') => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  }
};

// API utilities
export const apiUtils = {
  // Fetch with timeout and retry
  fetchWithRetry: async (url, options = {}, maxRetries = 3) => {
    const { timeout = 5000, ...fetchOptions } = options;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await asyncUtils.delay(1000 * attempt);
      }
    }
  },
  
  // POST request helper
  post: async (url, data, options = {}) => {
    return apiUtils.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
  },
  
  // GET request helper
  get: async (url, options = {}) => {
    return apiUtils.fetchWithRetry(url, {
      method: 'GET',
      ...options
    });
  }
};

// Form utilities
export const formUtils = {
  // Serialize form data
  serialize: (form) => {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    return data;
  },
  
  // Validate form fields
  validate: (data, rules) => {
    const errors = {};
    
    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      
      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = `${field} is required`;
      } else if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || `${field} format is invalid`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Browser utilities
export const browserUtils = {
  // Check if browser supports feature
  supports: (feature) => {
    const features = {
      localStorage: typeof Storage !== 'undefined',
      webGL: !!window.WebGLRenderingContext,
      webWorkers: typeof Worker !== 'undefined',
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window
    };
    return features[feature] || false;
  },
  
  // Get browser info
  getBrowserInfo: () => {
    const ua = navigator.userAgent;
    return {
      isChrome: /Chrome/.test(ua),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      isEdge: /Edge/.test(ua),
      isMobile: /Mobile|Android|iPhone|iPad/.test(ua)
    };
  },
  
  // Copy to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
};

// Event emitter class
export class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }
  
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
  
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
  
  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });
    return unsubscribe;
  }
}

// Example usage and demonstrations
export const examples = {
  // Array operations
  arrayExamples: () => {
    const numbers = [1, 2, 3, 4, 5, 2, 3];
    const users = [
      { name: 'Alice', age: 25, role: 'admin' },
      { name: 'Bob', age: 30, role: 'user' },
      { name: 'Charlie', age: 25, role: 'admin' }
    ];
    
    console.log('Unique numbers:', arrayUtils.removeDuplicates(numbers));
    console.log('Grouped users:', arrayUtils.groupBy(users, 'role'));
    console.log('Chunked numbers:', arrayUtils.chunk(numbers, 3));
    console.log('Sorted users by age:', arrayUtils.sortBy(users, 'age'));
  },
  
  // Async operations
  asyncExamples: async () => {
    // Simulate API call
    const mockApiCall = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.7 ? reject(new Error('API Error')) : resolve('Success');
        }, 1000);
      });
    };
    
    try {
      const result = await asyncUtils.retry(mockApiCall, 3);
      console.log('API Result:', result);
    } catch (error) {
      console.error('API failed after retries:', error);
    }
  },
  
  // String operations
  stringExamples: () => {
    const text = 'hello world example';
    console.log('Capitalized:', stringUtils.capitalize(text));
    console.log('CamelCase:', stringUtils.toCamelCase(text));
    console.log('KebabCase:', stringUtils.toKebabCase('HelloWorldExample'));
    console.log('Truncated:', stringUtils.truncate(text, 10));
  }
};

// Export all utilities as default
export default {
  arrayUtils,
  asyncUtils,
  stringUtils,
  objectUtils,
  mathUtils,
  domUtils,
  validationUtils,
  storageUtils,
  dateUtils,
  performanceUtils,
  apiUtils,
  formUtils,
  browserUtils,
  EventEmitter,
  examples
};