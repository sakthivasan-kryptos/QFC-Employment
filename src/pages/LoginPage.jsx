import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Row, Col } from 'antd';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading, showMessage } = useAuth();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated() && !authLoading) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    const hideLoading = showMessage.loading('Signing in...', 0);

    const result = await login(values.email, values.password, values.rememberMe);

    hideLoading(); 

    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }

    setIsSubmitting(false);
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)' }}>
      <Col xs={22} sm={18} md={14} lg={10} xl={8}>
        <Card bordered={false} style={{ borderRadius: 16, padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Sign in to your account to continue</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ rememberMe: false }}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Enter your email" disabled={isSubmitting} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Enter your password" disabled={isSubmitting} />
            </Form.Item>

            <Form.Item name="rememberMe" valuePropName="checked">
              <Checkbox disabled={isSubmitting}>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary">Don’t have an account? </Text>
            <Link to="/register">Register</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
