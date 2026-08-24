import axios from 'axios';

// API base URL - change this to match your Django backend
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Note: In JavaScript, we don't need interface declarations
// The data structures are documented here for reference
// Backend models provide the structure for these objects

// API Services
export const apiService = {
  // Developers
  getDevelopers: () => api.get('/developers/'),
  getDeveloper: (id) => api.get(`/developers/${id}/`),
  createDeveloper: (data) => api.post('/developers/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateDeveloper: (id, data) => api.put(`/developers/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteDeveloper: (id) => api.delete(`/developers/${id}/`),

  // Projects
  getProjects: () => api.get('/projects/'),
  getProject: (id) => api.get(`/projects/${id}/`),
  createProject: (data) => api.post('/projects/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProject: (id, data) => api.put(`/projects/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProject: (id) => api.delete(`/projects/${id}/`),

  // Resources
  getResources: (category, page, pageSize) => {
    const params = {};
    if (category) {
      params.category = category;
    }
    // Only add pagination if page and pageSize are provided (for admin)
    if (page !== undefined && pageSize !== undefined) {
      params.ordering = '-created_at';  // Newest to oldest for admin
      params.page = page;
      params.page_size = pageSize;
    }
    return api.get('/resources/', { params });
  },
  getResource: (id) => api.get(`/resources/${id}/`),
  createResource: (data) => api.post('/resources/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateResource: (id, data) => api.put(`/resources/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteResource: (id) => api.delete(`/resources/${id}/`),

  // Jobs
  getJobs: () => api.get('/jobs/'),
  getJob: (id) => api.get(`/jobs/${id}/`),
  createJob: (data) => api.post('/jobs/', data),
  updateJob: (id, data) => api.put(`/jobs/${id}/`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}/`),

  // Job Applications
  getJobApplications: () => api.get('/job-applications/'),
  getJobApplication: (id) => api.get(`/job-applications/${id}/`),
  createJobApplication: (data) => api.post('/job-applications/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateJobApplication: (id, data) =>
    api.patch(`/job-applications/${id}/`, data),
  markApplicationViewed: (id) => api.post(`/job-applications/${id}/mark_viewed/`),

  // Demo Bookings
  getDemoBookings: () => api.get('/BookDemo/'),
  createDemoBooking: (data) => api.post('/BookDemo/', data),
  updateDemoBooking: (id, data) => api.put(`/BookDemo/${id}/`, data),
  deleteDemoBooking: (id) => api.delete(`/BookDemo/${id}/`),

  // Performance Reviews
  getPerformanceReviews: (projectId) => {
    const params = projectId ? { project: projectId } : {};
    return api.get('/performance-reviews/', { params });
  },
  createPerformanceReview: (data) => api.post('/performance-reviews/', data),
  updatePerformanceReview: (id, data) => api.put(`/performance-reviews/${id}/`, data),
  deletePerformanceReview: (id) => api.delete(`/performance-reviews/${id}/`),

  // Customer Authentication
  sendOTP: (email) => api.post('/send-otp/', { email }),
  verifyOTP: (email, otp) => api.post('/verify-otp/', { email, otp }),
  registerCustomer: (data) => api.post('/customer/register/', data),
  loginCustomer: (email, password) =>
    api.post('/customer/login/', { email, password }),
  resetCustomerPassword: (email, password) =>
    api.post('/reset-customer-password/', { email, password }),

  // Documentation
  getDocumentation: () => api.get('/documentation/'),
  createDocumentation: (data) => api.post('/documentation/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Site Settings
  getSiteSettings: () => api.get('/site-settings/'),
  updateSiteSettings: (data) => api.put('/site-settings/1/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Navbar Links
  getNavbarLinks: () => api.get('/navbar-links/'),
  createNavbarLink: (data) => api.post('/navbar-links/', data),
  updateNavbarLink: (id, data) => api.put(`/navbar-links/${id}/`, data),
  deleteNavbarLink: (id) => api.delete(`/navbar-links/${id}/`),

  // Hero Sections
  getHeroSections: () => api.get('/hero-sections/'),
  getHeroSection: (id) => api.get(`/hero-sections/${id}/`),
  createHeroSection: (data) => api.post('/hero-sections/', data),
  updateHeroSection: (id, data) => api.put(`/hero-sections/${id}/`, data),
  deleteHeroSection: (id) => api.delete(`/hero-sections/${id}/`),

  // Interview Process
  getInterviewProcess: (jobId) => {
    const params = jobId ? { job: jobId } : {};
    return api.get('/interview-process/', { params });
  },

  // Footer
  getFooter: () => api.get('/footer/'),
  createFooter: (data) => api.post('/footer/', data),
  updateFooter: (id, data) => api.put(`/footer/${id}/`, data),
  deleteFooter: (id) => api.delete(`/footer/${id}/`),

  // Generic methods for backward compatibility
  get: (url) => api.get(url),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),

  // Additional helper methods can be added here as needed
  getContact: () => axios.get("/contact/"),
  createContact: (data) => axios.post("/contact/", data),
  updateContact: (id, data) => axios.put(`/contact/${id}/`, data),
};

export default api;
