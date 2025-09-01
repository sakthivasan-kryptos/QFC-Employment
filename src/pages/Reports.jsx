import { Card, Row, Col, Space, Button, Progress, Typography, Divider, List, Statistic, Breadcrumb, Tag, Alert, Badge, Tooltip } from 'antd';
import {
  FileTextOutlined,
  RiseOutlined,
  WarningOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import { ComplianceSummaryCard } from '../components/ui';
import { useEffect, useState } from 'react';
import { getLatestComprehensiveResponse, getStoredResponses, getComplianceSummaryForDashboard } from '../services/localStorageService';

const { Text, Title, Paragraph } = Typography;

const Reports = () => {
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [aggregatedMetrics, setAggregatedMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load comprehensive reports data
  useEffect(() => {
    const loadReportsData = () => {
      try {
        const latestResponse = getLatestComprehensiveResponse();
        const allResponses = getStoredResponses();
        const dashboardSummary = getComplianceSummaryForDashboard();
        
        if (latestResponse?.data) {
          setComprehensiveData(latestResponse.data);
        }
        
        // Calculate aggregated metrics from all responses
        const comprehensiveResponses = allResponses.filter(response => 
          response.metadata?.source === 'comprehensive_new_review'
        );
        
        if (comprehensiveResponses.length > 0) {
          const aggregated = calculateAggregatedMetrics(comprehensiveResponses);
          setAggregatedMetrics(aggregated);
        }
        
      } catch (error) {
        console.error('Error loading reports data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportsData();
  }, []);

  // Calculate aggregated metrics from multiple comprehensive responses
  const calculateAggregatedMetrics = (responses) => {
    const totalReviews = responses.length;
    let totalCriticalGaps = 0;
    let totalRecommendations = 0;
    let totalInconsistencies = 0;
    let totalCompliantAreas = 0;
    let complianceStatuses = [];
    let riskLevels = [];
    let gapTypes = {};

    responses.forEach(response => {
      const data = response.data;
      totalCriticalGaps += data.critical_gaps?.count || 0;
      totalRecommendations += data.recommendations?.count || 0;
      totalInconsistencies += data.inconsistencies?.count || 0;
      totalCompliantAreas += data.compliant_items?.count || 0;
      
      if (data.final_assessment?.overall_compliance_status) {
        complianceStatuses.push(data.final_assessment.overall_compliance_status);
      }
      
      if (data.final_assessment?.risk_level) {
        riskLevels.push(data.final_assessment.risk_level);
      }

      // Count gap types
      data.critical_gaps?.items?.forEach(gap => {
        const type = gap.gap_type || 'Unknown';
        gapTypes[type] = (gapTypes[type] || 0) + 1;
      });
    });

    const compliantCount = complianceStatuses.filter(status => status === 'Compliant').length;
    const complianceRate = totalReviews > 0 ? Math.round((compliantCount / totalReviews) * 100) : 0;

    const topGapTypes = Object.entries(gapTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    return {
      totalReviews,
      complianceRate,
      totalCriticalGaps,
      totalRecommendations,
      totalInconsistencies,
      totalCompliantAreas,
      avgCriticalGapsPerReview: totalReviews > 0 ? (totalCriticalGaps / totalReviews).toFixed(1) : 0,
      topGapTypes,
      complianceDistribution: {
        compliant: complianceStatuses.filter(s => s === 'Compliant').length,
        nonCompliant: complianceStatuses.filter(s => s === 'Non-Compliant').length,
        partiallyCompliant: complianceStatuses.filter(s => s === 'Partially Compliant').length
      },
      riskDistribution: {
        high: riskLevels.filter(r => r === 'High').length,
        medium: riskLevels.filter(r => r === 'Medium').length,
        low: riskLevels.filter(r => r === 'Low').length
      }
    };
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant': return 'success';
      case 'non-compliant': return 'error';
      case 'partially compliant': return 'warning';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BarChartOutlined />
          <span style={{ marginLeft: '4px' }}>Reports</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        title="Compliance Reports & Analytics"
        subtitle="Comprehensive analysis summaries and organizational compliance insights"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
            >
              Export Report
            </Button>
          </Space>
        }
      />

      {/* Latest Comprehensive Analysis */}
      {comprehensiveData && (
        <Card 
          title="Latest Compliance Analysis" 
          style={{ marginBottom: '24px' }}
          extra={
            comprehensiveData.analysis_summary?.analysis_date && (
              <Tag color="blue">
                Analysis Date: {comprehensiveData.analysis_summary.analysis_date}
              </Tag>
            )
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card size="small" title="Final Assessment">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Compliance Status: </Text>
                    <Tag color={getStatusColor(comprehensiveData.final_assessment?.overall_compliance_status)}>
                      {comprehensiveData.final_assessment?.overall_compliance_status || 'Unknown'}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Risk Level: </Text>
                    <Tag color={getRiskColor(comprehensiveData.final_assessment?.risk_level)}>
                      {comprehensiveData.final_assessment?.risk_level || 'Unknown'}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Confidence Score: </Text>
                    <Text>{comprehensiveData.final_assessment?.confidence_score || 'N/A'}</Text>
                  </div>
                  {comprehensiveData.final_assessment?.next_review_date && (
                    <div>
                      <Text strong>Next Review: </Text>
                      <Text>{comprehensiveData.final_assessment.next_review_date}</Text>
                    </div>
                  )}
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card size="small" title="Issues Summary">
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Statistic
                      title="Critical Gaps"
                      value={comprehensiveData.critical_gaps?.count || 0}
                      valueStyle={{ color: '#ff4d4f' }}
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Recommendations"
                      value={comprehensiveData.recommendations?.count || 0}
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<BulbOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Inconsistencies"
                      value={comprehensiveData.inconsistencies?.count || 0}
                      valueStyle={{ color: '#faad14' }}
                      prefix={<WarningOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Compliant Areas"
                      value={comprehensiveData.compliant_items?.count || 0}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card size="small" title="Action Plan Summary">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Immediate Actions:</Text>
                    <Badge 
                      count={comprehensiveData.action_plan?.immediate_actions?.length || 0} 
                      style={{ backgroundColor: '#ff4d4f' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Short-term:</Text>
                    <Badge 
                      count={comprehensiveData.action_plan?.short_term_improvements?.length || 0} 
                      style={{ backgroundColor: '#faad14' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Long-term:</Text>
                    <Badge 
                      count={comprehensiveData.action_plan?.long_term_enhancements?.length || 0} 
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {comprehensiveData.final_assessment?.executive_summary && (
            <>
              <Divider />
              <div>
                <Title level={5}>Executive Summary</Title>
                <Paragraph>
                  {comprehensiveData.final_assessment.executive_summary}
                </Paragraph>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Aggregated Analytics */}
      {aggregatedMetrics && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Total Reviews"
                  value={aggregatedMetrics.totalReviews}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Compliance Rate"
                  value={aggregatedMetrics.complianceRate}
                  suffix="%"
                  prefix={<PercentageOutlined />}
                  valueStyle={{ color: aggregatedMetrics.complianceRate >= 80 ? '#52c41a' : '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Total Critical Gaps"
                  value={aggregatedMetrics.totalCriticalGaps}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Avg. Gaps per Review"
                  value={aggregatedMetrics.avgCriticalGapsPerReview}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            {/* Compliance Distribution */}
            <Col xs={24} lg={8}>
              <Card title="Compliance Status Distribution" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>Compliant</Text>
                    </Space>
                    <Text strong>{aggregatedMetrics.complianceDistribution.compliant}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                      <Text>Non-Compliant</Text>
                    </Space>
                    <Text strong>{aggregatedMetrics.complianceDistribution.nonCompliant}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <Text>Partially Compliant</Text>
                    </Space>
                    <Text strong>{aggregatedMetrics.complianceDistribution.partiallyCompliant}</Text>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Risk Distribution */}
            <Col xs={24} lg={8}>
              <Card title="Risk Level Distribution" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                      <Text>High Risk</Text>
                    </Space>
                    <Text strong>{aggregatedMetrics.riskDistribution.high}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <Text>Medium Risk</Text>
                    </Space>
                    <Text strong>{aggregatedMetrics.riskDistribution.medium}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>Low Risk</Text>
                    </Space>
                    <Text strong>{aggregatedMetrics.riskDistribution.low}</Text>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Top Gap Types */}
            <Col xs={24} lg={8}>
              <Card title="Most Common Gap Types" size="small">
                <List
                  size="small"
                  dataSource={aggregatedMetrics.topGapTypes}
                  renderItem={(item) => (
                    <List.Item>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={{ fontSize: '12px' }}>{item.type}</Text>
                        <Badge count={item.count} style={{ backgroundColor: '#ff4d4f' }} />
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Detailed Action Plans */}
      {comprehensiveData?.action_plan && (
        <Card 
          title="Detailed Action Plan" 
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 24]}>
            {comprehensiveData.action_plan.immediate_actions?.length > 0 && (
              <Col xs={24} lg={8}>
                <Card 
                  size="small" 
                  title={
                    <span>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                      Immediate Actions
                      <Badge count={comprehensiveData.action_plan.immediate_actions.length} style={{ backgroundColor: '#ff4d4f', marginLeft: '8px' }} />
                    </span>
                  }
                  headStyle={{ backgroundColor: '#fff2f0' }}
                >
                  <List
                    size="small"
                    dataSource={comprehensiveData.action_plan.immediate_actions}
                    renderItem={(action, index) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Text style={{ fontSize: '12px' }}>
                          {index + 1}. {action}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}

            {comprehensiveData.action_plan.short_term_improvements?.length > 0 && (
              <Col xs={24} lg={8}>
                <Card 
                  size="small" 
                  title={
                    <span>
                      <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                      Short-term Improvements
                      <Badge count={comprehensiveData.action_plan.short_term_improvements.length} style={{ backgroundColor: '#faad14', marginLeft: '8px' }} />
                    </span>
                  }
                  headStyle={{ backgroundColor: '#fffbe6' }}
                >
                  <List
                    size="small"
                    dataSource={comprehensiveData.action_plan.short_term_improvements}
                    renderItem={(action, index) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Text style={{ fontSize: '12px' }}>
                          {index + 1}. {action}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}

            {comprehensiveData.action_plan.long_term_enhancements?.length > 0 && (
              <Col xs={24} lg={8}>
                <Card 
                  size="small" 
                  title={
                    <span>
                      <BulbOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                      Long-term Enhancements
                      <Badge count={comprehensiveData.action_plan.long_term_enhancements.length} style={{ backgroundColor: '#1890ff', marginLeft: '8px' }} />
                    </span>
                  }
                  headStyle={{ backgroundColor: '#f6ffed' }}
                >
                  <List
                    size="small"
                    dataSource={comprehensiveData.action_plan.long_term_enhancements}
                    renderItem={(action, index) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Text style={{ fontSize: '12px' }}>
                          {index + 1}. {action}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}
          </Row>
        </Card>
      )}

      {/* Dashboard Metrics */}
      {comprehensiveData?.dashboard_metrics && (
        <Card title="Performance Metrics" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <Statistic
                title="Reviews This Month"
                value={comprehensiveData.dashboard_metrics.reviews_this_month}
                prefix={<FileTextOutlined />}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic
                title="Compliance Rate"
                value={comprehensiveData.dashboard_metrics.compliance_rate}
                prefix={<PercentageOutlined />}
                valueStyle={{ 
                  color: parseInt(comprehensiveData.dashboard_metrics.compliance_rate) >= 80 ? '#52c41a' : '#ff4d4f' 
                }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic
                title="Gaps Found"
                value={comprehensiveData.dashboard_metrics.gaps_found}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic
                title="Avg Review Time"
                value={comprehensiveData.dashboard_metrics.avg_review_time}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* No Data Message */}
      {!comprehensiveData && !aggregatedMetrics && !loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <BarChartOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <Title level={4} style={{ color: '#bfbfbf', marginTop: '16px' }}>
              No Report Data Available
            </Title>
            <Text type="secondary">
              Complete compliance analyses to generate comprehensive reports and analytics.
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;