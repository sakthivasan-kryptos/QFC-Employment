# New-Review Upload Document API Response Processing

This implementation provides a complete system for handling New-Review Upload Document API responses according to the specified requirements.

## Overview

When you receive an API response from the New-Review Upload Document API, the system will:

1. **Store the API Response Locally** - Save the entire response with data integrity and audit trails
2. **Update the Dashboard** - Display compliance summary, critical issues, and must-fix items
3. **Update All-Reviews** - Add new entries with compliance data
4. **Update Regulations and Reports** - Integrate QFC Article violations and fixes

## Usage

### Basic Usage

```javascript
import { processNewReviewApiResponse } from './src/services/apiService';

// When you receive an API response
const apiResponse = {
  compliance_summary: {
    status: "Non-Compliant",
    critical_issues: 5,
    must_fix_items: [
      "Reduce probation period to maximum 3 months",
      "Increase annual leave to 20 working days",
      "Add overtime pay clause at 125%"
    ]
  },
  mandatory_compliance_issues: [
    {
      qfc_article: "Article 18",
      violation: "Probation period exceeds maximum allowed",
      qfc_requires: "Maximum probation period of 3 months",
      fix_required: "Reduce probation period from 6 months to 3 months",
      severity: "Critical"
    }
  ],
  best_practice_recommendations: [...],
  document_inconsistencies: [...]
};

// Process the response
try {
  const result = await processNewReviewApiResponse(apiResponse, {
    company: 'ABC Corporation',
    document_type: 'Employment Contract',
    email: 'contact@abc.com'
  });
  
  console.log('Processing completed:', result);
} catch (error) {
  console.error('Processing failed:', error);
}
```

### Idempotent Processing (for retries/duplicates)

```javascript
import { processNewReviewApiResponseIdempotent } from './src/services/apiService';

// This will detect and handle duplicate responses
const result = await processNewReviewApiResponseIdempotent(apiResponse, metadata);
```

## API Response Structure

The system expects the following structure in the API response:

```json
{
  "compliance_summary": {
    "status": "Non-Compliant | Partially Compliant | Compliant",
    "critical_issues": 5,
    "must_fix_items": [
      "List of items that must be fixed"
    ]
  },
  "mandatory_compliance_issues": [
    {
      "qfc_article": "Article 18",
      "violation": "Description of violation",
      "qfc_requires": "What QFC requires",
      "fix_required": "How to fix the issue",
      "severity": "Critical | High | Medium | Low"
    }
  ],
  "best_practice_recommendations": [
    {
      "area": "Category of recommendation",
      "recommendation": "The recommendation text",
      "impact": "Expected impact description"
    }
  ],
  "document_inconsistencies": [
    {
      "issue": "Description of inconsistency",
      "description": "Detailed description",
      "suggested_solution": "How to resolve"
    }
  ]
}
```

## Component Integration

### Using the Compliance Context

```javascript
import { useCompliance } from './src/contexts/ComplianceContext';

function MyComponent() {
  const {
    // State
    dashboardData,
    reviewsData,
    regulationsData,
    complianceData,
    loading,
    error,
    
    // Actions
    refreshData,
    
    // Computed values
    getTotalReviews,
    getCriticalIssuesCount,
    getComplianceStatus,
    getMustFixItems,
    getKeyIssues,
    getAllViolations,
    getViolationsByArticle
  } = useCompliance();

  return (
    <div>
      <h2>Compliance Status: {getComplianceStatus()}</h2>
      <p>Critical Issues: {getCriticalIssuesCount()}</p>
      <p>Total Reviews: {getTotalReviews()}</p>
      
      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
}
```

## Data Storage

All data is stored locally using localStorage with the following keys:

- `qfc_api_responses` - Complete API responses
- `qfc_compliance_data` - Extracted compliance data
- `qfc_dashboard_data` - Dashboard-specific data
- `qfc_reviews_data` - Reviews data
- `qfc_regulations_data` - Regulations and violations data
- `qfc_audit_trail` - Audit trail of all operations

### Accessing Stored Data

```javascript
import { 
  getStoredResponses, 
  getComplianceData, 
  getDashboardData 
} from './src/services/localStorageService';

// Get all stored API responses
const responses = getStoredResponses();

// Get compliance data
const compliance = getComplianceData();

// Get dashboard data
const dashboard = getDashboardData();
```

## Error Handling

The system includes comprehensive error handling:

```javascript
try {
  const result = await processNewReviewApiResponse(apiResponse, metadata);
} catch (error) {
  // Error is automatically logged and stored for debugging
  console.error('Processing failed:', error.message);
  
  // Error information is stored in local storage for audit
  // UI components will display error states automatically
}
```

## Testing

### Manual Testing

Use the TestApiWorkflow component included in the Dashboard:

1. Navigate to the Dashboard
2. Find the "Test API Response Processing Workflow" section
3. Click "Run Workflow Test"
4. Navigate to other pages to see updated data

### Programmatic Testing

```javascript
import { simulateNewReviewApiResponse } from './src/services/apiService';

// Simulate processing with test data
const result = await simulateNewReviewApiResponse({
  company: 'Test Company',
  document_type: 'Test Document',
  email: 'test@example.com'
});
```

## Implementation Details

### Step-by-Step Processing

1. **Validation**: API response structure is validated
2. **Sanitization**: Missing/null fields are handled gracefully
3. **Storage**: Complete response is stored with metadata
4. **Extraction**: Data is extracted for each section:
   - Dashboard: compliance status, critical issues, must-fix items
   - Reviews: new review entries with compliance data
   - Regulations: QFC Article violations grouped by article
5. **Updates**: All relevant data stores are updated
6. **Notifications**: UI is notified of changes

### Data Flow

```
API Response → Validation → Sanitization → Local Storage
     ↓
Data Extraction → Dashboard Data → Context Update → UI Refresh
     ↓
Reviews Data → Context Update → UI Refresh
     ↓
Regulations Data → Context Update → UI Refresh
```

## Audit Trail

All operations are logged in the audit trail:

```javascript
import { getAuditTrail } from './src/services/localStorageService';

const auditEntries = getAuditTrail();
// Each entry contains: id, timestamp, action, metadata
```

## Performance Considerations

- Data is cached in localStorage for fast access
- Context updates are batched to minimize re-renders
- Large responses are handled efficiently with streaming storage
- Audit trail is automatically trimmed to prevent storage overflow

## Security

- All data is stored locally (no external transmission)
- Input validation prevents malicious data injection
- Audit trails provide complete operation history
- Error information is sanitized before storage

## Maintenance

### Clearing Data

```javascript
import { clearAllStoredData } from './src/services/localStorageService';

// Clear all stored data (for testing/reset)
clearAllStoredData();
```

### Data Export

```javascript
import { getStoredResponses, getAuditTrail } from './src/services/localStorageService';

// Export all data for backup/analysis
const exportData = {
  responses: getStoredResponses(),
  audit: getAuditTrail(),
  timestamp: new Date().toISOString()
};
```

## Troubleshooting

### Common Issues

1. **Missing Data**: Check if API response has required fields
2. **Storage Errors**: Verify localStorage is available and has space
3. **Context Not Updating**: Ensure ComplianceProvider wraps your components
4. **Performance Issues**: Check audit trail size and clear if needed

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('qfc_debug', 'true');
```

This will provide detailed console logging of all operations.