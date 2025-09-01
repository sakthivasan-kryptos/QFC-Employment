import { Card, Row, Col, Space, Button, Typography, List, Tag, Alert, Collapse, Divider, Breadcrumb, Statistic, Badge, Tooltip } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  FileAddOutlined,
  WarningOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  BookOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import { useCompliance } from '../contexts/ComplianceContext';
import { useEffect, useState } from 'react';
import { getLatestComprehensiveResponse, getComplianceData, getRegulationsData } from '../services/localStorageService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Regulations = () => {
  const {
    regulationsData,
    complianceData,
    getAllViolations,
    getViolationsByArticle,
    refreshData,
    loading,
    error
  } = useCompliance();

  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [enhancedRegulationsData, setEnhancedRegulationsData] = useState(null);

  // Load comprehensive regulations data
  useEffect(() => {
    const loadComprehensiveData = () => {
      try {
        const latestResponse = getLatestComprehensiveResponse();
        const storedComplianceData = getComplianceData();
        const storedRegulationsData = getRegulationsData();
        
        if (latestResponse?.data) {
          setComprehensiveData(latestResponse.data);
        }
        
        if (storedRegulationsData) {
          setEnhancedRegulationsData(storedRegulationsData);
        }
      } catch (error) {
        console.error('Error loading comprehensive data:', error);
      }
    };

    loadComprehensiveData();
  }, []);

  const violations = getAllViolations();
  const violationsByArticle = getViolationsByArticle();
  const recommendations = complianceData?.recommendations || [];
  const inconsistencies = complianceData?.inconsistencies || [];

  // Get comprehensive data or fallback to existing data
  const criticalGaps = comprehensiveData?.critical_gaps || { count: 0, items: [] };
  const actionPlan = comprehensiveData?.action_plan || {};
  const complianceRecommendations = comprehensiveData?.recommendations || { count: 0, items: [] };
  const documentInconsistencies = comprehensiveData?.inconsistencies || { count: 0, items: [] };
  const compliantItems = comprehensiveData?.compliant_items || { count: 0, items: [] };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'processing';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'high': return <WarningOutlined style={{ color: '#faad14' }} />;
      default: return <WarningOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Group critical gaps by QFC article
  const groupedCriticalGaps = criticalGaps.items?.reduce((acc, gap) => {
    const article = gap.qfc_article || 'Unknown Article';
    if (!acc[article]) {
      acc[article] = [];
    }
    acc[article].push(gap);
    return acc;
  }, {}) || {};

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BookOutlined />
          <span style={{ marginLeft: '4px' }}>Regulations</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        title="Regulations and Reports"
        subtitle="QFC Article violations, requirements, and compliance analysis"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshData}
              loading={loading}
            >
              Refresh Data
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} size="large">
              Download Report
            </Button>
            <Button icon={<MailOutlined />} size="large">
              Email Results
            </Button>
            <Button icon={<FileAddOutlined />} size="large">
              Create Action Plan
            </Button>
          </Space>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error Loading Regulations Data"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Comprehensive Analysis Summary */}
      {comprehensiveData && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Critical Gaps"
                value={criticalGaps.count}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="QFC Articles Affected"
                value={Object.keys(groupedCriticalGaps).length}
                valueStyle={{ color: '#faad14' }}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Immediate Actions"
                value={actionPlan.immediate_actions?.length || 0}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Compliant Areas"
                value={compliantItems.count}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Critical Gaps by QFC Article */}
      {Object.keys(groupedCriticalGaps).length > 0 && (
        <Card 
          title={
            <span>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
              Critical Gaps by QFC Article ({criticalGaps.count})
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
            {criticalGaps.description}
          </Text>
          
          <Collapse defaultActiveKey={Object.keys(groupedCriticalGaps).slice(0, 3)}>
            {Object.entries(groupedCriticalGaps).map(([article, gaps]) => (
              <Panel 
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{article}</span>
                    <Badge count={gaps.length} style={{ backgroundColor: '#ff4d4f' }} />
                  </div>
                } 
                key={article}
              >
                <List
                  dataSource={gaps}
                  renderItem={(gap) => (
                    <List.Item>
                      <Card size="small" style={{ width: '100%' }}>
                        <Row gutter={[16, 8]}>
                          <Col xs={24}>
                            <Space>
                              {getSeverityIcon(gap.severity)}
                              <Text strong>{gap.gap_type}</Text>
                              <Tag color={getSeverityColor(gap.severity)}>{gap.severity}</Tag>
                              {gap.legal_risk && <Tag color="volcano">Risk: {gap.legal_risk}</Tag>}
                            </Space>
                          </Col>
                          <Col xs={24}>
                            <Paragraph style={{ margin: 0 }}>
                              <Text strong>Current State: </Text>
                              <Text>{gap.document_states}</Text>
                            </Paragraph>
                          </Col>
                          <Col xs={24}>
                            <Paragraph style={{ margin: 0 }}>
                              <Text strong>QFC Requires: </Text>
                              <Text style={{ color: '#1890ff' }}>{gap.qfc_requires}</Text>
                            </Paragraph>
                          </Col>
                          <Col xs={24}>
                            <Paragraph style={{ margin: 0 }}>
                              <Text strong>Immediate Action: </Text>
                              <Text style={{ color: '#ff4d4f', fontWeight: '500' }}>{gap.immediate_action}</Text>
                            </Paragraph>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}

      {/* Action Plan */}
      {(actionPlan.immediate_actions?.length > 0 || actionPlan.short_term_improvements?.length > 0 || actionPlan.long_term_enhancements?.length > 0) && (
        <Card 
          title={
            <span>
              <ClockCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              Regulatory Action Plan
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 24]}>
            {actionPlan.immediate_actions?.length > 0 && (
              <Col xs={24} lg={8}>
                <Card 
                  size="small" 
                  title={
                    <span>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                      Immediate Actions
                      <Badge count={actionPlan.immediate_actions.length} style={{ backgroundColor: '#ff4d4f', marginLeft: '8px' }} />
                    </span>
                  }
                  headStyle={{ backgroundColor: '#fff2f0' }}
                >
                  <List
                    size="small"
                    dataSource={actionPlan.immediate_actions}
                    renderItem={(action, index) => (
                      <List.Item style={{ padding: '8px 0' }}>
                        <div>
                          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                          <Text style={{ fontSize: '13px' }}>{action}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}

            {actionPlan.short_term_improvements?.length > 0 && (
              <Col xs={24} lg={8}>
                <Card 
                  size="small" 
                  title={
                    <span>
                      <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                      Short-term Improvements
                      <Badge count={actionPlan.short_term_improvements.length} style={{ backgroundColor: '#faad14', marginLeft: '8px' }} />
                    </span>
                  }
                  headStyle={{ backgroundColor: '#fffbe6' }}
                >
                  <List
                    size="small"
                    dataSource={actionPlan.short_term_improvements}
                    renderItem={(action, index) => (
                      <List.Item style={{ padding: '8px 0' }}>
                        <div>
                          <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                          <Text style={{ fontSize: '13px' }}>{action}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}

            {actionPlan.long_term_enhancements?.length > 0 && (
              <Col xs={24} lg={8}>
                <Card 
                  size="small" 
                  title={
                    <span>
                      <BulbOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                      Long-term Enhancements
                      <Badge count={actionPlan.long_term_enhancements.length} style={{ backgroundColor: '#1890ff', marginLeft: '8px' }} />
                    </span>
                  }
                  headStyle={{ backgroundColor: '#f6ffed' }}
                >
                  <List
                    size="small"
                    dataSource={actionPlan.long_term_enhancements}
                    renderItem={(action, index) => (
                      <List.Item style={{ padding: '8px 0' }}>
                        <div>
                          <BulbOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                          <Text style={{ fontSize: '13px' }}>{action}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}
          </Row>
        </Card>
      )}

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Compliance Recommendations */}
        {complianceRecommendations.items?.length > 0 && (
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span>
                  <BulbOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  Regulatory Recommendations ({complianceRecommendations.count})
                </span>
              }
              size="small"
            >
              <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
                {complianceRecommendations.description}
              </Text>
              <List
                dataSource={complianceRecommendations.items}
                renderItem={(item) => (
                  <List.Item>
                    <Card size="small" style={{ width: '100%' }}>
                      <Row gutter={[16, 8]}>
                        <Col xs={24}>
                          <Space>
                            <InfoCircleOutlined style={{ color: '#1890ff' }} />
                            <Text strong>{item.area}</Text>
                            <Tag color={getPriorityColor(item.priority)}>Priority: {item.priority}</Tag>
                            {item.implementation_effort && <Tag color="geekblue">Effort: {item.implementation_effort}</Tag>}
                          </Space>
                        </Col>
                        <Col xs={24}>
                          <Paragraph style={{ margin: 0 }}>
                            <Text strong>Recommended Change: </Text>
                            <Text>{item.recommended_change}</Text>
                          </Paragraph>
                        </Col>
                        <Col xs={24}>
                          <Paragraph style={{ margin: 0 }}>
                            <Text strong>Business Benefit: </Text>
                            <Text style={{ color: '#52c41a' }}>{item.business_benefit}</Text>
                          </Paragraph>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}

        {/* Compliant Areas */}
        {compliantItems.items?.length > 0 && (
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  QFC Compliant Areas ({compliantItems.count})
                </span>
              }
              size="small"
            >
              <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
                {compliantItems.description}
              </Text>
              <List
                dataSource={compliantItems.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      title={
                        <Space>
                          <Text strong>{item.compliance_area}</Text>
                          <Tag color="success">{item.qfc_article}</Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph style={{ margin: '4px 0' }}>
                            <Text strong>Evidence: </Text>
                            <Text>{item.evidence}</Text>
                          </Paragraph>
                          <Paragraph style={{ margin: 0 }}>
                            <Text strong>Strength: </Text>
                            <Text style={{ color: '#52c41a' }}>{item.strength}</Text>
                          </Paragraph>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}
      </Row>

      {/* Fallback to existing violations display */}
      {!comprehensiveData && violations.length > 0 && (
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <WarningOutlined style={{ color: '#faad14' }} />
                  QFC Article Violations ({violations.length})
                </div>
              }
              size="small"
            >
              <List
                dataSource={violations.slice(0, 10)}
                renderItem={(violation) => (
                  <List.Item>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <Text strong style={{ color: '#262626' }}>
                          {violation.article}
                        </Text>
                        <Tag color={getSeverityColor(violation.severity)}>
                          {violation.severity}
                        </Tag>
                      </div>
                      <Text style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
                        <Text strong>Violation:</Text> {violation.violation}
                      </Text>
                      <Text style={{ fontSize: '13px', color: '#1890ff' }}>
                        <Text strong>Required:</Text> {violation.required}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
              {violations.length > 10 && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  +{violations.length - 10} more violations
                </Text>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  Recommendations ({recommendations.length})
                </div>
              }
              size="small"
            >
              <List
                dataSource={recommendations.slice(0, 10)}
                renderItem={(recommendation) => (
                  <List.Item>
                    <div>
                      <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '4px' }}>
                        {recommendation.area || 'General Recommendation'}
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        {recommendation.recommendation || recommendation.description || 'No description available'}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
              {recommendations.length > 10 && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  +{recommendations.length - 10} more recommendations
                </Text>
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* Document Inconsistencies */}
      {documentInconsistencies.items?.length > 0 && (
        <Card 
          title={
            <span>
              <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
              Document Inconsistencies ({documentInconsistencies.count})
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
            {documentInconsistencies.description}
          </Text>
          <List
            dataSource={documentInconsistencies.items}
            renderItem={(item) => (
              <List.Item>
                <Card size="small" style={{ width: '100%' }}>
                  <Row gutter={[16, 8]}>
                    <Col xs={24}>
                      <Space>
                        <WarningOutlined style={{ color: '#faad14' }} />
                        <Text strong>{item.conflict_area}</Text>
                        <Tag color={getPriorityColor(item.priority)}>Priority: {item.priority}</Tag>
                      </Space>
                    </Col>
                    <Col xs={24}>
                      <Paragraph style={{ margin: 0 }}>
                        <Text strong>Conflicting Statements: </Text>
                      </Paragraph>
                      <ul style={{ margin: '8px 0' }}>
                        {item.conflicting_statements?.map((statement, index) => (
                          <li key={index}><Text style={{ fontSize: '12px' }}>{statement}</Text></li>
                        ))}
                      </ul>
                    </Col>
                    <Col xs={24}>
                      <Paragraph style={{ margin: 0 }}>
                        <Text strong>Operational Risk: </Text>
                        <Text style={{ color: '#faad14' }}>{item.operational_risk}</Text>
                      </Paragraph>
                    </Col>
                    <Col xs={24}>
                      <Paragraph style={{ margin: 0 }}>
                        <Text strong>Recommended Resolution: </Text>
                        <Text style={{ color: '#1890ff' }}>{item.recommended_resolution}</Text>
                      </Paragraph>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* No Data Message */}
      {!comprehensiveData && violations.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FileProtectOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <Title level={4} style={{ color: '#bfbfbf', marginTop: '16px' }}>
              No Regulatory Data Available
            </Title>
            <Text type="secondary">
              Upload documents for compliance analysis to see QFC regulatory violations and recommendations.
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Regulations;