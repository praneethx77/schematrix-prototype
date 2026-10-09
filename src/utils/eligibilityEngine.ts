import { CitizenProfile, Scheme } from '../types';

export interface EligibilityEvaluation {
  isEligible: boolean;
  matchScore: number; // 0 to 100
  criteriaChecks: Array<{
    name: string;
    passed: boolean;
    citizenValue: string;
    requiredValue: string;
    description: string;
  }>;
  missingDocuments: string[];
  recommendationReason: string;
}

export function evaluateEligibility(
  profile: CitizenProfile,
  scheme: Scheme,
  citizenDocs: string[] = []
): EligibilityEvaluation {
  const rules = scheme.eligibilityRules;
  const checks: EligibilityEvaluation['criteriaChecks'] = [];

  let passedPoints = 0;
  let totalPoints = 0;

  // 1. Age Rule
  if (rules.minAge !== undefined || rules.maxAge !== undefined) {
    totalPoints += 1;
    const min = rules.minAge ?? 0;
    const max = rules.maxAge ?? 120;
    const passed = profile.age >= min && profile.age <= max;
    if (passed) passedPoints += 1;
    checks.push({
      name: 'Age Requirement',
      passed,
      citizenValue: `${profile.age} years old`,
      requiredValue: `${min} - ${max} years`,
      description: passed
        ? `Your age (${profile.age}) meets the scheme criteria.`
        : `Applicant must be between ${min} and ${max} years old.`
    });
  }

  // 2. Gender Rule
  if (rules.genderAllowed && rules.genderAllowed !== 'All') {
    totalPoints += 1;
    const passed = profile.gender === rules.genderAllowed;
    if (passed) passedPoints += 1;
    checks.push({
      name: 'Gender Eligibility',
      passed,
      citizenValue: profile.gender,
      requiredValue: rules.genderAllowed,
      description: passed
        ? `Gender matches scheme specification (${rules.genderAllowed}).`
        : `This scheme is exclusively reserved for ${rules.genderAllowed} citizens.`
    });
  }

  // 3. Occupation Rule
  if (rules.allowedOccupations && rules.allowedOccupations.length > 0) {
    totalPoints += 1.5;
    const passed = rules.allowedOccupations.includes(profile.occupation);
    if (passed) passedPoints += 1.5;
    checks.push({
      name: 'Occupation / Livelihood',
      passed,
      citizenValue: profile.occupation,
      requiredValue: rules.allowedOccupations.join(', '),
      description: passed
        ? `Your occupation (${profile.occupation}) is eligible.`
        : `Targeted towards: ${rules.allowedOccupations.join(', ')}.`
    });
  }

  // 4. Annual Income Rule
  if (rules.maxIncome !== undefined) {
    totalPoints += 1.5;
    const passed = profile.annualIncome <= rules.maxIncome;
    if (passed) passedPoints += 1.5;
    checks.push({
      name: 'Annual Family Income',
      passed,
      citizenValue: `₹${profile.annualIncome.toLocaleString('en-IN')}`,
      requiredValue: `Max ₹${rules.maxIncome.toLocaleString('en-IN')}`,
      description: passed
        ? `Income ₹${profile.annualIncome.toLocaleString('en-IN')} is within the upper ceiling of ₹${rules.maxIncome.toLocaleString('en-IN')}.`
        : `Exceeds the maximum income limit of ₹${rules.maxIncome.toLocaleString('en-IN')}.`
    });
  }

  // 5. Category (Caste / Social Reservation) Rule
  if (rules.allowedCategories && rules.allowedCategories.length > 0) {
    totalPoints += 1;
    const passed = rules.allowedCategories.includes(profile.category);
    if (passed) passedPoints += 1;
    checks.push({
      name: 'Social Category',
      passed,
      citizenValue: profile.category,
      requiredValue: rules.allowedCategories.join(', '),
      description: passed
        ? `Your social group (${profile.category}) is entitled.`
        : `Applicable for: ${rules.allowedCategories.join(', ')}.`
    });
  }

  // 6. BPL Condition
  if (rules.requiresBPL) {
    totalPoints += 1;
    const passed = profile.isBPL;
    if (passed) passedPoints += 1;
    checks.push({
      name: 'Poverty Line Status (BPL / NFSA)',
      passed,
      citizenValue: profile.isBPL ? 'Yes (BPL Cardholder)' : 'No (Non-BPL)',
      requiredValue: 'Requires BPL status',
      description: passed
        ? 'Verified BPL / Antyodaya ration card category.'
        : 'Priority assistance strictly reserved for BPL cardholders.'
    });
  }

  // 7. Disability Condition
  if (rules.requiresDisability) {
    totalPoints += 1;
    const passed = profile.isDisability;
    if (passed) passedPoints += 1;
    checks.push({
      name: 'Differently Abled (PwD)',
      passed,
      citizenValue: profile.isDisability ? 'Yes (PwD)' : 'No',
      requiredValue: 'Differently Abled (40%+ disability certificate)',
      description: passed
        ? 'UDID disability certification verified.'
        : 'Scheme requires registered PwD disability card.'
    });
  }

  // 8. Land Holding Rule
  if (rules.allowedLandHolding && rules.allowedLandHolding.length > 0) {
    totalPoints += 1;
    const passed = rules.allowedLandHolding.includes(profile.landholding);
    if (passed) passedPoints += 1;
    checks.push({
      name: 'Agricultural Land Holding',
      passed,
      citizenValue: profile.landholding,
      requiredValue: rules.allowedLandHolding.join(', '),
      description: passed
        ? `Land ownership (${profile.landholding}) is compliant with threshold.`
        : `Requires cultivable land in range: ${rules.allowedLandHolding.join(', ')}.`
    });
  }

  // 9. State restriction
  if (scheme.level === 'State' && scheme.stateSpecific) {
    totalPoints += 1;
    const passed = profile.state.toLowerCase() === scheme.stateSpecific.toLowerCase();
    if (passed) passedPoints += 1;
    checks.push({
      name: 'State Domicile',
      passed,
      citizenValue: profile.state,
      requiredValue: scheme.stateSpecific,
      description: passed
        ? `Resident of ${scheme.stateSpecific}.`
        : `This state scheme is designated for residents of ${scheme.stateSpecific}.`
    });
  }

  // Calculate score
  const matchScore = totalPoints > 0 ? Math.round((passedPoints / totalPoints) * 100) : 100;
  // Fully eligible if all mandatory checks passed
  const isEligible = checks.every((c) => c.passed);

  // Missing documents
  const missingDocuments = scheme.requiredDocuments.filter((doc) => !citizenDocs.includes(doc));

  // Recommendation reasoning string (Strict rule: Never guarantee eligibility)
  let recommendationReason = '';
  if (isEligible) {
    recommendationReason = `Likely Preliminary Match (Criteria Met). Based on your declared profile as a ${profile.occupation} in ${profile.state}, you satisfy the initial criteria checks. Final approval is determined solely by the competent government authority.`;
  } else if (matchScore >= 60) {
    const failedCheck = checks.find((c) => !c.passed);
    recommendationReason = `Potential Match (${matchScore}%). Unmet requirement: ${failedCheck?.description || 'Verify criteria'}. Final eligibility is never guaranteed.`;
  } else {
    const failedChecks = checks.filter((c) => !c.passed);
    recommendationReason = `Unmet Requirements (${matchScore}%). Not eligible based on current profile: ${failedChecks[0]?.description || 'Multiple rules unmet'}.`;
  }

  return {
    isEligible,
    matchScore,
    criteriaChecks: checks,
    missingDocuments,
    recommendationReason
  };
}
