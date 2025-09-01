// src/components/TestApiWorkflow.jsx
import React, { useState } from 'react';
import { Card, Button, Space, Alert, Typography, Divider, Spin, notification } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { simulateNewReviewApiResponse } from '../services/apiService';
import { useCompliance } from '../contexts/ComplianceContext';

const { Title, Text, Paragraph } = Typography;

const TestApiWorkflow = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { refreshData } = useCompliance();

  const runWorkflowTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Simulate API response processing
      notification.info({
        message: 'Processing API Response',
        description: 'Simulating New-Review Upload Document API response...',
        duration: 2
      });

      const processingResult = await simulateNewReviewApiResponse({
        company: 'Test Corporation',
        document_type: 'Employment Contract & HR Manual',
        email: 'test@testcorp.com',
        uploaded_by: 'Test User'
      });

      // Step 2: Refresh context data to reflect changes
      await refreshData();

      setResult(processingResult);
      
      notification.success({
        message: 'Workflow Completed Successfully',
        description: 'API response processed and all sections updated!',
        duration: 4
      });

    } catch (err) {
      console.error('Workflow test failed:', err);
      setError(err.message);
      
      notification.error({
        message: 'Workflow Failed',
        description: err.message,
        duration: 4
      });
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setResult(null);
    setError(null);
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlayCircleOutlined style={{ color: '#1890ff' }} />
          Test API Response Processing Workflow
        </div>
      }
      style={{ margin: '24px 0' }}
    >
      <Paragraph>
        This component demonstrates the complete workflow for processing New-Review Upload Document API responses:
      </Paragraph>

      <div style={{ marginBottom: '24px' }}>
        <Title level={5}>Workflow Steps:</Title>
        <ol style={{ paddingLeft: '20px' }}>
          <li><Text>Receive and validate API response</Text></li>
          <li><Text>Store API response locally with audit trail</Text></li>
          <li><Text>Extract and update Dashboard data (compliance summary, critical issues, must-fix items)</Text></li>
          <li><Text>Add new entry to All-Reviews section</Text></li>
          <li><Text>Update Regulations and Reports with QFC Article violations and fixes</Text></li>
          <li><Text>Refresh all components to reflect new data</Text></li>
        </ol>
      </div>

      <Divider />

      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={runWorkflowTest}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Run Workflow Test'}
            </Button>
            
            {result && (
              <Button 
                icon={<ReloadOutlined />}
                onClick={resetTest}
              >
                Reset Test
              </Button>
            )}
          </Space>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>Processing API response and updating all sections...</Text>
            </div>
          </div>
        )}

        {error && (
          <Alert
            message="Workflow Test Failed"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}

        {result && (
          <Alert
            message="Workflow Test Completed Successfully!"
            description={
              <div>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <strong>Response ID:</strong> {result.responseId}
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <strong>Dashboard Updated:</strong> ✓ Compliance status, critical issues, and must-fix items
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <strong>All-Reviews Updated:</strong> ✓ New review entry added
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <strong>Regulations Updated:</strong> ✓ QFC Article violations and fixes integrated
                </Paragraph>
                <Paragraph style={{ marginBottom: '0' }}>
                  <Text type="secondary">
                    Navigate to Dashboard, All Reviews, or Regulations pages to see the updated data.
                  </Text>
                </Paragraph>
              </div>
            }
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}
      </Space>

      <Divider />

      <div style={{ marginTop: '24px' }}>
        <Title level={5}>Test Data Preview:</Title>
        <Text type="secondary">
          The test will simulate processing an API response with the following structure:
        </Text>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '12px', 
          borderRadius: '4px', 
          fontSize: '12px',
          marginTop: '8px',
          overflow: 'auto'
        }}>
{`{
  "compliance_summary": {
    "status": "Non-Compliant",
    "critical_issues": 5,
    "must_fix_items": [
      "Reduce probation period to maximum 3 months",
      "Increase annual leave to 20 working days",
      "Add overtime pay clause at 125%",
      ...
    ]
  },
  "mandatory_compliance_issues": [
    {
      "qfc_article": "Article 18",
      "violation": "Probation period exceeds maximum allowed",
      "qfc_requires": "Maximum probation period of 3 months",
      "fix_required": "Reduce probation period from 6 months to 3 months",
      "severity": "Critical"
    },
    ...
  ],
  "best_practice_recommendations": [...],
  "document_inconsistencies": [...]
}`}
        </pre>
      </div>
    </Card>
  );
};

export default TestApiWorkflow;