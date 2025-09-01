// src/utils/apiResponseParser.js
// Utility functions to parse New-Review Upload Document API responses

// Parse API response and extract data for dashboard update
export const extractDashboardData = (apiResponse) => {
  try {
    // Handle the new nested JSON structure
    let parsedData = apiResponse;
    if (apiResponse.final && typeof apiResponse.final === 'string') {
      parsedData = JSON.parse(apiResponse.final);
    }

    const { 
      dashboard_metrics, 
      final_assessment, 
      critical_gaps,
      analysis_summary 
    } = parsedData;
    
    return {
      compliance_status: final_assessment?.overall_compliance_status || '0',
      compliance_rate: dashboard_metrics?.compliance_rate || '0%',
      critical_issues: dashboard_metrics?.total_critical_gaps || critical_gaps?.count || 0,
      reviews_this_month: dashboard_metrics?.reviews_this_month || 0,
      avg_review_time: dashboard_metrics?.avg_review_time || '0 hrs',
      gaps_found: dashboard_metrics?.gaps_found || 0,
      confidence_score: final_assessment?.confidence_score || '0%',
      risk_level: final_assessment?.risk_level || '0',
      next_review_date: final_assessment?.next_review_date || null,
      executive_summary: final_assessment?.executive_summary || '',
      document_type: analysis_summary?.document_type || '0',
      company_name: analysis_summary?.company_name || 'Not specified',
      analysis_date: analysis_summary?.analysis_date || new Date().toISOString().split('T')[0],
      overall_status: analysis_summary?.overall_status || 'Pending',
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting dashboard data:', error);
    throw new Error('Failed to extract dashboard data from API response');
  }
};

// Parse API response and extract data for All-Reviews section
export const extractReviewsData = (apiResponse, metadata = {}) => {
  try {
    // Handle the new nested JSON structure
    let parsedData = apiResponse;
    if (apiResponse.final && typeof apiResponse.final === 'string') {
      parsedData = JSON.parse(apiResponse.final);
    }

    const {
      analysis_summary,
      critical_gaps,
      recommendations,
      inconsistencies,
      compliant_items,
      final_assessment,
      dashboard_metrics
    } = parsedData;

    const reviewEntry = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
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

    return [reviewEntry];
  } catch (error) {
    console.error('Error extracting reviews data:', error);
    throw new Error('Failed to extract reviews data from API response');
  }
};

// Parse API response and extract data for Regulations and Reports
export const extractRegulationsData = (apiResponse) => {
  try {
    // Handle the new nested JSON structure
    let parsedData = apiResponse;
    if (apiResponse.final && typeof apiResponse.final === 'string') {
      parsedData = JSON.parse(apiResponse.final);
    }

    const { critical_gaps, action_plan } = parsedData;
    
    if (!critical_gaps?.items || !Array.isArray(critical_gaps.items)) {
      return { violations: [], articles: {}, action_plan: {} };
    }

    const violations = [];
    const articles = {};

    critical_gaps.items.forEach((gap, index) => {
      const violation = {
        id: `violation_${Date.now()}_${index}`,
        article: gap.qfc_article || 'Unknown Article',
        gap_type: gap.gap_type || 'Unknown Gap',
        violation: gap.document_states || 'Unknown State',
        required: gap.qfc_requires || 'Unknown Requirement',
        fix_required: gap.immediate_action || 'No fix specified',
        severity: gap.severity || 'Unknown',
        legal_risk: gap.legal_risk || 'Unknown',
        timestamp: new Date().toISOString()
      };

      violations.push(violation);

      // Group by article for easier access
      const articleKey = violation.article;
      if (!articles[articleKey]) {
        articles[articleKey] = [];
      }
      articles[articleKey].push(violation);
    });

    return {
      violations,
      articles,
      action_plan: action_plan || {},
      critical_gaps_count: critical_gaps.count || 0,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting regulations data:', error);
    throw new Error('Failed to extract regulations data from API response');
  }
};

// Parse API response and extract comprehensive compliance data
export const extractComplianceData = (apiResponse) => {
  try {
    // Handle the new nested JSON structure
    let parsedData = apiResponse;
    if (apiResponse.final && typeof apiResponse.final === 'string') {
      parsedData = JSON.parse(apiResponse.final);
    }

    const {
      analysis_summary,
      critical_gaps,
      recommendations,
      inconsistencies,
      compliant_items,
      dashboard_metrics,
      action_plan,
      final_assessment
    } = parsedData;

    return {
      analysis_summary: analysis_summary || {},
      critical_gaps: critical_gaps || { count: 0, items: [] },
      recommendations: recommendations || { count: 0, items: [] },
      inconsistencies: inconsistencies || { count: 0, items: [] },
      compliant_items: compliant_items || { count: 0, items: [] },
      dashboard_metrics: dashboard_metrics || {},
      action_plan: action_plan || {},
      final_assessment: final_assessment || {},
      total_issues: (critical_gaps?.count || 0) + (inconsistencies?.count || 0),
      critical_issues: critical_gaps?.count || 0,
      status: final_assessment?.overall_compliance_status || 'Unknown',
      confidence_score: final_assessment?.confidence_score || '0%',
      risk_level: final_assessment?.risk_level || 'Unknown',
      executive_summary: final_assessment?.executive_summary || '',
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting compliance data:', error);
    throw new Error('Failed to extract compliance data from API response');
  }
};

// Validate API response structure
export const validateApiResponse = (apiResponse) => {
  try {
    // Handle the new nested JSON structure
    let parsedData = apiResponse;
    if (apiResponse.final && typeof apiResponse.final === 'string') {
      parsedData = JSON.parse(apiResponse.final);
    }

    const requiredFields = [
      'analysis_summary',
      'critical_gaps',
      'final_assessment'
    ];

    const missingFields = requiredFields.filter(field => !(field in parsedData));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields in API response: ${missingFields.join(', ')}`);
    }

    // Validate analysis_summary structure
    if (parsedData.analysis_summary && typeof parsedData.analysis_summary !== 'object') {
      throw new Error('analysis_summary must be an object');
    }

    // Validate critical_gaps structure
    if (parsedData.critical_gaps && typeof parsedData.critical_gaps !== 'object') {
      throw new Error('critical_gaps must be an object');
    }

    // Validate final_assessment structure
    if (parsedData.final_assessment && typeof parsedData.final_assessment !== 'object') {
      throw new Error('final_assessment must be an object');
    }

    return true;
  } catch (error) {
    console.error('Error validating API response:', error);
    throw new Error(`Failed to validate API response: ${error.message}`);
  }
};

// Handle null or missing fields gracefully
export const sanitizeApiResponse = (apiResponse) => {
  try {
    // Handle the new nested JSON structure
    let parsedData = apiResponse;
    if (apiResponse.final && typeof apiResponse.final === 'string') {
      parsedData = JSON.parse(apiResponse.final);
    }

    const sanitized = {
      analysis_summary: parsedData.analysis_summary || {},
      critical_gaps: parsedData.critical_gaps || { count: 0, items: [] },
      recommendations: parsedData.recommendations || { count: 0, items: [] },
      inconsistencies: parsedData.inconsistencies || { count: 0, items: [] },
      compliant_items: parsedData.compliant_items || { count: 0, items: [] },
      dashboard_metrics: parsedData.dashboard_metrics || {},
      action_plan: parsedData.action_plan || {},
      final_assessment: parsedData.final_assessment || {}
    };

    // Ensure analysis_summary has required structure
    sanitized.analysis_summary = {
      document_type: sanitized.analysis_summary.document_type || 'Unknown Document',
      company_name: sanitized.analysis_summary.company_name || 'Not specified',
      analysis_date: sanitized.analysis_summary.analysis_date || new Date().toISOString().split('T')[0],
      overall_status: sanitized.analysis_summary.overall_status || 'Pending',
      ...sanitized.analysis_summary
    };

    // Ensure critical_gaps have required structure
    sanitized.critical_gaps = {
      count: sanitized.critical_gaps.count || 0,
      description: sanitized.critical_gaps.description || 'Critical compliance issues',
      items: (sanitized.critical_gaps.items || []).map((gap, index) => ({
        gap_type: gap?.gap_type || `Gap ${index + 1}`,
        severity: gap?.severity || 'Unknown',
        qfc_article: gap?.qfc_article || 'Unknown Article',
        document_states: gap?.document_states || 'Unknown State',
        qfc_requires: gap?.qfc_requires || 'Unknown Requirement',
        immediate_action: gap?.immediate_action || 'No action specified',
        legal_risk: gap?.legal_risk || 'Unknown',
        ...gap
      }))
    };

    // Ensure final_assessment has required structure
    sanitized.final_assessment = {
      overall_compliance_status: sanitized.final_assessment.overall_compliance_status || 'Unknown',
      confidence_score: sanitized.final_assessment.confidence_score || '0%',
      risk_level: sanitized.final_assessment.risk_level || 'Unknown',
      next_review_date: sanitized.final_assessment.next_review_date || null,
      executive_summary: sanitized.final_assessment.executive_summary || '',
      ...sanitized.final_assessment
    };

    return sanitized;
  } catch (error) {
    console.error('Error sanitizing API response:', error);
    throw new Error('Failed to sanitize API response');
  }
};

// Create mock API response for testing - updated to new format
export const createMockApiResponse = () => {
  return {
    final: JSON.stringify({
      analysis_summary: {
        document_type: "Employment Contract & HR Manual",
        company_name: "Test Company",
        analysis_date: "2024-06-13",
        overall_status: "Completed"
      },
      critical_gaps: {
        count: 5,
        description: "Mandatory compliance issues that require immediate attention",
        items: [
          {
            gap_type: "Probation Period Gap",
            severity: "Critical",
            qfc_article: "Article 18",
            document_states: "The first six (6) months of employment will be considered a probationary period.",
            qfc_requires: "A probationary period must not exceed 3 months from the date employment commences.",
            immediate_action: "Amend the probationary period to a maximum of 3 months.",
            legal_risk: "High"
          },
          {
            gap_type: "Annual Leave Entitlement Gap",
            severity: "Critical",
            qfc_article: "Article 33",
            document_states: "Employees are entitled to 15 working days of annual leave per year.",
            qfc_requires: "Employees must receive at least 20 working days of annual leave per year.",
            immediate_action: "Increase annual leave entitlement to at least 20 working days per year.",
            legal_risk: "High"
          }
        ]
      },
      recommendations: {
        count: 4,
        description: "Best practice improvements suggested",
        items: [
          {
            area: "Contract Requirements",
            priority: "High",
            current_practice: "Contract refers to HR Manual for certain terms and omits some statutory minimums.",
            recommended_change: "Include all legally required minimum entitlements directly in the contract.",
            business_benefit: "Reduces ambiguity and ensures employees are fully informed of their legal rights.",
            implementation_effort: "Easy"
          }
        ]
      },
      inconsistencies: {
        count: 3,
        description: "Internal document conflicts found",
        items: [
          {
            conflict_area: "Reference to HR Manual vs. Contract Minimums",
            conflicting_statements: [
              "Sick leave provisions are detailed in the HR Manual.",
              "Contract does not specify statutory minimum sick leave entitlements."
            ],
            operational_risk: "Employees may be unaware of legal minimums, leading to disputes or claims.",
            recommended_resolution: "Summarize all statutory minimums in the contract.",
            priority: "High"
          }
        ]
      },
      compliant_items: {
        count: 2,
        description: "Areas meeting QFC standards",
        items: [
          {
            compliance_area: "Salary Payment Frequency",
            qfc_article: "Article 26",
            evidence: "Standard QFC contracts require salary to be paid monthly. No evidence of non-compliance found.",
            strength: "Ensures employees are regularly compensated in accordance with QFC law."
          }
        ]
      },
      dashboard_metrics: {
        reviews_this_month: 23,
        compliance_rate: "89%",
        gaps_found: 156,
        avg_review_time: "2.3 hrs",
        total_critical_gaps: 5,
        total_recommendations: 4,
        total_inconsistencies: 3,
        total_compliant_areas: 2
      },
      action_plan: {
        immediate_actions: [
          "Reduce probation period to a maximum of 3 months.",
          "Increase annual leave entitlement to at least 20 working days per year."
        ],
        short_term_improvements: [
          "Explicitly state sick leave entitlement of at least 60 working days per year in the contract.",
          "Add an overtime clause specifying pay at 125% of the normal hourly rate."
        ],
        long_term_enhancements: [
          "Include all statutory minimums directly in the contract.",
          "Implement structured performance management procedures."
        ]
      },
      final_assessment: {
        overall_compliance_status: "Non-Compliant",
        confidence_score: "96%",
        risk_level: "High",
        next_review_date: "2024-09-13",
        executive_summary: "The employment contract contains several critical non-compliance issues with QFC regulations. Immediate remediation is required to avoid legal exposure."
      }
    })
  };
};