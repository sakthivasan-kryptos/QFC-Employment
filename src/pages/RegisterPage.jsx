import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Typography, Row, Col } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user, showMessage } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleRegister = async (values) => {
    setIsSubmitting(true);

    try {
      const payload = {
        company_name: values.companyName,
        username: values.name,
        email: values.email,
        password: values.password,
        role_type: user?.role_Type === 'admin' ? values.roleType : 'user',
      };

      const response = await axios.post(`${API_BASE_URL}/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;
      showMessage.success(data.message + ' Redirecting to login...');

      setTimeout(() => {
        navigate('/login', { state: { message: data.message } });
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);

      let errorMsg = 'Registration failed';
      if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
        errorMsg = err.response.data.detail
          .map((d) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
          .join(', ');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      showMessage.error(errorMsg);
    }

    setIsSubmitting(false);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
        padding: '0px',
        margin: '0px',
        overflow: 'hidden'
      }}
    >
      <Col xs={22} sm={18} md={14} lg={10} xl={8}>
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            margin: '0px 16px',
            maxHeight: '95vh',
            overflow: 'hidden'
          }}
          bodyStyle={{
            padding: '24px',
            overflow: 'hidden'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Title level={2} style={{ marginBottom: 8 }}>Create Account</Title>
            <Text type="secondary">Fill in your details to register</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={handleRegister}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: 'Please enter your name' },
                {
                  pattern: /^[A-Za-z0-9_-]+$/,
                  message: 'Username can only contain letters, and underscores',
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                {
                  pattern: /[A-Z]/,
                  message: 'Password must contain at least one uppercase letter',
                },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            {user?.role_Type === 'admin' && (
              <Form.Item
                name="roleType"
                label="Role Type"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Select role">
                  <Option value="admin">Admin</Option>
                  <Option value="user">User</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                Register
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary">Already have an account? </Text>
            <Link to="/login">Login</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;