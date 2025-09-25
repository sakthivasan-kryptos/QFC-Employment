import React, { useState } from 'react';
import { Layout, Typography, Space, Avatar, Dropdown, Modal, Button, Form, Input } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  MenuOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = ({ collapsed, onSidebarToggle }) => {
  const { user, logout, showMessage } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'changePassword':
        setIsModalVisible(true);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword } = values;
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token'); 

      const response = await axios.put(`${API_BASE_URL}/change-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showMessage.success('Password changed successfully!');
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.detail) {
          const errorMsg = Array.isArray(data.detail)
            ? data.detail.map((err) => err.msg).join(', ')
            : data.detail;
          showMessage.error(`Failed to change password: ${errorMsg}`);
        } else {
          showMessage.error('Failed to change password');
        }
      } else {
        showMessage.error('An unexpected error occurred.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                Compliance Management System
              </Title>
            </div>
          </div>
        </div>

        <div className="header-right">
          <Space align="center">
            <div className="user-info">
              <Text style={{ color: 'white', marginRight: '8px', fontSize: '12px', fontWeight: 'bold', lineHeight: '1.2' }}>
                {user?.username || 'User'}
              </Text>
              <Text style={{ color: 'white', marginRight: '8px', fontSize: '12px', opacity: 0.8, lineHeight: '1.2' }}>
                {user?.email || 'user@example.com'}
              </Text>
            </div>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'header',
                    label: (
                      <div style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <Avatar
                            size={40}
                            style={{
                              backgroundColor: '#1890ff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '16px'
                            }}
                          >
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                          </Avatar>
                          <div style={{ marginLeft: '12px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user?.username || 'User'}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{user?.email || 'user@example.com'}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          <strong>Company:</strong> {user?.company_name || 'N/A'}
                        </div>
                        {/* <div style={{ fontSize: '12px', color: '#666' }}>
                          <strong>Role:</strong> {user?.role_type || 'user'}
                        </div> */}
                      </div>
                    ),
                    disabled: true,
                  },
                  { type: 'divider' },
                  { key: 'changePassword', label: 'Change Password', icon: <LockOutlined /> },
                  { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true }
                ],
                onClick: handleMenuClick
              }}
              placement="bottomRight"
              trigger={['click']}
              arrow={{ pointAtCenter: true }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              <Avatar
                size={40}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  backgroundColor: '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="User menu"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : <UserOutlined style={{ color: 'white' }} />}
              </Avatar>
            </Dropdown>
          </Space>
        </div>
      </AntHeader>

      <Modal
        title="Change Password"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, showMessage: 'Please enter current password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, showMessage: 'Please enter new password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, showMessage: 'Please confirm new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Header;
