import React, { useRef, useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Row, Col, Button, Typography, Space, Divider, Card, Tag, List, Alert, Progress, Statistic, Collapse, Badge } from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import {
  PageHeader,
  ComplianceIssuesCard,
  BestPracticesCard,
  DocumentInconsistenciesCard,
  ComplianceSummaryCard
} from '../components/ui';
import { getLatestComprehensiveResponse, getComplianceData } from '../services/localStorageService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ReviewResults = ({
  companyName,
  documentType,
  analysisData,
  onBack
}) => {
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [showCoverPage, setShowCoverPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  useEffect(() => {
    // Load the comprehensive response data
    const loadComprehensiveData = () => {
      try {
        const latestResponse = getLatestComprehensiveResponse();
        const complianceData = getComplianceData();
        
        if (latestResponse?.data) {
          setComprehensiveData(latestResponse.data);
        } else if (complianceData) {
          setComprehensiveData(complianceData);
        } else if (analysisData) {
          setComprehensiveData(analysisData);
        }
      } catch (error) {
        console.error('Error loading comprehensive data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComprehensiveData();
  }, [analysisData]);

  const data = comprehensiveData || {};
  const {
    analysis_summary = {},
    critical_gaps = { count: 0, items: [] },
    recommendations = { count: 0, items: [] },
    inconsistencies = { count: 0, items: [] },
    compliant_items = { count: 0, items: [] },
    dashboard_metrics = {},
    action_plan = {},
    final_assessment = {}
  } = data;

  const effectiveCompanyName = companyName || analysis_summary.company_name || 'Unknown Company';
  const effectiveDocumentType = documentType || analysis_summary.document_type || 'Unknown Document';

const handleDownloadReport = () => {
  setShowCoverPage(true);
  setTimeout(() => {
    const element = reportRef.current;
    const options = {
      margin: [1, 0.5],
      filename: `compliance-report-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

   html2pdf().set(options).from(element).toPdf().get('pdf').then(async (pdf) => {
  const pageCount = pdf.internal.getNumberOfPages();
  const footerImg = await loadImageAsBase64('https://res.cloudinary.com/dineshbruceleedineshk/image/upload/v1755759932/FooterLogo_1_czbwhy.svg');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const footerXRight = pageWidth - 0.5; // right margin for text
  const footerImageX = 0.5; // left margin for footer image
  const footerImageY = 10.75; // vertical position of footer image
  const lineHeight = 0.22; // inch distance between text lines
  const footerStartY = 10.95; // starting Y position for top line of footer text

  // Footer text lines matching your document
  const footerTextLines = [
    "Qatar Financial Centre Authority • PO Box 23245 • Doha, Qatar",
    "T: +974 4496 7777 • F: +974 4496 7676 • info@qfc.qa • qfc.qa"
  ];
  const headerImg = await loadImageAsBase64(
  "https://res.cloudinary.com/dineshbruceleedineshk/image/upload/v1755584289/57070cc5-bcf8-4209-bf16-02fa05ba0836_zakogy.png"
);
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    if (i === 1) {
    // Draw header only on the first page
    pdf.addImage(headerImg, 'PNG', 0, 0, 7.4, 5.5); // adjust height if needed
  }
    // Draw footer logo left
    pdf.addImage(footerImg, 'PNG', footerImageX, footerImageY, 1.5, 0.5);

    // Draw footer text lines aligned right, one below another
    pdf.setFontSize(8);
    pdf.setTextColor(110, 97, 105);
    footerTextLines.forEach((line, index) => {
      pdf.text(line, footerXRight, footerStartY + lineHeight * index, { align: 'right' });
    });
  }
})
.save()
.then(() => setShowCoverPage(false));
  }, 200);
};

// Utility to fetch image as base64 for jsPDF
const loadImageAsBase64 = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

  const handlePrintReport = () => {
    window.print();
  };

  const handleShareReport = () => {
    console.log('Sharing compliance report...');
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'processing';
      case 'low': return 'default';
      default: return 'default';
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

  const getComplianceStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant': return 'success';
      case 'non-compliant': return 'error';
      case 'partially compliant': return 'warning';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'high': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'medium': return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'low': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default: return <InfoCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Text>Loading comprehensive analysis...</Text>
      </div>
    );
  }

  return (
    <div className="review-results-page">
      <PageHeader
        title="Comprehensive Compliance Analysis Results"
        subtitle={`${effectiveCompanyName} • ${effectiveDocumentType}`}
        extra={
          <Space>
            {onBack && (
              <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                Back to Reviews
              </Button>
            )}
            <Button icon={<DownloadOutlined />} onClick={handleDownloadReport}>
              Download Report
            </Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrintReport}>
              Print
            </Button>
            <Button type="primary" icon={<ShareAltOutlined />} onClick={handleShareReport}>
              Share
            </Button>
          </Space>
        }
      />

      {/* Report content to be exported as PDF */}
      <div ref={reportRef}>
{showCoverPage && (
  <div
    className="pdf-cover-page"
    style={{
      position: "relative",
      width: "210mm",
      height: "250mm",
      background: "white",
      pageBreakAfter: "auto",
      overflow: "hidden",
    }}
  >
   

    {/* Title centered */}
    <div
      style={{
        position: "absolute",
        top: "160mm",
        left: "40%",
        transform: "translate(-50%, -50%)",
        color: "#4C3559",
        fontSize: 25,
        fontWeight: 500,
        fontFamily: "inherit",
        zIndex: 3,
        textAlign: "center",
      }}
    >
      AI-Powered Compliance Review System
    </div>
  </div>
)}



        {/* Analysis Date and Summary */}
        <div style={{ marginBottom: '24px', padding: '16px 0' }}>
          <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
            Analysis completed on {analysis_summary.analysis_date || new Date().toLocaleDateString()}
            {final_assessment.confidence_score && ` • Confidence Score: ${final_assessment.confidence_score}`}
          </Text>
        </div>

        {/* Final Assessment Summary */}
        {final_assessment.overall_compliance_status && (
          <Alert
            message={`Compliance Status: ${final_assessment.overall_compliance_status}`}
            description={final_assessment.executive_summary}
            type={final_assessment.overall_compliance_status === 'Compliant' ? 'success' : 'error'}
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        {/* Key Metrics */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Statistic
              title="Critical Gaps"
              value={critical_gaps.count}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic
              title="Recommendations"
              value={recommendations.count}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BulbOutlined />}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic
              title="Inconsistencies"
              value={inconsistencies.count}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic
              title="Compliant Areas"
              value={compliant_items.count}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Col>
        </Row>

        {/* Risk Assessment */}
        {final_assessment.risk_level && (
          <Card title="Risk Assessment" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Text strong>Risk Level: </Text>
                <Tag color={final_assessment.risk_level === 'High' ? 'error' : final_assessment.risk_level === 'Medium' ? 'warning' : 'success'}>
                  {final_assessment.risk_level}
                </Tag>
              </Col>
              <Col xs={24} sm={8}>
                <Text strong>Confidence Score: </Text>
                <Text>{final_assessment.confidence_score}</Text>
              </Col>
              {final_assessment.next_review_date && (
                <Col xs={24} sm={8}>
                  <Text strong>Next Review: </Text>
                  <Text>{final_assessment.next_review_date}</Text>
                </Col>
              )}
            </Row>
          </Card>
        )}

        {/* Critical Gaps */}
        {critical_gaps.items?.length > 0 && (
          <Card 
            title={
              <span>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                Critical Gaps ({critical_gaps.count})
              </span>
            }
            style={{ marginBottom: '24px' }}
          >
            <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
              {critical_gaps.description}
            </Text>
            <List
              dataSource={critical_gaps.items}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <Row gutter={[16, 8]}>
                      <Col xs={24}>
                        <Space>
                          {getSeverityIcon(item.severity)}
                          <Text strong>{item.gap_type}</Text>
                          <Tag color={getSeverityColor(item.severity)}>{item.severity}</Tag>
                          <Tag>{item.qfc_article}</Tag>
                          {item.legal_risk && <Tag color="volcano">Risk: {item.legal_risk}</Tag>}
                        </Space>
                      </Col>
                      <Col xs={24}>
                        <Paragraph style={{ margin: 0 }}>
                          <Text strong>Current State: </Text>
                          <Text>{item.document_states}</Text>
                        </Paragraph>
                      </Col>
                      <Col xs={24}>
                        <Paragraph style={{ margin: 0 }}>
                          <Text strong>QFC Requires: </Text>
                          <Text>{item.qfc_requires}</Text>
                        </Paragraph>
                      </Col>
                      <Col xs={24}>
                        <Paragraph style={{ margin: 0 }}>
                          <Text strong>Immediate Action: </Text>
                          <Text style={{ color: '#ff4d4f' }}>{item.immediate_action}</Text>
                        </Paragraph>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.items?.length > 0 && (
          <Card 
            title={
              <span>
                <BulbOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                Best Practice Recommendations ({recommendations.count})
              </span>
            }
            style={{ marginBottom: '24px' }}
          >
            <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
              {recommendations.description}
            </Text>
            <List
              dataSource={recommendations.items}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <Row gutter={[16, 8]}>
                      <Col xs={24}>
                        <Space>
                          <Text strong>{item.area}</Text>
                          <Tag color={getPriorityColor(item.priority)}>Priority: {item.priority}</Tag>
                          {item.implementation_effort && <Tag color="geekblue">Effort: {item.implementation_effort}</Tag>}
                        </Space>
                      </Col>
                      <Col xs={24}>
                        <Paragraph style={{ margin: 0 }}>
                          <Text strong>Current Practice: </Text>
                          <Text>{item.current_practice}</Text>
                        </Paragraph>
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
        )}

        {/* Document Inconsistencies */}
        {inconsistencies.items?.length > 0 && (
          <Card 
            title={
              <span>
                <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                Document Inconsistencies ({inconsistencies.count})
              </span>
            }
            style={{ marginBottom: '24px' }}
          >
            <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
              {inconsistencies.description}
            </Text>
            <List
              dataSource={inconsistencies.items}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <Row gutter={[16, 8]}>
                      <Col xs={24}>
                        <Space>
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
                            <li key={index}><Text>{statement}</Text></li>
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
                          <Text>{item.recommended_resolution}</Text>
                        </Paragraph>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Compliant Areas */}
        {compliant_items.items?.length > 0 && (
          <Card 
            title={
              <span>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                Compliant Areas ({compliant_items.count})
              </span>
            }
            style={{ marginBottom: '24px' }}
          >
            <Text style={{ color: '#8c8c8c', marginBottom: '16px', display: 'block' }}>
              {compliant_items.description}
            </Text>
            <List
              dataSource={compliant_items.items}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <Row gutter={[16, 8]}>
                      <Col xs={24}>
                        <Space>
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          <Text strong>{item.compliance_area}</Text>
                          <Tag color="success">{item.qfc_article}</Tag>
                        </Space>
                      </Col>
                      <Col xs={24}>
                        <Paragraph style={{ margin: 0 }}>
                          <Text strong>Evidence: </Text>
                          <Text>{item.evidence}</Text>
                        </Paragraph>
                      </Col>
                      <Col xs={24}>
                        <Paragraph style={{ margin: 0 }}>
                          <Text strong>Strength: </Text>
                          <Text style={{ color: '#52c41a' }}>{item.strength}</Text>
                        </Paragraph>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Action Plan */}
        {(action_plan.immediate_actions?.length > 0 || action_plan.short_term_improvements?.length > 0 || action_plan.long_term_enhancements?.length > 0) && (
          <Card 
            title={
              <span>
                <ClockCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                Action Plan
              </span>
            }
            style={{ marginBottom: '24px' }}
          >
            <Collapse defaultActiveKey={['immediate']}>
              {action_plan.immediate_actions?.length > 0 && (
                <Panel header={<Badge count={action_plan.immediate_actions.length} color="#ff4d4f">Immediate Actions</Badge>} key="immediate">
                  <List
                    dataSource={action_plan.immediate_actions}
                    renderItem={(action, index) => (
                      <List.Item>
                        <Space>
                          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                          <Text>{action}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Panel>
              )}
              
              {action_plan.short_term_improvements?.length > 0 && (
                <Panel header={<Badge count={action_plan.short_term_improvements.length} color="#faad14">Short-term Improvements</Badge>} key="short-term">
                  <List
                    dataSource={action_plan.short_term_improvements}
                    renderItem={(action, index) => (
                      <List.Item>
                        <Space>
                          <WarningOutlined style={{ color: '#faad14' }} />
                          <Text>{action}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Panel>
              )}
              
              {action_plan.long_term_enhancements?.length > 0 && (
                <Panel header={<Badge count={action_plan.long_term_enhancements.length} color="#1890ff">Long-term Enhancements</Badge>} key="long-term">
                  <List
                    dataSource={action_plan.long_term_enhancements}
                    renderItem={(action, index) => (
                      <List.Item>
                        <Space>
                          <BulbOutlined style={{ color: '#1890ff' }} />
                          <Text>{action}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Panel>
              )}
            </Collapse>
          </Card>
        )}

        <Divider style={{ margin: '40px 0 24px 0' }} />
        <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
          <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
            This comprehensive report is automatically generated based on QFC Employment Standards Office regulations.
            For questions or clarifications, please contact the compliance team.
          </Text>
        </div>
      </div>

      {/* Footer Actions (not included in PDF) */}
      <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
        <Space size="large">
          <Button size="large" onClick={handleDownloadReport}>
            Download Full Report
          </Button>
          <Button type="primary" size="large" onClick={handleShareReport}>
            Share with Team
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ReviewResults;
