import { Card, Table, Row, Col, Select, Input, Button, Tag, Alert, Breadcrumb, Space, Badge, Statistic, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, HomeOutlined, FileTextOutlined, ExclamationCircleOutlined, CheckCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import ReviewResults from './ReviewResults';
import { useCompliance } from '../contexts/ComplianceContext';
import { allReviewsData } from '../data/mockData';
import { getLatestComprehensiveResponse, getStoredResponses } from '../services/localStorageService';

const { Option } = Select;

const AllReviews = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all-statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [comprehensiveReviews, setComprehensiveReviews] = useState([]);

  const {
    reviewsData,
    refreshData,
    loading,
    error
  } = useCompliance();

  // Load comprehensive reviews data
  useEffect(() => {
    const loadComprehensiveReviews = () => {
      try {
        const storedResponses = getStoredResponses();
        const comprehensiveResponses = storedResponses.filter(response => 
          response.metadata?.source === 'comprehensive_new_review'
        );
        
        const transformedReviews = comprehensiveResponses.map(response => {
          const data = response.data;
          return {
            key: response.id,
            id: response.id,
            company: data.analysis_summary?.company_name || 'Unknown Company',
            email: response.metadata?.email || 'N/A',
            documentType: data.analysis_summary?.document_type || 'Unknown Document',
            submitted: new Date(response.timestamp).toLocaleDateString(),
            status: data.final_assessment?.overall_compliance_status || 'Unknown',
            violations: data.critical_gaps?.count > 0 ? `${data.critical_gaps.count} Critical` : '0 Issues',
            violationsColor: data.critical_gaps?.count > 0 ? '#ff4d4f' : '#52c41a',
            critical_count: data.critical_gaps?.count || 0,
            recommendations_count: data.recommendations?.count || 0,
            inconsistencies_count: data.inconsistencies?.count || 0,
            compliant_areas_count: data.compliant_items?.count || 0,
            confidence_score: data.final_assessment?.confidence_score || 'N/A',
            risk_level: data.final_assessment?.risk_level || 'Unknown',
            analysis_date: data.analysis_summary?.analysis_date || response.timestamp.split('T')[0],
            complianceData: data, // Store full compliance data for detailed view
            responseData: response // Store full response data
          };
        });
        
        setComprehensiveReviews(transformedReviews);
      } catch (error) {
        console.error('Error loading comprehensive reviews:', error);
      }
    };

    loadComprehensiveReviews();
  }, []);

  const handleViewResults = (record) => {
    setSelectedReview(record);
    setShowResults(true);
  };

  const handleBackToList = () => {
    setShowResults(false);
    setSelectedReview(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'compliant': 
        return 'success';
      case 'non-compliant': 
        return 'error';
      case 'partially compliant':
      case 'needs review': 
        return 'warning';
      case 'in progress': 
        return 'processing';
      default: 
        return 'default';
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

  // Transform compliance reviews data to match table format
  const transformedComplianceReviews = useMemo(() => {
    if (!reviewsData?.reviews?.length) return [];
    
    return reviewsData.reviews.map((review, index) => ({
      key: review.id || `compliance-${index}`,
      company: review.company || 'Unknown Company',
      email: review.metadata?.email || 'N/A',
      documentType: review.document_type || 'Unknown Document',
      submitted: new Date(review.timestamp).toLocaleDateString(),
      status: review.status || 'Unknown',
      violations: review.critical_count > 0 ? `${review.critical_count} Critical` : '0 Issues',
      violationsColor: review.critical_count > 0 ? '#ff4d4f' : '#52c41a',
      critical_count: review.critical_count || 0,
      recommendations_count: review.recommendations_count || 0,
      inconsistencies_count: review.inconsistencies_count || 0,
      compliant_areas_count: review.compliant_areas_count || 0,
      confidence_score: review.confidence_score || 'N/A',
      risk_level: review.risk_level || 'Unknown',
      analysis_date: review.metadata?.analysis_date || review.timestamp.split('T')[0],
      complianceData: review // Store full compliance data for detailed view
    }));
  }, [reviewsData]);

  // Combined data source (comprehensive reviews + compliance reviews + mock data)
  const combinedReviewsData = useMemo(() => {
    const allReviews = [...comprehensiveReviews, ...transformedComplianceReviews, ...allReviewsData];
    
    return allReviews.filter(review => {
      const matchesSearch = searchTerm === '' || 
        review.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.documentType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all-statuses' || 
        review.status.toLowerCase().replace(' ', '-') === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [comprehensiveReviews, transformedComplianceReviews, searchTerm, statusFilter]);

  // Enhanced table columns with comprehensive data
  const allReviewsColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email}</div>
          {record.analysis_date && (
            <div style={{ fontSize: '11px', color: '#bfbfbf' }}>
              Analysis: {record.analysis_date}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
    },
    {
      title: 'Compliance Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(status)}>{status}</Tag>
          {record.confidence_score && record.confidence_score !== 'N/A' && (
            <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
              Confidence: {record.confidence_score}
            </div>
          )}
          {record.risk_level && record.risk_level !== 'Unknown' && (
            <Tag size="small" color={getRiskColor(record.risk_level)}>
              Risk: {record.risk_level}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Issues Summary',
      key: 'issues',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge 
              count={record.critical_count} 
              style={{ backgroundColor: record.critical_count > 0 ? '#ff4d4f' : '#52c41a' }}
            />
            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Critical</span>
          </div>
          
          {record.recommendations_count !== undefined && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge 
                count={record.recommendations_count} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Recommendations</span>
            </div>
          )}
          
          {record.inconsistencies_count !== undefined && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge 
                count={record.inconsistencies_count} 
                style={{ backgroundColor: '#faad14' }}
              />
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Inconsistencies</span>
            </div>
          )}

          {record.compliant_areas_count !== undefined && record.compliant_areas_count > 0 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge 
                count={record.compliant_areas_count} 
                style={{ backgroundColor: '#52c41a' }}
              />
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Compliant</span>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Date Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
      sorter: (a, b) => new Date(a.submitted) - new Date(b.submitted),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleViewResults(record)}
          >
            View Results
          </Button>
        </Space>
      ),
    },
  ];

  if (showResults) {
    return (
      <ReviewResults
        companyName={selectedReview?.company}
        documentType={selectedReview?.documentType}
        analysisData={selectedReview?.complianceData}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FileTextOutlined />
          <span style={{ marginLeft: '4px' }}>All Reviews</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        title="All Reviews"
        subtitle="Comprehensive view of all compliance reviews and analyses"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshData}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        }
      />

      {error && (
        <Alert
          message="Error Loading Reviews"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Enhanced Summary Statistics */}
      {comprehensiveReviews.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Total Reviews"
                value={combinedReviewsData.length}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Critical Issues"
                value={combinedReviewsData.reduce((sum, review) => sum + (review.critical_count || 0), 0)}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Non-Compliant"
                value={combinedReviewsData.filter(review => 
                  review.status?.toLowerCase() === 'non-compliant'
                ).length}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Compliant"
                value={combinedReviewsData.filter(review => 
                  review.status?.toLowerCase() === 'compliant'
                ).length}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search by company or document type..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="all-statuses">All Statuses</Option>
                <Option value="compliant">Compliant</Option>
                <Option value="non-compliant">Non-Compliant</Option>
                <Option value="partially-compliant">Partially Compliant</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="needs-review">Needs Review</Option>
              </Select>
            </Col>
            <Col xs={24} sm={10}>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <span style={{ color: '#8c8c8c', fontSize: '14px' }}>
                    {combinedReviewsData.length} review{combinedReviewsData.length !== 1 ? 's' : ''} found
                  </span>
                  {comprehensiveReviews.length > 0 && (
                    <Tooltip title="Comprehensive analyses available">
                      <Badge 
                        count={comprehensiveReviews.length} 
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    </Tooltip>
                  )}
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        <Table
          columns={allReviewsColumns}
          dataSource={combinedReviewsData}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} reviews`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default AllReviews;