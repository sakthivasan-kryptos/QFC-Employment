import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const UserRegistration = () => {
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
                role_type: user?.role_type === 'admin' ? values.roleType : 'user',
            };

            const response = await axios.post(`${API_BASE_URL}/register`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            showMessage.success(data.message + ' Redirecting to login...');

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
        <Row justify="center" style={{ marginTop: 50 }}>
            <Col xs={24} sm={24} md={24} lg={24}>
                <Card>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                        User Registration
                    </Title>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleRegister}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Company Name"
                                    name="companyName"
                                    rules={[{ required: true, message: 'Please enter company name' }]}
                                >
                                    <Input placeholder="Enter company name" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please enter your name' }]}
                                >
                                    <Input placeholder="Enter your name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' },
                                    ]}
                                >
                                    <Input placeholder="Enter your email" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Role Type"
                                    name="roleType"
                                    rules={[{ required: true, message: 'Please select a role type' }]}
                                >
                                    {user?.role_type === 'admin' ? (
                                        <Select placeholder="Select role type">
                                            <Option value="admin">Admin</Option>
                                            <Option value="user">User</Option>
                                        </Select>
                                    ) : (
                                        <Input disabled value="user" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please enter a password' }]}
                                >
                                    <Input.Password placeholder="Enter password" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Passwords do not match!');
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm password" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                                        Register
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        block
                                        onClick={() => {
                                            form.resetFields(); 
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>

                </Card>
            </Col>
        </Row>
    );
};

export default UserRegistration;
