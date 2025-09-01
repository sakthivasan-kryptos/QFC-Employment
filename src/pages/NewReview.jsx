import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Upload,
  Modal,
  message,
  Spin,
  Collapse,
  List,
  notification,
  Breadcrumb,
} from 'antd';
import {
  InboxOutlined,
  HomeOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { storeComprehensiveApiResponse, storeApiResponse } from '../services/localStorageService';

const { Text } = Typography;
const { Dragger } = Upload;
const { Panel } = Collapse;

const LOCALSTORAGE_KEY = 'lastUploadData';

const NewReview = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [apiResponseData, setApiResponseData] = useState(null);

  const navigate = useNavigate();

  // Load last uploaded data if available
  useEffect(() => {
    const lastData = localStorage.getItem(LOCALSTORAGE_KEY);
    if (lastData) {
      const { parsedResult, apiResponseData, uploadSuccess } = JSON.parse(lastData);
      setParsedResult(parsedResult);
      setApiResponseData(apiResponseData);
      setUploadSuccess(uploadSuccess);
    }
  }, []);
console.log("parsedResult:", parsedResult);
  // Save uploaded data persistently
  useEffect(() => {
    if (uploadSuccess && (parsedResult || apiResponseData)) {
      localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify({ parsedResult, apiResponseData, uploadSuccess })
      );
    }
  }, [uploadSuccess, parsedResult, apiResponseData]);

  const handleUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      message.error('Only PDF files are allowed!');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error('File size must be less than 10MB!');
      return false;
    }

    setUploading(true);
    try {
      const pdf_base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });

      const response = await fetch(
        'https://complaincesystem-g9crg6g6hjdxd3h8.eastus2-01.azurewebsites.net/api/upload',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdf_base64 }),
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      let parsedData;
      try {
        parsedData = JSON.parse(result.output);
      } catch {
        parsedData = result;
      }
      console.log('Parsed Data:', parsedData);
      setParsedResult(parsedData);
      setApiResponseData(result);

      const metadata = {
        source: 'comprehensive_new_review',
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        documentType: 'PDF Employment Document',
      };

      if (
        parsedData &&
        (parsedData.critical_gaps ||
          parsedData.recommendations ||
          parsedData.final_assessment ||
          parsedData.action_plan ||
          parsedData.analysis_summary ||
          parsedData.long_term_enhancements
        )
      ) {
        storeComprehensiveApiResponse(parsedData, metadata);
      } else {
        storeApiResponse(result, metadata);
      }

      setUploadSuccess(true);

      notification.success({
        message: 'Document Analysis Complete',
        description: `PDF "${file.name}" has been successfully analyzed and stored.`,
        duration: 5,
        placement: 'topRight',
      });
    } catch (err) {
      console.error('Upload error:', err);
      message.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }

    return false;
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    beforeUpload: handleUpload,
    showUploadList: false,
    disabled: uploading,
  };

  const handleNewUpload = () => {
    setUploadSuccess(false);
    setParsedResult(null);
    setApiResponseData(null);
    localStorage.removeItem(LOCALSTORAGE_KEY);
  };

  const renderList = (items, renderItem) => (
    <List dataSource={items} renderItem={renderItem} bordered style={{ marginBottom: 16 }} />
  );

  const breadcrumbNav = (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer' }}
      >
        <HomeOutlined /> Dashboard
      </Breadcrumb.Item>

      <Breadcrumb.Item
        onClick={() => {
          setUploadSuccess(false);
          navigate('/new-review');
        }}
        style={{ cursor: 'pointer' }}
      >
        <FileAddOutlined /> <span style={{ marginLeft: '4px' }}>New Review</span>
      </Breadcrumb.Item>

      {uploadSuccess && (
        <Breadcrumb.Item
          onClick={() => {
            setUploadSuccess(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          Results
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );

  // Results view
  if (uploadSuccess && (parsedResult || apiResponseData)) {
    const displayData = parsedResult || apiResponseData;
    return (
      <div>
        {breadcrumbNav}

        <PageHeader
          title="Compliance Review Results"
          subtitle="Document successfully analyzed and stored."
          centered
        />

        <Card title="Uploaded Document Analysis Complete" style={{ marginTop: 24 }}>
          {displayData.critical_gaps ||
          displayData.recommendations ||
          displayData.final_assessment ? (
            <Collapse accordion>
              {displayData.critical_gaps && (
                <Panel
                  header={`Critical Gaps (${displayData.critical_gaps.count || 0})`}
                  key="critical_gaps"
                >
                  {displayData.critical_gaps.items
                    ? renderList(displayData.critical_gaps.items, (item) => (
                        <List.Item>
                          <div>
                            <Text strong>Gap Type:</Text> {item.gap_type || 'N/A'} <br />
                            <Text strong>QFC Article:</Text> {item.qfc_article || 'N/A'} <br />
                            <Text strong>Current State:</Text>{' '}
                            {item.document_states || 'N/A'} <br />
                            <Text strong>QFC Requires:</Text> {item.qfc_requires || 'N/A'} <br />
                            <Text strong>Immediate Action:</Text>{' '}
                            {item.immediate_action || 'N/A'}
                          </div>
                        </List.Item>
                      ))
                    : <Text>No critical gaps found.</Text>}
                </Panel>
              )}

              {displayData.recommendations && (
                <Panel
                  header={`Recommendations (${displayData.recommendations.count || 0})`}
                  key="recommendations"
                >
                  {displayData.recommendations.items
                    ? renderList(displayData.recommendations.items, (item) => (
                        <List.Item>
                          <div>
                            <Text strong>Area:</Text> {item.area || 'N/A'} <br />
                            <Text strong>Recommended Change:</Text>{' '}
                            {item.recommended_change || 'N/A'} <br />
                            <Text strong>Business Benefit:</Text>{' '}
                            {item.business_benefit || 'N/A'} <br />
                            <Text strong>Priority:</Text> {item.priority || 'N/A'}
                          </div>
                        </List.Item>
                      ))
                    : <Text>No recommendations available.</Text>}
                </Panel>
              )}

              {displayData.final_assessment && (
                <Panel header="Final Assessment" key="final_assessment">
                  <div>
                    <Text strong>Overall Compliance Status:</Text>{' '}
                    {displayData.final_assessment.overall_compliance_status || 'Unknown'} <br />
                    <Text strong>Risk Level:</Text>{' '}
                    {displayData.final_assessment.risk_level || 'Unknown'} <br />
                    <Text strong>Confidence Score:</Text>{' '}
                    {displayData.final_assessment.confidence_score || 'N/A'} <br />
                    {displayData.final_assessment.executive_summary && (
                      <>
                        <br />
                        <Text strong>Executive Summary:</Text>
                        <div
                          style={{
                            marginTop: '8px',
                            padding: '12px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                          }}
                        >
                          {displayData.final_assessment.executive_summary}
                        </div>
                      </>
                    )}
                  </div>
                </Panel>
              )}
            </Collapse>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Text strong>Analysis Results:</Text>
              <pre style={{ marginTop: '10px', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(displayData, null, 2)}
              </pre>
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button type="primary" onClick={handleNewUpload}>
              Upload Another Document
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Upload view
  return (
    <div>
      {breadcrumbNav}

      <PageHeader
        title="Start New Compliance Review"
        subtitle="Upload PDF employment documents to analyze against QFC regulations"
        centered
      />

      <div className="upload-section">
        <Card className="upload-card">
          <Spin spinning={uploading} tip="Processing your document...">
            <Dragger {...uploadProps}>
              <div className="upload-area">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', marginBottom: '8px' }}>
                  Click or drag PDF file to this area to upload
                </p>
                <p className="ant-upload-hint" style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  Only PDF files are supported. Maximum file size: 10MB
                </p>
              </div>
            </Dragger>
          </Spin>
        </Card>
      </div>

      <Modal open={uploading} footer={null} closable={false} centered width={300}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', fontSize: '16px' }}>Processing your document...</div>
          <div style={{ marginTop: '8px', color: '#8c8c8c', fontSize: '14px' }}>
            Please wait while we analyze your PDF
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewReview;
 