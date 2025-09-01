// src/services/localStorageService.js
// Local storage service for handling API responses with data integrity

const STORAGE_KEYS = {
  API_RESPONSES: 'qfc_api_responses',
  COMPLIANCE_DATA: 'qfc_compliance_data',
  DASHBOARD_DATA: 'qfc_dashboard_data',
  REVIEWS_DATA: 'qfc_reviews_data',
  REGULATIONS_DATA: 'qfc_regulations_data',
  AUDIT_TRAIL: 'qfc_audit_trail'
};

// Store API response with metadata and audit trail
export const storeApiResponse = (apiResponse, metadata = {}) => {
  try {
    const timestamp = new Date().toISOString();
    const responseId = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const storedResponse = {
      id: responseId,
      timestamp,
      data: apiResponse,
      metadata: {
        source: 'new_review_upload_api',
        version: '1.0',
        ...metadata
      }
    };

    // Get existing responses
    const existingResponses = getStoredResponses();
    existingResponses.push(storedResponse);

    // Store updated responses
    localStorage.setItem(STORAGE_KEYS.API_RESPONSES, JSON.stringify(existingResponses));
    
    // Add to audit trail
    addAuditEntry({
      action: 'api_response_stored',
      responseId,
      timestamp,
      metadata
    });

    return responseId;
  } catch (error) {
    console.error('Error storing API response:', error);
    throw new Error('Failed to store API response');
  }
};

// Retrieve all stored API responses
export const getStoredResponses = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.API_RESPONSES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving stored responses:', error);
    return [];
  }
};

// Retrieve specific API response by ID
export const getApiResponseById = (responseId) => {
  try {
    const responses = getStoredResponses();
    return responses.find(response => response.id === responseId);
  } catch (error) {
    console.error('Error retrieving API response by ID:', error);
    return null;
  }
};

// Store compliance data extracted from API response
export const storeComplianceData = (complianceData) => {
  try {
    const timestamp = new Date().toISOString();
    const existing = getComplianceData();
    
    const updatedData = {
      ...existing,
      lastUpdated: timestamp,
      ...complianceData
    };

    localStorage.setItem(STORAGE_KEYS.COMPLIANCE_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'compliance_data_updated',
      timestamp,
      dataKeys: Object.keys(complianceData)
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing compliance data:', error);
    throw new Error('Failed to store compliance data');
  }
};

// Retrieve compliance data
export const getComplianceData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLIANCE_DATA);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error retrieving compliance data:', error);
    return {};
  }
};

// Store dashboard data
export const storeDashboardData = (dashboardData) => {
  try {
    const timestamp = new Date().toISOString();
    const updatedData = {
      ...dashboardData,
      lastUpdated: timestamp
    };

    localStorage.setItem(STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'dashboard_data_updated',
      timestamp
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing dashboard data:', error);
    throw new Error('Failed to store dashboard data');
  }
};

// Retrieve dashboard data
export const getDashboardData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD_DATA);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving dashboard data:', error);
    return null;
  }
};

// Store reviews data
export const storeReviewsData = (reviewsData) => {
  try {
    const timestamp = new Date().toISOString();
    const existing = getReviewsData();
    
    const updatedData = {
      reviews: [...(existing.reviews || []), ...reviewsData],
      lastUpdated: timestamp
    };

    localStorage.setItem(STORAGE_KEYS.REVIEWS_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'reviews_data_updated',
      timestamp,
      newReviewsCount: reviewsData.length
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing reviews data:', error);
    throw new Error('Failed to store reviews data');
  }
};

// Retrieve reviews data
export const getReviewsData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS_DATA);
    return stored ? JSON.parse(stored) : { reviews: [] };
  } catch (error) {
    console.error('Error retrieving reviews data:', error);
    return { reviews: [] };
  }
};

// Store regulations and reports data
export const storeRegulationsData = (regulationsData) => {
  try {
    const timestamp = new Date().toISOString();
    const existing = getRegulationsData();
    
    const updatedData = {
      ...existing,
      ...regulationsData,
      lastUpdated: timestamp
    };

    localStorage.setItem(STORAGE_KEYS.REGULATIONS_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'regulations_data_updated',
      timestamp
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing regulations data:', error);
    throw new Error('Failed to store regulations data');
  }
};

// Retrieve regulations data
export const getRegulationsData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REGULATIONS_DATA);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error retrieving regulations data:', error);
    return {};
  }
};

// Add entry to audit trail
export const addAuditEntry = (entry) => {
  try {
    const existing = getAuditTrail();
    const auditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    existing.push(auditEntry);
    
    // Keep only last 1000 entries to prevent storage overflow
    const trimmed = existing.slice(-1000);
    
    localStorage.setItem(STORAGE_KEYS.AUDIT_TRAIL, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error adding audit entry:', error);
  }
};

// Retrieve audit trail
export const getAuditTrail = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_TRAIL);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving audit trail:', error);
    return [];
  }
};

// Clear all stored data (for testing/reset purposes)
export const clearAllStoredData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    addAuditEntry({
      action: 'all_data_cleared',
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing stored data:', error);
    return false;
  }
};

// Store comprehensive API response from New Review Screen
export const storeComprehensiveApiResponse = (apiResponse, metadata = {}) => {
  try {
    const timestamp = new Date().toISOString();
    
    // Handle the nested JSON structure
    let parsedData = apiResponse;
    if (apiResponse.final && typeof apiResponse.final === 'string') {
      parsedData = JSON.parse(apiResponse.final);
    }

    // Store the complete response
    const responseId = storeApiResponse(parsedData, {
      ...metadata,
      source: 'comprehensive_new_review',
      timestamp
    });

    // Extract and store individual data sections
    const {
      analysis_summary,
      critical_gaps,
      recommendations,
      inconsistencies,
      compliant_items,
      dashboard_metrics,
      action_plan,
      final_assessment,
      regulatory_cross_reference,
      comprehensive_coverage_analysis,
      missing_regulations ,
    } = parsedData;

    // Store dashboard metrics
    if (dashboard_metrics) {
      const dashboardData = {
        reviews_this_month: dashboard_metrics.reviews_this_month || 0,
        compliance_rate: dashboard_metrics.compliance_rate || '0%',
        gaps_found: dashboard_metrics.gaps_found || 0,
        avg_review_time: dashboard_metrics.avg_review_time || '0 hrs',
        total_critical_gaps: dashboard_metrics.total_critical_gaps || 0,
        total_recommendations: dashboard_metrics.total_recommendations || 0,
        total_inconsistencies: dashboard_metrics.total_inconsistencies || 0,
        total_compliant_areas: dashboard_metrics.total_compliant_areas || 0,
        compliance_status: final_assessment?.overall_compliance_status || 'Unknown',
        confidence_score: final_assessment?.confidence_score || '0%',
        risk_level: final_assessment?.risk_level || 'Unknown',
        executive_summary: final_assessment?.executive_summary || '',
        next_review_date: final_assessment?.next_review_date || null,
        document_type: analysis_summary?.document_type || 'Unknown',
        company_name: analysis_summary?.company_name || 'Not specified',
        analysis_date: analysis_summary?.analysis_date || new Date().toISOString().split('T')[0],
        lastUpdated: timestamp
      };
      storeDashboardData(dashboardData);
    }

    // Store comprehensive compliance data
    const complianceData = {
      analysis_summary: analysis_summary || {},
      critical_gaps: critical_gaps || { count: 0, items: [] },
      recommendations: recommendations || { count: 0, items: [] },
      inconsistencies: inconsistencies || { count: 0, items: [] },
      compliant_items: compliant_items || { count: 0, items: [] },
      action_plan: action_plan || {},
      final_assessment: final_assessment || {},
      dashboard_metrics: dashboard_metrics || {},
      regulatory_cross_reference: regulatory_cross_reference || {},   // 👈 added
      comprehensive_coverage_analysis: comprehensive_coverage_analysis || {}, // 👈 added
      missing_regulations: missing_regulations || { count: 0, items: [] },  // 👈 NEW
      total_issues: (critical_gaps?.count || 0) + (inconsistencies?.count || 0),
      critical_issues: critical_gaps?.count || 0,
      status: final_assessment?.overall_compliance_status || 'Unknown',

      // 🔥 Additional details you missed
  key_missing_areas: final_assessment?.key_missing_areas || [], // list of missing
  critical_missing_categories: comprehensive_coverage_analysis?.critical_missing_categories || [],
  short_term_improvements: action_plan?.short_term_improvements || [],
  long_term_enhancements: action_plan?.long_term_enhancements || [],
  missing_regulation_priorities: action_plan?.missing_regulation_priorities || [],

  // Quick counts from dashboard_metrics
  total_recommendations: dashboard_metrics?.total_recommendations || 0,
  total_inconsistencies: dashboard_metrics?.total_inconsistencies || 0,
  total_missing_regulations: missing_regulations?.count || 0,  // 👈 add count

  // Convenience totals
  total_issues: (critical_gaps?.count || 0) + (inconsistencies?.count || 0),
  critical_issues: critical_gaps?.count || 0,
  recommendations_count: recommendations?.count || 0,
  compliant_count: compliant_items?.count || 0,

  status: final_assessment?.overall_compliance_status || 'Unknown',
  lastUpdated: timestamp
    };
    storeComplianceData(complianceData);

    // Store review entry
    const reviewEntry = {
      id: responseId,
      timestamp,
      company: analysis_summary?.company_name || metadata.company || 'Unknown Company',
      document_type: analysis_summary?.document_type || metadata.document_type || 'Unknown Document',
      critical_gaps: critical_gaps?.items || [],
      recommendations: recommendations?.items || [],
      inconsistencies: inconsistencies?.items || [],
      compliant_items: compliant_items?.items || [],
      final_assessment: final_assessment || {},
      dashboard_metrics: dashboard_metrics || {},
      analysis_summary: analysis_summary || {},
      status: final_assessment?.overall_compliance_status || 'Unknown',
      critical_count: critical_gaps?.count || 0,
      recommendations_count: recommendations?.count || 0,
      inconsistencies_count: inconsistencies?.count || 0,
      compliant_areas_count: compliant_items?.count || 0,
      confidence_score: final_assessment?.confidence_score || '0%',
      risk_level: final_assessment?.risk_level || 'Unknown',
      metadata: {
        ...metadata,
        analysis_date: analysis_summary?.analysis_date,
        overall_status: analysis_summary?.overall_status
      }
    };
    storeReviewsData([reviewEntry]);

    // Store regulations data with critical gaps
    if (critical_gaps?.items?.length > 0) {
      const violations = [];
      const articles = {};

      critical_gaps.items.forEach((gap, index) => {
        const violation = {
          id: `violation_${timestamp}_${index}`,
          article: gap.qfc_article || 'Unknown Article',
          gap_type: gap.gap_type || 'Unknown Gap',
          violation: gap.document_states || 'Unknown State',
          required: gap.qfc_requires || 'Unknown Requirement',
          fix_required: gap.immediate_action || 'No fix specified',
          severity: gap.severity || 'Unknown',
          legal_risk: gap.legal_risk || 'Unknown',
          timestamp
        };

        violations.push(violation);

        const articleKey = violation.article;
        if (!articles[articleKey]) {
          articles[articleKey] = [];
        }
        articles[articleKey].push(violation);
      });

      const regulationsData = {
        violations,
        articles,
        action_plan: action_plan || {},
        critical_gaps_count: critical_gaps.count || 0,
        lastUpdated: timestamp
      };
      storeRegulationsData(regulationsData);
    }

    addAuditEntry({
      action: 'comprehensive_api_response_processed',
      responseId,
      timestamp,
      dataProcessed: {
        critical_gaps: critical_gaps?.count || 0,
        recommendations: recommendations?.count || 0,
        inconsistencies: inconsistencies?.count || 0,
        compliant_items: compliant_items?.count || 0
      }
    });

    return {
      responseId,
      success: true,
      message: 'Comprehensive API response stored successfully'
    };

  } catch (error) {
    console.error('Error storing comprehensive API response:', error);
    throw new Error('Failed to store comprehensive API response');
  }
};

// Get the latest comprehensive response data
export const getLatestComprehensiveResponse = () => {
  try {
    const responses = getStoredResponses();
    const comprehensiveResponses = responses.filter(response => 
      response.metadata?.source === 'comprehensive_new_review'
    );
    
    if (comprehensiveResponses.length === 0) {
      return null;
    }

    // Return the most recent response
    return comprehensiveResponses.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )[0];
  } catch (error) {
    console.error('Error retrieving latest comprehensive response:', error);
    return null;
  }
};

// Get compliance summary for dashboard display
export const getComplianceSummaryForDashboard = () => {
  try {
    const dashboardData = getDashboardData();
    const complianceData = getComplianceData();
    
    return {
      compliance_status: dashboardData?.compliance_status || complianceData?.status || 'Unknown',
      compliance_rate: dashboardData?.compliance_rate || '0%',
      critical_issues: dashboardData?.total_critical_gaps || complianceData?.critical_issues || 0,
      reviews_this_month: dashboardData?.reviews_this_month || 0,
      avg_review_time: dashboardData?.avg_review_time || '0 hrs',
      confidence_score: dashboardData?.confidence_score || '0%',
      risk_level: dashboardData?.risk_level || 'Unknown',
      executive_summary: dashboardData?.executive_summary || '',
      next_review_date: dashboardData?.next_review_date || null,
      document_type: dashboardData?.document_type || 'Unknown',
      company_name: dashboardData?.company_name || 'Not specified',
      analysis_date: dashboardData?.analysis_date || new Date().toISOString().split('T')[0],
      last_updated: dashboardData?.lastUpdated || complianceData?.lastUpdated || null,
      missing_regulations: complianceData?.missing_regulations || { count: 0, items: [] },
      total_missing_regulations: complianceData?.total_missing_regulations || 0
    };
  } catch (error) {
    console.error('Error getting compliance summary for dashboard:', error);
    return {};
  }
};

// Export storage keys for use in other components
export { STORAGE_KEYS };