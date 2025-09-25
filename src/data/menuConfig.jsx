import {
  DashboardOutlined,
  PlusOutlined,
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// Full menu list
export const allMenuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'new-review', icon: <PlusOutlined />, label: 'New Review' },
  { key: 'all-reviews', icon: <FileTextOutlined />, label: 'All Reviews' },
  { key: 'regulations', icon: <BookOutlined />, label: 'Regulations' },
  { key: 'reports', icon: <BarChartOutlined />, label: 'Reports' },
  { key: 'approvepending', icon: <FileTextOutlined />, label: 'Approve Pending' },
  { key: 'users', icon: <BookOutlined />, label: 'Users' },
  { key: 'user-registration', icon: <PlusOutlined />, label: 'User Registration' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
];

// Function to get menu items based on role
export const getMenuItemsForRole = (roleType) => {
  if (roleType === 'user') {
    return allMenuItems.filter(item =>
      ['dashboard', 'new-review', 'all-reviews', 'settings'].includes(item.key)
    );
  }

  // Add other role-specific filtering here if needed
  return allMenuItems;
};
