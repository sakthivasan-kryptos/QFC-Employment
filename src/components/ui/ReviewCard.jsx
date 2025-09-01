import { Card, Typography, Tag } from 'antd';

const { Title, Text } = Typography;

const ReviewCard = ({ review }) => {
  return (
    <Card className="review-card">
      <div className="review-content">
        <div className="review-info">
          <Title level={4} style={{ margin: 0, color: '#262626', fontSize: '18px', fontWeight: '600' }}>
            {review.title}
          </Title>
          <Text style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '4px', display: 'block' }}>
            {review.subtitle}
          </Text>
        </div>
        <div className="review-status">
          <Tag 
            color={review.statusColor}
            style={{ 
              fontSize: '12px', 
              padding: '4px 12px',
              borderRadius: '16px',
              border: 'none',
              fontWeight: '500'
            }}
          >
            {review.status}
          </Tag>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;