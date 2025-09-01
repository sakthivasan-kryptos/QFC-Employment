import {
  DashboardOutlined,
  PlusOutlined,
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'new-review',
    icon: <PlusOutlined />,
    label: 'New Review',
  },
  {
    key: 'all-reviews',
    icon: <FileTextOutlined />,
    label: 'All Reviews',
  },
  {
    key: 'regulations',
    icon: <BookOutlined />,
    label: 'Regulations',
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];