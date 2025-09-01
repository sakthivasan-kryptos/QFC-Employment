import { Tag, Space, Button } from 'antd';

export const allReviewsColumns = [
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
    render: (text, record) => (
      <div>
        <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email}</div>
      </div>
    ),
  },
  {
    title: 'Document Type',
    dataIndex: 'documentType',
    key: 'documentType',
  },
  {
    title: 'Submitted',
    dataIndex: 'submitted',
    key: 'submitted',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = '#52c41a';
      if (status === 'In Progress') color = '#faad14';
      if (status === 'Needs Review') color = '#ff4d4f';
      
      return (
        <Tag color={color} style={{ borderRadius: '12px', fontWeight: 500 }}>
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Violations',
    dataIndex: 'violations',
    key: 'violations',
    render: (text, record) => (
      <span style={{ color: record.violationsColor, fontWeight: 500 }}>
        {text}
      </span>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        {record.status === 'Completed' ? (
          <Button type="primary" size="small">View Report</Button>
        ) : record.status === 'Needs Review' ? (
          <Button type="primary" size="small">Review</Button>
        ) : (
          <Button size="small">View Status</Button>
        )}
      </Space>
    ),
  },
];