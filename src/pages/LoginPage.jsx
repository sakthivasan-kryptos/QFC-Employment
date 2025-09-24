import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card, Form, Input, Button, Checkbox, Typography, Divider,
  Space, Alert, Spin, Row, Col, Tag
} from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [form] = Form.useForm();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated() && !authLoading) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (values) => {
    setSubmitError('');
    setIsSubmitting(true);

    const result = await login(values.email, values.password, values.rememberMe);

    if (result.success) {
      // Redirect to previous page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setSubmitError(result.error || 'Login failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',pasdding: '0px' }}>
      <Col xs={22} sm={18} md={14} lg={10} xl={8}>
        <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Sign in to your account to continue</Text>
          </div>

          {submitError && <Alert message={submitError} type="error" closable onClose={() => setSubmitError('')} style={{ marginBottom: 24 }} />}

          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ email: '', password: '', rememberMe: false }}>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
              <Input placeholder="Enter your email" disabled={isSubmitting} />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password placeholder="Enter your password" disabled={isSubmitting} />
            </Form.Item>
            <Form.Item name="rememberMe" valuePropName="checked">
              <Checkbox disabled={isSubmitting}>Remember me</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isSubmitting} size="large">Sign In</Button>
            </Form.Item>
          </Form>

          {/* <Divider />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', textAlign: 'center' }}>For development purposes only. Implement proper authentication in production.</Text> */}
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
