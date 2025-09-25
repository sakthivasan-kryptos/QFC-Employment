import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Tag,
    Card,
    Space,
    Typography,
    Modal,
    message,
    Tooltip,
    Badge,
    Input,
    Row,
    Col
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    ReloadOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    MailOutlined,
    CrownOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Search } = Input;

// Building icon component since it might not be available
const BuildingOutlined = () => (
    <svg width="1em" height="1em" viewBox="0 0 1024 1024" style={{ color: '#1890ff' }}>
        <path fill="currentColor" d="M192 128v704h384V128H192zm-32-64h448a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32z" />
        <path fill="currentColor" d="M224 256h64v64h-64zm0 192h64v64h-64zm0 192h64v64h-64zm384-384h64v64h-64zm0 192h64v64h-64zm0 192h64v64h-64zM352 256h64v64h-64zm0 192h64v64h-64zm0 192h64v64h-64zm192-384h64v64h-64zm0 192h64v64h-64zm0 192h64v64h-64z" />
        <path fill="currentColor" d="M832 64H512a32 32 0 0 0-32 32v832h384V96a32 32 0 0 0-32-32zm-64 768H576V128h192z" />
    </svg>
);

const ApprovePending = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [actionStatus, setActionStatus] = useState({});
    const [searchText, setSearchText] = useState('');
    const { showMessage } = useAuth();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('auth_token');

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` },
    });

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/pending-users');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (err) {
            console.error(err);
            showMessage.error('Failed to load pending users');
        }
        setLoading(false);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user =>
            user.username?.toLowerCase().includes(value.toLowerCase()) ||
            user.email?.toLowerCase().includes(value.toLowerCase()) ||
            user.company_name?.toLowerCase().includes(value.toLowerCase()) ||
            user.role_type?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleAction = async (id, approve) => {
        setActionStatus(prev => ({ ...prev, [id]: 'loading' }));
        try {
            if (approve) {
                await axiosInstance.post('/admin/approve-user', { user_id: id }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                showMessage.success('User approved successfully');
            } else {
                await axiosInstance.post('/admin/reject-user', { user_id: id }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                showMessage.success('User rejected successfully');
            }

            fetchPendingUsers(); 
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || 'Action failed';
            showMessage.error(errorMsg);
        } finally {
            setActionStatus(prev => ({ ...prev, [id]: 'done' }));
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'red',
            manager: 'blue',
            user: 'green',
            viewer: 'orange'
        };
        return colors[role?.toLowerCase()] || 'default';
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const columns = [
        {
            title: 'User Info',
            dataIndex: 'username',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            render: (username) => <Text strong>{username}</Text>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            responsive: ['sm', 'md', 'lg', 'xl'],
            render: (email) => <span>{email}</span>,
        },
        {
            title: 'Company',
            dataIndex: 'company_name',
            responsive: ['md', 'lg', 'xl'],
            render: (company) => <span>{company || 'N/A'}</span>,
        },
        {
            title: 'Role',
            dataIndex: 'role_type',
            responsive: ['sm', 'md', 'lg', 'xl'],
            render: (role) => <Tag color={getRoleColor(role)}>{role?.toUpperCase()}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'is_approved',
            responsive: ['sm', 'md', 'lg', 'xl'],
            render: (is_approved) => <Tag color={is_approved ? 'green' : 'orange'}>{is_approved ? 'Approved' : 'Pending'}</Tag>,
        },
        {
            title: 'Registration Date',
            dataIndex: 'created_at',
            responsive: ['md', 'lg', 'xl'],
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            render: (_, record) => {
                const status = actionStatus[record.id];
                const isDisabled = status === 'loading';

                return (
                    <Space>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            loading={status === 'loading'}
                            disabled={isDisabled}
                            onClick={() => handleAction(record.id, true)}
                            style={{ background: '#52c41a', borderColor: '#52c41a' }}
                        >
                            Approve
                        </Button>
                        <Button
                            danger
                            icon={<CloseOutlined />}
                            loading={status === 'loading'}
                            disabled={isDisabled}
                            onClick={() => handleAction(record.id, false)}
                        >
                            Reject
                        </Button>
                    </Space>
                );
            },
        }
    ];

    const pendingCount = users.filter(user => !user.is_approved).length;

    return (
        <div style={{ padding: '24px' }}>
            <Card
                bordered={false}
                style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                }}
            >
                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                    <Col>
                        <Space direction="vertical" size={0}>
                            <Title level={2} style={{ margin: 0 }}>
                                User Approvals
                            </Title>
                            <Text type="secondary">
                                Manage pending user registrations
                            </Text>
                        </Space>
                    </Col>
                </Row>

                {/* Search and Stats */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <Search
                            placeholder="Search users by name, email, company, or role..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Space style={{ float: 'right' }}>
                            <Tag color="blue">Total: {users.length}</Tag>
                            <Tag color="orange">Pending: {pendingCount}</Tag>
                            <Tag color="green">Approved: {users.length - pendingCount}</Tag>
                        </Space>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    rowKey="id"
                    dataSource={filteredUsers}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} users`,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "25", "50", "75", "100"],
                    }}
                    scroll={{ x: 'max-content' }}
                    style={{ borderRadius: '8px', overflow: 'hidden' }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <Text type="secondary">
                                    {searchText ? 'No users found matching your search' : 'No pending users found'}
                                </Text>
                            </div>
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default ApprovePending;