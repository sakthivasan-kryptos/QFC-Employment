import { Layout, Typography, Space, Avatar, Dropdown, Modal, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  MenuOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = ({ collapsed, onSidebarToggle }) => {
  const { user, logout } = useAuth();
  console.log("Header - user:", user);
  const handleLogout = () => {
    logout();
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('Profile clicked');
        break;
      case 'settings':
        console.log('Settings clicked');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  return (
    <AntHeader className="qfc-header">
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
          onClick={onSidebarToggle}
          style={{ marginRight: 16, fontSize: '18px', color: 'white' }}
          aria-label="Toggle sidebar"
        />
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="header-text">
            <Title level={3} style={{ margin: 0, color: 'white', fontSize: '24px' }}>
              QFC Employment Standards Office
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              Compliance Management System
            </Text>
          </div>
        </div>
      </div>

      <div className="header-right">
        <Space align="center">
          <div className="user-info">
            <Text style={{ color: 'white', marginRight: '8px', fontSize: '12px', fontWeight: 'bold' }}>
              {user?.name || user?.email || 'User'}
            </Text>
            <Text style={{ color: 'white', marginRight: '8px', fontSize: '12px', opacity: 0.8 }}>
              {user?.email || 'User@gmail.com'}
            </Text>
            {user?.role && (
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginRight: '8px' }}>
                ({user.role})
              </Text>
            )}
          </div>
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={['click']}
            arrow
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          >
            <Avatar
              size={40}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', border: '2px solid transparent' }}
              src={user?.avatar ? `http://127.0.0.1:8090/api/files/_pb_users_auth_/${user.id}/${user.avatar}` : undefined}
              icon={!user?.avatar && <UserOutlined />}
              alt={user?.name || user?.email}
              onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'transparent'; }}
              aria-label="User menu"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.target.click();
                }
              }}
            />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
