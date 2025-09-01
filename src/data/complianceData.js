// Mock compliance analysis data matching the API response structure

export const mockComplianceAnalysis = {
  mandatory_compliance_issues: [
    {
      violation: "Probation period exceeds QFC maximum of 3 months.",
      qfc_article: "Article 18",
      document_states: "The first six (6) months of employment will be considered a probationary period.",
      qfc_requires: "A probationary period must not exceed 3 months from the date employment commences.",
      fix_required: "Amend the probationary period to a maximum of 3 months."
    },
    {
      violation: "Annual leave entitlement below QFC minimum.",
      qfc_article: "Article 25",
      document_states: "Employees are entitled to 15 working days of annual leave per year.",
      qfc_requires: "Employees must receive at least 20 working days of annual leave per year.",
      fix_required: "Increase annual leave entitlement to at least 20 working days per year."
    },
    {
      violation: "Termination notice period insufficient.",
      qfc_article: "Article 32",
      document_states: "Either party may terminate employment with 2 weeks' notice.",
      qfc_requires: "Termination notice must be at least 30 days after the probationary period.",
      fix_required: "Increase termination notice after probation to at least 30 days."
    },
    {
      violation: "Sick leave entitlement not explicitly stated.",
      qfc_article: "Article 28",
      document_states: "Sick leave provisions are detailed in the HR Manual.",
      qfc_requires: "Employees must be entitled to at least 7 working days of sick leave per year.",
      fix_required: "Explicitly state sick leave entitlement of at least 7 working days per year."
    },
    {
      violation: "Overtime compensation clause missing.",
      qfc_article: "Article 22",
      document_states: "Overtime work may be required as per business needs.",
      qfc_requires: "Overtime work must be compensated at 125% of the normal hourly rate.",
      fix_required: "Add overtime clause specifying pay at 125% of normal hourly rate for overtime work."
    }
  ],
  best_practice_recommendations: [
    {
      area: "Contract Requirements",
      current: "Contract refers to HR Manual for certain terms (like sick leave) and omits some statutory minimums.",
      recommendation: "Include all legally required minimum entitlements (leave, sick leave, overtime, termination notice, etc.) directly in the contract.",
      benefit: "Reduces ambiguity and ensures employees are fully informed of their legal rights and obligations."
    },
    {
      area: "Termination Procedures",
      current: "Contract lacks detailed termination procedures and notice requirements for different scenarios.",
      recommendation: "Add comprehensive termination clause with clear notice periods for resignation, dismissal, and redundancy situations.",
      benefit: "Provides clarity for both employer and employee, reducing potential disputes and ensuring compliance with QFC regulations."
    },
    {
      area: "Performance Management",
      current: "No clear performance evaluation process or disciplinary procedures outlined.",
      recommendation: "Include structured performance review process and progressive disciplinary procedures in line with QFC guidelines.",
      benefit: "Establishes clear expectations and fair processes, protecting both parties and ensuring regulatory compliance."
    },
    {
      area: "Benefits Documentation",
      current: "Employee benefits are referenced but not detailed in the contract.",
      recommendation: "Provide a comprehensive benefits schedule as an appendix to the contract or include detailed descriptions.",
      benefit: "Ensures transparency about total compensation package and reduces misunderstandings about entitlements."
    }
  ],
  document_inconsistencies: [
    {
      issue: "The contract refers employees to the HR Manual for key terms (e.g., sick leave) without summarizing statutory minimums in the contract.",
      problem: "This can create uncertainty about whether statutory rights are being met and may leave employees unaware of their minimum legal entitlements.",
      solution: "Summarize or state all statutory minimums in the contract itself and reference the HR Manual only for additional or company-specific policies."
    },
    {
      issue: "Inconsistent terminology used for 'working days' vs 'calendar days' throughout the document.",
      problem: "This ambiguity can lead to confusion about leave calculations and notice periods, potentially causing disputes.",
      solution: "Use consistent terminology throughout the document and clearly define whether 'days' refers to working days or calendar days in each context."
    },
    {
      issue: "Salary and benefits section references outdated QFC minimum wage rates.",
      problem: "Using outdated rates may result in non-compliance with current QFC minimum wage requirements.",
      solution: "Update all salary references to current QFC minimum wage rates and include a clause for automatic updates when rates change."
    }
  ],
  compliance_summary: {
    status: "Non-Compliant",
    critical_issues: 5,
    must_fix_items: [
      "Reduce probation period to a maximum of 3 months.",
      "Increase annual leave entitlement to at least 20 working days per year.",
      "Increase termination notice after probation to at least 30 days.",
      "Explicitly state sick leave entitlement of at least 7 working days per year.",
      "Add overtime clause specifying pay at 125% of normal hourly rate for overtime work."
    ]
  }
};

// Alternative compliance scenarios for variety
export const compliantAnalysis = {
  mandatory_compliance_issues: [],
  best_practice_recommendations: [
    {
      area: "Contract Clarity",
      current: "Contract meets all QFC requirements but could benefit from clearer language in some sections.",
      recommendation: "Consider simplifying technical language to improve employee understanding while maintaining legal precision.",
      benefit: "Enhanced employee comprehension leads to better compliance and fewer misunderstandings."
    }
  ],
  document_inconsistencies: [],
  compliance_summary: {
    status: "Compliant",
    critical_issues: 0,
    must_fix_items: []
  }
};

export const partiallyCompliantAnalysis = {
  mandatory_compliance_issues: [
    {
      violation: "Sick leave policy lacks specific entitlement details.",
      qfc_article: "Article 28",
      document_states: "Sick leave will be provided as per QFC requirements.",
      qfc_requires: "Employees must be entitled to at least 7 working days of sick leave per year.",
      fix_required: "Specify the exact number of sick leave days (minimum 7 working days per year)."
    },
    {
      violation: "Overtime compensation rate not specified.",
      qfc_article: "Article 22",
      document_states: "Overtime will be compensated fairly.",
      qfc_requires: "Overtime work must be compensated at 125% of the normal hourly rate.",
      fix_required: "Specify overtime rate as 125% of normal hourly rate."
    }
  ],
  best_practice_recommendations: [
    {
      area: "Policy Integration",
      current: "Some policies are well-integrated while others reference external documents.",
      recommendation: "Standardize policy integration approach throughout the contract.",
      benefit: "Consistent approach improves clarity and reduces potential for confusion."
    }
  ],
  document_inconsistencies: [
    {
      issue: "Mixed use of 'business days' and 'working days' terminology.",
      problem: "Inconsistent terminology may cause confusion in leave calculations.",
      solution: "Use 'working days' consistently throughout the document and define the term clearly."
    }
  ],
  compliance_summary: {
    status: "Partially Compliant",
    critical_issues: 2,
    must_fix_items: [
      "Specify exact sick leave entitlement (minimum 7 working days per year).",
      "Add overtime compensation rate of 125% of normal hourly rate."
    ]
  }
};

// Function to get random compliance data for demo purposes
export const getRandomComplianceData = () => {
  const scenarios = [mockComplianceAnalysis, compliantAnalysis, partiallyCompliantAnalysis];
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};