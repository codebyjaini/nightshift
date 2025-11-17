import { describe, test, expect } from 'vitest';
import { calculateRiskLevel } from './riskCalculator';

describe('Risk Calculator', () => {
  // Test critical keyword detection
  test('assigns Critical for chest pain symptom', () => {
    expect(calculateRiskLevel('I have chest pain', 'Low')).toBe('Critical');
  });

  test('assigns Critical for bleeding symptom', () => {
    expect(calculateRiskLevel('I am bleeding heavily', 'Low')).toBe('Critical');
  });

  test('assigns Critical for severe symptom', () => {
    expect(calculateRiskLevel('I have severe abdominal pain', 'Low')).toBe('Critical');
  });

  test('assigns Critical for unconscious symptom', () => {
    expect(calculateRiskLevel('Patient was unconscious', 'Low')).toBe('Critical');
  });

  // Test High pain level assignment
  test('assigns Critical for High pain level', () => {
    expect(calculateRiskLevel('I have a headache', 'High')).toBe('Critical');
  });

  test('assigns Critical for High pain level even with non-critical symptoms', () => {
    expect(calculateRiskLevel('Minor discomfort', 'High')).toBe('Critical');
  });

  // Test Medium pain level assignment
  test('assigns Medium for Medium pain level', () => {
    expect(calculateRiskLevel('I have a headache', 'Medium')).toBe('Medium');
  });

  test('assigns Medium for Medium pain level without critical keywords', () => {
    expect(calculateRiskLevel('Stomach ache and nausea', 'Medium')).toBe('Medium');
  });

  // Test Low pain level assignment
  test('assigns Low for Low pain level', () => {
    expect(calculateRiskLevel('I have a mild headache', 'Low')).toBe('Low');
  });

  test('assigns Low for Low pain level without critical keywords', () => {
    expect(calculateRiskLevel('Minor discomfort in my arm', 'Low')).toBe('Low');
  });

  // Test case insensitivity
  test('detects critical keywords case-insensitively', () => {
    expect(calculateRiskLevel('CHEST PAIN', 'Low')).toBe('Critical');
    expect(calculateRiskLevel('Bleeding', 'Low')).toBe('Critical');
    expect(calculateRiskLevel('SEVERE pain', 'Low')).toBe('Critical');
  });
});
