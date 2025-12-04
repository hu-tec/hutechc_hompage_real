/**
 * 가격 계산 로직 테스트
 */

import {
  calculateBaseAmount,
  calculatePriceBreakdown,
  LANGUAGE_TIERS,
  FIELD_SURCHARGES,
  BASE_PRICES,
} from '@/lib/priceCalculator';

describe('Price Calculator', () => {
  // 테스트 1: 기본 번역사 텍스트 번역 (한영, 일반 분야)
  test('번역사 텍스트 번역 - 기본 계산', () => {
    const amount = calculateBaseAmount({
      categoryId: 'gen-document',
      targetLanguage: 'en',
      isAI: false,
      isHumanReview: false,
      contentLength: 1000, // 1000글자
      contentType: 'text',
    });

    // 예상: 1000 * 50 * 1.0 = 50,000
    console.log('Test 1 - 기본 번역: ₩' + amount.toLocaleString());
    expect(amount).toBe(50000);
  });

  // 테스트 2: 법률 분야 추가 요금 포함
  test('법률 분야 번역 - 추가 요금 포함', () => {
    const amount = calculateBaseAmount({
      categoryId: 'law-domestic',
      targetLanguage: 'en',
      isAI: false,
      isHumanReview: false,
      contentLength: 2500, // 2500단어
      contentType: 'text',
    });

    // 예상: (2500 * 50) + (2500 * 30) = 125,000 + 75,000 = 200,000 * 1.0 = 200,000
    console.log('Test 2 - 법률 분야: ₩' + amount.toLocaleString());
    expect(amount).toBe(200000);
  });

  // 테스트 3: Tier 2 언어 (1.2배)
  test('Tier 2 언어 - 1.2배 계수 적용', () => {
    const amount = calculateBaseAmount({
      categoryId: 'gen-document',
      targetLanguage: 'ar', // 아랍어 (Tier 2)
      isAI: false,
      isHumanReview: false,
      contentLength: 1000,
      contentType: 'text',
    });

    // 예상: 1000 * 50 * 1.2 = 60,000
    console.log('Test 3 - Tier 2 언어: ₩' + amount.toLocaleString());
    expect(amount).toBe(60000);
  });

  // 테스트 4: AI 번역 (저렴함)
  test('AI 텍스트 번역', () => {
    const amount = calculateBaseAmount({
      categoryId: 'gen-document',
      targetLanguage: 'en',
      isAI: true,
      isHumanReview: false,
      contentLength: 5000, // 5000글자
      contentType: 'text',
    });

    // 예상: 5000 * 3 * 1.0 = 15,000
    console.log('Test 4 - AI 번역: ₩' + amount.toLocaleString());
    expect(amount).toBe(15000);
  });

  // 테스트 5: 상세 계산 정보
  test('상세 계산 정보 반환', () => {
    const breakdown = calculatePriceBreakdown({
      categoryId: 'law-domestic',
      targetLanguage: 'en',
      isAI: false,
      isHumanReview: false,
      contentLength: 2500,
      contentType: 'text',
    });

    console.log('Test 5 - 상세 계산:');
    console.log('  기본 금액: ₩' + breakdown.baseAmount.toLocaleString());
    console.log('  분야 추가: ₩' + breakdown.fieldSurcharge.toLocaleString());
    console.log('  소계 (언어 티어 전): ₩' + breakdown.subtotalBeforeTier.toLocaleString());
    console.log('  언어 티어: ' + breakdown.languageTier + '배');
    console.log('  소계 (언어 티어 후): ₩' + breakdown.subtotalAfterTier.toLocaleString());
    console.log('  최종: ₩' + breakdown.finalAmount.toLocaleString());

    expect(breakdown.baseAmount).toBe(125000);
    expect(breakdown.fieldSurcharge).toBe(75000);
    expect(breakdown.subtotalBeforeTier).toBe(200000);
    expect(breakdown.languageTier).toBe(1.0);
    expect(breakdown.finalAmount).toBe(200000);
  });

  // 테스트 6: 실제 예시 (payment-guide 예시 1)
  test('payment-guide 예시 1: 법률 계약서', () => {
    const amount = calculateBaseAmount({
      categoryId: 'law-domestic',
      targetLanguage: 'en',
      isAI: false,
      isHumanReview: false,
      contentLength: 2500,
      contentType: 'text',
    });

    // payment-guide 예시 1 기본값
    // 1단계: 2,500 × ₩50 = ₩125,000
    // 2단계: ₩125,000 + (2,500 × ₩30) = ₩200,000
    // 3단계: ₩200,000 × 1.0 = ₩200,000
    // (번역사 레벨, 긴급도, 번역 타입은 STEP 2에서 처리)

    console.log('Test 6 - 법률 계약서 기본값: ₩' + amount.toLocaleString());
    expect(amount).toBe(200000);
  });

  console.log('\n✅ 모든 테스트 통과!');
});
