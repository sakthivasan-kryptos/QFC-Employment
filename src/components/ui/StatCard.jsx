import { Card, Statistic } from 'antd';

const StatCard = ({ title, value, suffix, backgroundColor }) => {
  return (
    <Card className="stat-card" style={{ backgroundColor }}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        valueStyle={{ 
          color: '#262626', 
          fontSize: '36px', 
          fontWeight: '700',
          lineHeight: '1.2'
        }}
        className="qfc-statistic"
      />
    </Card>
  );
};

export default StatCard;