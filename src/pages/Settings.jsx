import { Card, Form, Input, Select, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';

const { Option } = Select;
const { Text } = Typography;

const Settings = () => {
  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <SettingOutlined />
          <span style={{ marginLeft: '4px' }}>Settings</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        title="Settings"
        subtitle="Configure system preferences and user settings"
      />

      <Card title="User Profile" style={{ marginBottom: '24px' }}>
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label="Full Name">
            <Input defaultValue="Sarah Johnson" />
          </Form.Item>
          <Form.Item label="Email Address">
            <Input defaultValue="sarah.johnson@qfc.gov" />
          </Form.Item>
          <Form.Item label="Department">
            <Select defaultValue="employment-standards" style={{ width: '100%' }}>
              <Option value="employment-standards">Employment Standards Office</Option>
              <Option value="legal">Legal Department</Option>
              <Option value="compliance">Compliance Team</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Notification Preferences">
        <Text style={{ color: '#8c8c8c' }}>Configure your notification settings here</Text>
      </Card>
    </div>
  );
};

export default Settings;