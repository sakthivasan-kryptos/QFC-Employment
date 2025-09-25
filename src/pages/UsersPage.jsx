import React, { useEffect, useState } from 'react';
import {
    Table,
    Tag,
    Space,
    Typography,
    Spin,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Tooltip,
    Input
} from 'antd';
import {
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const { Text, Title } = Typography;
const { Search } = Input;

const UsersPage = () => {
    const { token, showMessage } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        approved: 0,
        admins: 0
    });
    const [searchText, setSearchText] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const usersData = response.data;
            setUsers(usersData);
            setFilteredUsers(usersData);
            updateStats(usersData);
        } catch (error) {
            console.error(error);
            showMessage.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (usersData) => {
        const total = usersData.length;
        const active = usersData.filter(user => user.is_active).length;
        const approved = usersData.filter(user => user.is_approved).length;
        const admins = usersData.filter(user => user.role_type === 'admin').length;

        setStats({ total, active, approved, admins });
    };

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value.trim()) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.company_name?.toLowerCase().includes(value.toLowerCase()) ||
            user.role_type.toLowerCase().includes(value.toLowerCase()) ||
            (user.is_active ? 'active' : 'inactive').includes(value.toLowerCase()) ||
            (user.is_approved ? 'approved' : 'not approved').includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (username, record) => (
                <Space>
                    <UserOutlined />
                    <div>
                        <div><strong>{username}</strong></div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Company',
            dataIndex: 'company_name',
            key: 'company_name',
            render: company => company || <Text type="secondary">N/A</Text>,
        },
        {
            title: 'Role',
            dataIndex: 'role_type',
            key: 'role_type',
            render: role => (
                <Tag color={role === 'admin' ? 'volcano' : 'blue'}>{role.toUpperCase()}</Tag>
            ),
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'User', value: 'user' },
            ],
            onFilter: (value, record) => record.role_type === value,
        },
        {
            title: 'Approved',
            dataIndex: 'is_approved',
            key: 'is_approved',
            render: (approved) => (
                <Tooltip title={approved ? 'Approved' : 'Not Approved'}>
                    <Tag color={approved ? 'green' : 'red'} icon={approved ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                        {approved ? 'Approved' : 'Not Approved'}
                    </Tag>
                </Tooltip>
            ),
            filters: [
                { text: 'Approved', value: true },
                { text: 'Not Approved', value: false },
            ],
            onFilter: (value, record) => record.is_approved === value,
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active) => (
                <Tooltip title={active ? 'Active' : 'Inactive'}>
                    <Tag color={active ? 'green' : 'red'} icon={active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                        {active ? 'Active' : 'Inactive'}
                    </Tag>
                </Tooltip>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: date => (
                <Tooltip title={new Date(date).toLocaleString()}>
                    <Text>{new Date(date).toLocaleDateString()}</Text>
                </Tooltip>
            ),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: date => (
                <Tooltip title={new Date(date).toLocaleString()}>
                    <Text>{new Date(date).toLocaleDateString()}</Text>
                </Tooltip>
            ),
            sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
        },
    ];

    if (loading && users.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: 100 }}>
                <Spin size="large" />
                <Text style={{ display: 'block', marginTop: 16 }}>Loading users...</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header Section */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            User Management
                        </Title>
                        <Text type="secondary">Manage system users and their permissions</Text>
                    </Col>
                </Row>

                {/* Statistics Cards */}
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Users"
                                value={stats.total}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Active Users"
                                value={stats.active}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Approved Users"
                                value={stats.approved}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Administrators"
                                value={stats.admins}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Search and Filters */}
                <Card>
                    <Row gutter={16} align="middle">
                        <Col flex="auto">
                            <Search
                                placeholder="Search users by username, email, or company..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col>
                            <Text type="secondary">
                                Showing {filteredUsers.length} of {users.length} users
                            </Text>
                        </Col>
                    </Row>
                </Card>

                {/* Users Table */}
                <Card>
                    <Table
                        dataSource={filteredUsers}
                        columns={columns}
                        rowKey="id"
                        bordered
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]} to ${range[1]} of ${total} users`,
                            pageSizeOptions: ["10", "25", "50", "75", "100"],
                        }}
                        scroll={{ x: 1000 }}
                        loading={loading}
                    />
                </Card>
            </Space>
        </div>
    );
};

export default UsersPage;