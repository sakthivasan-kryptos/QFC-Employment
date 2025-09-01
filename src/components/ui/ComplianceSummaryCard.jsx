import { Card, Typography, Tag, List, Alert, Progress } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

const ComplianceSummaryCard = ({ summary }) => {
  if (!summary) {
    return (
      <Card title="Compliance Summary">
        <Alert 
          message="No compliance summary available" 
          type="info" 
          showIcon 
        />
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant':
        return '#52c41a';
      case 'non-compliant':
        return '#ff4d4f';
      case 'partially compliant':
        return '#faad14';
      default:
        return '#8c8c8c';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'non-compliant':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'partially compliant':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getCompliancePercentage = (status, criticalIssues) => {
    if (status?.toLowerCase() === 'compliant') return 100;
    if (status?.toLowerCase() === 'non-compliant') {
      // Calculate based on critical issues - more issues = lower percentage
      const maxIssues = 10; // Assume max 10 critical issues for calculation
      const percentage = Math.max(0, Math.min(100, ((maxIssues - (criticalIssues || 0)) / maxIssues) * 100));
      return Math.round(percentage);
    }
    if (status?.toLowerCase() === 'partially compliant') return 60;
    return 0;
  };

  const compliancePercentage = getCompliancePercentage(summary.status, summary.critical_issues);

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getStatusIcon(summary.status)}
          <span>Compliance Summary</span>
        </div>
      }
      className="compliance-summary-card"
    >
      <div className="summary-content">
        {/* Status and Progress */}
        <div className="status-section" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <Tag 
              color={getStatusColor(summary.status)} 
              style={{ 
                fontSize: '14px', 
                padding: '6px 16px',
                borderRadius: '20px',
                fontWeight: '600'
              }}
            >
              {summary.status}
            </Tag>
          </div>
          
          <Progress 
            percent={compliancePercentage}
            strokeColor={getStatusColor(summary.status)}
            size="small"
            style={{ marginBottom: '8px' }}
          />
          <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
            Overall Compliance Score
          </Text>
        </div>

        {/* Critical Issues Count */}
        {summary.critical_issues !== undefined && (
          <div className="critical-issues-section" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div className="critical-count">
              <Text style={{ fontSize: '32px', fontWeight: '700', color: '#ff4d4f' }}>
                {summary.critical_issues}
              </Text>
            </div>
            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
              Critical Issues Found
            </Text>
          </div>
        )}

        {/* Must Fix Items */}
        {summary.must_fix_items && summary.must_fix_items.length > 0 && (
          <div className="must-fix-section">
            <Title level={5} style={{ color: '#ff4d4f', marginBottom: '12px' }}>
              Must Fix Items ({summary.must_fix_items.length})
            </Title>
            <List
              size="small"
              dataSource={summary.must_fix_items}
              renderItem={(item, index) => (
                <List.Item key={index} style={{ padding: '8px 0', borderBottom: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
                    <div 
                      style={{ 
                        minWidth: '20px', 
                        height: '20px', 
                        backgroundColor: '#ff4d4f', 
                        color: 'white', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '11px', 
                        fontWeight: '600',
                        marginTop: '2px'
                      }}
                    >
                      {index + 1}
                    </div>
                    <Text style={{ color: '#262626', lineHeight: '1.4' }}>
                      {item}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ComplianceSummaryCard;