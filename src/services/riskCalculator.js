/**
 * Risk Calculator Service
 * Calculates patient risk level based on symptoms and pain level
 */

/**
 * Calculate risk level for a patient based on symptoms and pain level
 * @param {string} symptoms - Patient's symptom description
 * @param {string} painLevel - Pain level: 'Low', 'Medium', or 'High'
 * @returns {string} Risk level: 'Low', 'Medium', or 'Critical'
 */
export const calculateRiskLevel = (symptoms, painLevel) => {
  const criticalKeywords = ['chest pain', 'bleeding', 'severe', 'unconscious'];
  const symptomsLower = symptoms.toLowerCase();
  
  // Check for critical keywords in symptoms
  const hasCriticalSymptom = criticalKeywords.some(keyword => 
    symptomsLower.includes(keyword)
  );
  
  // Assign Critical if critical keywords found or pain level is High
  if (hasCriticalSymptom || painLevel === 'High') {
    return 'Critical';
  }
  
  // Assign Medium if pain level is Medium
  if (painLevel === 'Medium') {
    return 'Medium';
  }
  
  // Otherwise assign Low
  return 'Low';
};
