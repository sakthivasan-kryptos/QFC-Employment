import { Typography } from 'antd';

const { Title, Text } = Typography;

const PageHeader = ({ title, subtitle, centered = false }) => {
  return (
    <div className="content-header" style={{ textAlign: centered ? 'center' : 'left', marginBottom: centered ? '60px' : '40px' }}>
      <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '32px', fontWeight: '600' }}>
        {title}
      </Title>
      <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
        {subtitle}
      </Text>
    </div>
  );
};

export default PageHeader;