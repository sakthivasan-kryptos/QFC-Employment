import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  Space,
  Alert,
  Spin,
  Row,
  Col,
  Tag
} from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import './LoginPage.css';

const { Title, Text, Paragraph } = Typography;

const LoginPage = () => {
  console.log('LoginPage rendering...'); // Debugging line

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [form] = Form.useForm();

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // Debug authentication status
  useEffect(() => {
    console.log('Auth status:', { isAuthenticated: isAuthenticated(), authLoading });
  }, [isAuthenticated, authLoading]);

  // Redirect if already authenticated
  if (isAuthenticated() && !authLoading) {
    console.log('Redirecting to dashboard...');
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (values) => {
    console.log('Form values:', values); // Debug form values
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const result = await login(values.email, values.password, values.rememberMe);

      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setSubmitError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (email, password) => {
    form.setFieldsValue({
      email,
      password,
      rememberMe: form.getFieldValue('rememberMe')
    });
    setSubmitError('');
  };

  const demoCredentials = [
    { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
  ];

  if (authLoading) {
    return (
      <div className="login-loading">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />}
        />
        <Text style={{ marginTop: 16, color: 'white' }}>Loading...</Text>
      </div>
    );
  }

  console.log('Rendering login form...'); // Debugging line

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Col xs={22} sm={18} md={14} lg={10} xl={8}>
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Sign in to your account to continue</Text>
          </div>

          {submitError && (
            <Alert
              message={submitError}
              type="error"
              closable
              onClose={() => setSubmitError('')}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              email: '',
              password: '',
              rememberMe: false
            }}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
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
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {showDemoCredentials && (
            <Card
              type="inner"
              title={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text>Demo Credentials</Text>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setShowDemoCredentials(false)}
                  />
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                Click any credential below to auto-fill the form:
              </Paragraph>

              <Space direction="vertical" style={{ width: '100%' }}>
                {demoCredentials.map((cred, index) => (
                  <Button
                    key={index}
                    type="default"
                    block
                    onClick={() => fillDemoCredentials(cred.email, cred.password)}
                    disabled={isSubmitting}
                    style={{ textAlign: 'left', height: 'auto', padding: '8px 16px' }}
                  >
                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                      <Text strong>{cred.email}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <Tag color="default">{cred.role}</Tag>
                      </Text>
                    </Space>
                  </Button>
                ))}
              </Space>
            </Card>
          )}

          <Divider />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', textAlign: 'center' }}>
            For development purposes only. In production, implement proper authentication.
          </Text>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;