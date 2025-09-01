// src/contexts/ComplianceContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  getDashboardData, 
  getReviewsData, 
  getRegulationsData, 
  getComplianceData 
} from '../services/localStorageService.js';

// Initial state
const initialState = {
  dashboardData: {
    reviews_this_month: 0,
    compliance_rate: "0%",
    gaps_found: 0,
    avg_review_time: "0 hrs",
    total_critical_gaps: 0,
    total_recommendations: 0,
    total_inconsistencies: 0,
    total_compliant_areas: 0
  },
  reviewsData: { reviews: [] },
  regulationsData: {},
  complianceData: {},
  loading: false,
  error: null,
  lastUpdated: null,
  documentAnalysis: null
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_DASHBOARD_DATA: 'UPDATE_DASHBOARD_DATA',
  UPDATE_REVIEWS_DATA: 'UPDATE_REVIEWS_DATA',
  UPDATE_REGULATIONS_DATA: 'UPDATE_REGULATIONS_DATA',
  UPDATE_COMPLIANCE_DATA: 'UPDATE_COMPLIANCE_DATA',
  SET_DOCUMENT_ANALYSIS: 'SET_DOCUMENT_ANALYSIS',
  REFRESH_ALL_DATA: 'REFRESH_ALL_DATA',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const complianceReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ActionTypes.UPDATE_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          ...action.payload
        },
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.UPDATE_REVIEWS_DATA:
      return {
        ...state,
        reviewsData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.UPDATE_REGULATIONS_DATA:
      return {
        ...state,
        regulationsData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.UPDATE_COMPLIANCE_DATA:
      return {
        ...state,
        complianceData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.SET_DOCUMENT_ANALYSIS:
      return {
        ...state,
        documentAnalysis: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.REFRESH_ALL_DATA:
      return {
        ...state,
        dashboardData: action.payload.dashboardData || initialState.dashboardData,
        reviewsData: action.payload.reviewsData || initialState.reviewsData,
        regulationsData: action.payload.regulationsData || initialState.regulationsData,
        complianceData: action.payload.complianceData || initialState.complianceData,
        lastUpdated: new Date().toISOString(),
        loading: false,
        error: null
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Create context
const ComplianceContext = createContext();

// Context provider component
export const ComplianceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(complianceReducer, initialState);

  // Load initial data from local storage
  useEffect(() => {
    loadAllData();
  }, []);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const updateDashboardData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_DASHBOARD_DATA, payload: data });
  };

  const updateReviewsData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_REVIEWS_DATA, payload: data });
  };

  const updateRegulationsData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_REGULATIONS_DATA, payload: data });
  };

  const updateComplianceData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_COMPLIANCE_DATA, payload: data });
  };

  const setDocumentAnalysis = (analysisData) => {
    dispatch({ type: ActionTypes.SET_DOCUMENT_ANALYSIS, payload: analysisData });
    
    // Update dashboard metrics with the new analysis
    if (analysisData?.dashboard_metrics) {
      updateDashboardData(analysisData.dashboard_metrics);
    }
    
    // Add to reviews history
    if (analysisData?.analysis_summary) {
      const newReview = {
        id: Date.now(),
        documentType: analysisData.analysis_summary.document_type,
        companyName: analysisData.analysis_summary.company_name || 'Unknown',
        date: analysisData.analysis_summary.analysis_date || new Date().toISOString(),
        status: analysisData.final_assessment?.overall_compliance_status || 'Unknown',
        criticalIssues: analysisData.critical_gaps?.count || 0,
        confidenceScore: analysisData.final_assessment?.confidence_score || '0%'
      };
      
      const updatedReviews = {
        reviews: [newReview, ...state.reviewsData.reviews]
      };
      updateReviewsData(updatedReviews);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const dashboardData = getDashboardData();
      const reviewsData = getReviewsData();
      const regulationsData = getRegulationsData();
      const complianceData = getComplianceData();

      dispatch({
        type: ActionTypes.REFRESH_ALL_DATA,
        payload: {
          dashboardData,
          reviewsData,
          regulationsData,
          complianceData
        }
      });
    } catch (error) {
      console.error('Error loading compliance data:', error);
      setError('Failed to load compliance data');
    }
  };

  const refreshData = async () => {
    await loadAllData();
  };

  // Helper functions for computed values
  const getTotalReviews = () => {
    return state.reviewsData?.reviews?.length || 0;
  };

  const getCriticalIssuesCount = () => {
    return state.dashboardData?.total_critical_gaps || 0;
  };

  const getComplianceStatus = () => {
    return state.dashboardData?.compliance_rate || '0%';
  };

  const getRecentReviews = (limit = 5) => {
    const reviews = state.reviewsData?.reviews || [];
    return reviews
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const getViolationsByArticle = () => {
    if (state.documentAnalysis?.critical_gaps?.items) {
      return state.documentAnalysis.critical_gaps.items.reduce((acc, item) => {
        const article = item.qfc_article;
        if (!acc[article]) {
          acc[article] = [];
        }
        acc[article].push(item);
        return acc;
      }, {});
    }
    return {};
  };

  const getAllViolations = () => {
    return state.documentAnalysis?.critical_gaps?.items || [];
  };

  const getMustFixItems = () => {
    return state.documentAnalysis?.action_plan?.immediate_actions || [];
  };

  const getKeyIssues = () => {
    return state.documentAnalysis?.critical_gaps?.items?.slice(0, 3) || [];
  };

  const getRecommendations = () => {
    return state.documentAnalysis?.recommendations?.items || [];
  };

  const getInconsistencies = () => {
    return state.documentAnalysis?.inconsistencies?.items || [];
  };

  const getActionPlan = () => {
    return state.documentAnalysis?.action_plan || {};
  };

  const getFinalAssessment = () => {
    return state.documentAnalysis?.final_assessment || {};
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    clearError,
    updateDashboardData,
    updateReviewsData,
    updateRegulationsData,
    updateComplianceData,
    setDocumentAnalysis,
    refreshData,
    
    // Computed values
    getTotalReviews,
    getCriticalIssuesCount,
    getComplianceStatus,
    getRecentReviews,
    getViolationsByArticle,
    getAllViolations,
    getMustFixItems,
    getKeyIssues,
    getRecommendations,
    getInconsistencies,
    getActionPlan,
    getFinalAssessment
  };

  return (
    <ComplianceContext.Provider value={contextValue}>
      {children}
    </ComplianceContext.Provider>
  );
};

// Custom hook to use compliance context
export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
};

// Export action types for external use
export { ActionTypes };