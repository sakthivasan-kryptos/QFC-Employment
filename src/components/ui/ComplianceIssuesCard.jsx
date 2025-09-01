import { Card, List, Typography, Tag, Divider, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const ComplianceIssuesCard = ({ issues = [] }) => {
  if (!issues || issues.length === 0) {
    return (
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExclamationCircleOutlined style={{ color: '#52c41a' }} />
          <span>Mandatory Compliance Issues</span>
        </div>
      }>
        <Alert 
          message="No mandatory compliance issues found" 
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
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>Mandatory Compliance Issues</span>
          <Tag color="red" style={{ marginLeft: 'auto' }}>
            {issues.length} Issue{issues.length !== 1 ? 's' : ''}
          </Tag>
        </div>
      }
      className="compliance-issues-card"
    >
      <List
        itemLayout="vertical"
        dataSource={issues}
        renderItem={(issue, index) => (
          <List.Item key={index}>
            <div className="compliance-issue-item">
              <div className="issue-header">
                <Title level={5} style={{ color: '#ff4d4f', margin: 0 }}>
                  {issue.violation}
                </Title>
                <Tag color="orange" style={{ fontSize: '11px' }}>
                  {issue.qfc_article}
                </Tag>
              </div>
              
              <div className="issue-details" style={{ marginTop: '12px' }}>
                <div className="detail-section">
                  <Text strong style={{ color: '#595959' }}>Document States:</Text>
                  <Paragraph style={{ margin: '4px 0 12px 0', color: '#8c8c8c' }}>
                    "{issue.document_states}"
                  </Paragraph>
                </div>
                
                <div className="detail-section">
                  <Text strong style={{ color: '#595959' }}>QFC Requires:</Text>
                  <Paragraph style={{ margin: '4px 0 12px 0', color: '#8c8c8c' }}>
                    {issue.qfc_requires}
                  </Paragraph>
                </div>
                
                <div className="detail-section">
                  <Text strong style={{ color: '#1890ff' }}>Required Fix:</Text>
                  <Paragraph style={{ margin: '4px 0 0 0', color: '#262626' }}>
                    {issue.fix_required}
                  </Paragraph>
                </div>
              </div>
              
              {index < issues.length - 1 && <Divider style={{ margin: '20px 0' }} />}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ComplianceIssuesCard;