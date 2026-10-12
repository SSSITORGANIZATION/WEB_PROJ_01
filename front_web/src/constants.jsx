// Constants file - mock data removed, now using real API
// Export empty arrays for backward compatibility
// Components should now use apiService to fetch real data

export const PROJECTS = [];
export const DEVELOPERS = [];
export const RESOURCES = [];
export const APPLICATIONS = [];

// Category options for filters
export const PROJECT_CATEGORIES = [
  'FINTECH',
  'EDTECH',
  'HEALTHCARE',
  'ECOMMERCE',
  'SOCIAL',
  'PRODUCTIVITY',
  'OTHER'
];

export const RESOURCE_CATEGORIES = [
  { value: 'BLOG', label: 'Blog' },
  { value: 'GUIDE', label: 'Guide' },
  { value: 'GLOSSARY', label: 'Glossary Item' }
];

export const JOB_STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' }
];

export const PROJECT_TYPES = [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'design', label: 'UI/UX Design' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' }
];

export const DEVELOPER_ROLES = [
  { value: 'FE', label: 'Frontend' },
  { value: 'BE', label: 'Backend' },
  { value: 'FS', label: 'Fullstack' },
  { value: 'UI', label: 'UI/UX' },
  { value: 'QA', label: 'QA' },
  { value: 'PM', label: 'Project Manager' }
];

export const MEMBER_TYPES = [
  { value: 'LEAD', label: 'Team Lead' },
  { value: 'MEMBER', label: 'Team Member' }
];
