// Mock data and constants for the QFC Employment Standards Office application

export const statsData = [
  { 
    title: 'Reviews This Month', 
    value: 23, 
    color: '#1890ff',
    backgroundColor: '#f0f8ff'
  },
  { 
    title: 'Compliance Rate', 
    value: 89, 
    suffix: '%',
    color: '#52c41a',
    backgroundColor: '#f6ffed'
  },
  { 
    title: 'Violations Found', 
    value: 156,
    color: '#faad14',
    backgroundColor: '#fffbe6'
  },
  { 
    title: 'Avg Review Time', 
    value: '2.3 hrs',
    color: '#722ed1',
    backgroundColor: '#f9f0ff'
  }
];

export const recentReviews = [
  {
    id: 1,
    title: 'ABC Corporation Employment Contract',
    subtitle: 'Submitted 2 hours ago • 5 violations found',
    status: 'Completed',
    statusColor: '#52c41a'
  },
  {
    id: 2,
    title: 'XYZ Ltd HR Manual Review',
    subtitle: 'Submitted 1 day ago • Processing...',
    status: 'In Progress',
    statusColor: '#faad14'
  },
  {
    id: 3,
    title: 'DEF Industries Policy Update',
    subtitle: 'Submitted 3 days ago • Requires attention',
    status: 'Needs Review',
    statusColor: '#ff4d4f'
  }
];

export const allReviewsData = [
  {
    key: '1',
    company: 'ABC Corporation',
    email: 'abc@company.com',
    documentType: 'Employment Contract & HR Manual',
    submitted: '2 hours ago',
    status: 'Completed',
    violations: '5 Critical',
    violationsColor: '#ff4d4f'
  },
  {
    key: '2',
    company: 'XYZ Limited',
    email: 'hr@xyzltd.com',
    documentType: 'HR Policy Manual',
    submitted: '1 day ago',
    status: 'In Progress',
    violations: 'Processing...',
    violationsColor: '#faad14'
  },
  {
    key: '3',
    company: 'DEF Industries',
    email: 'legal@def.com',
    documentType: 'Employment Contract',
    submitted: '3 days ago',
    status: 'Needs Review',
    violations: '3 Issues',
    violationsColor: '#faad14'
  },
  {
    key: '4',
    company: 'GHI Enterprises',
    email: 'compliance@ghi.com',
    documentType: 'Complete Package',
    submitted: '1 week ago',
    status: 'Completed',
    violations: '0 Issues',
    violationsColor: '#52c41a'
  }
];