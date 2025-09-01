import { Card, List, Typography, Tag, Divider, Alert } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const BestPracticesCard = ({ recommendations = [] }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BulbOutlined style={{ color: '#faad14' }} />
          <span>Best Practice Recommendations</span>
        </div>
      }>
        <Alert 
          message="No best practice recommendations available" 
          type="info" 
          showIcon 
        />
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BulbOutlined style={{ color: '#faad14' }} />
          <span>Best Practice Recommendations</span>
          <Tag color="gold" style={{ marginLeft: 'auto' }}>
            {recommendations.length} Recommendation{recommendations.length !== 1 ? 's' : ''}
          </Tag>
        </div>
      }
      className="best-practices-card"
    >
      <List
        itemLayout="vertical"
        dataSource={recommendations}
        renderItem={(recommendation, index) => (
          <List.Item key={index}>
            <div className="best-practice-item">
              <div className="recommendation-header">
                <Title level={5} style={{ color: '#faad14', margin: 0 }}>
                  {recommendation.area}
                </Title>
              </div>
              
              <div className="recommendation-details" style={{ marginTop: '12px' }}>
                <div className="detail-section">
                  <Text strong style={{ color: '#595959' }}>Current Situation:</Text>
                  <Paragraph style={{ margin: '4px 0 12px 0', color: '#8c8c8c' }}>
                    {recommendation.current}
                  </Paragraph>
                </div>
                
                <div className="detail-section">
                  <Text strong style={{ color: '#1890ff' }}>Recommendation:</Text>
                  <Paragraph style={{ margin: '4px 0 12px 0', color: '#262626' }}>
                    {recommendation.recommendation}
                  </Paragraph>
                </div>
                
                <div className="detail-section">
                  <Text strong style={{ color: '#52c41a' }}>Benefit:</Text>
                  <Paragraph style={{ margin: '4px 0 0 0', color: '#595959' }}>
                    {recommendation.benefit}
                  </Paragraph>
                </div>
              </div>
              
              {index < recommendations.length - 1 && <Divider style={{ margin: '20px 0' }} />}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default BestPracticesCard;