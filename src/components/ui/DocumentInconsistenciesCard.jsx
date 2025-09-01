import { Card, List, Typography, Tag, Divider, Alert } from 'antd';
import { FileExclamationOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const DocumentInconsistenciesCard = ({ inconsistencies = [] }) => {
  if (!inconsistencies || inconsistencies.length === 0) {
    return (
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileExclamationOutlined style={{ color: '#52c41a' }} />
          <span>Document Inconsistencies</span>
        </div>
      }>
        <Alert 
          message="No document inconsistencies found" 
          type="success" 
          showIcon 
        />
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileExclamationOutlined style={{ color: '#fa8c16' }} />
          <span>Document Inconsistencies</span>
          <Tag color="orange" style={{ marginLeft: 'auto' }}>
            {inconsistencies.length} Issue{inconsistencies.length !== 1 ? 's' : ''}
          </Tag>
        </div>
      }
      className="document-inconsistencies-card"
    >
      <List
        itemLayout="vertical"
        dataSource={inconsistencies}
        renderItem={(inconsistency, index) => (
          <List.Item key={index}>
            <div className="inconsistency-item">
              <div className="inconsistency-header">
                <Title level={5} style={{ color: '#fa8c16', margin: 0 }}>
                  {inconsistency.issue}
                </Title>
              </div>
              
              <div className="inconsistency-details" style={{ marginTop: '12px' }}>
                <div className="detail-section">
                  <Text strong style={{ color: '#ff4d4f' }}>Problem:</Text>
                  <Paragraph style={{ margin: '4px 0 12px 0', color: '#8c8c8c' }}>
                    {inconsistency.problem}
                  </Paragraph>
                </div>
                
                <div className="detail-section">
                  <Text strong style={{ color: '#1890ff' }}>Solution:</Text>
                  <Paragraph style={{ margin: '4px 0 0 0', color: '#262626' }}>
                    {inconsistency.solution}
                  </Paragraph>
                </div>
              </div>
              
              {index < inconsistencies.length - 1 && <Divider style={{ margin: '20px 0' }} />}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DocumentInconsistenciesCard;