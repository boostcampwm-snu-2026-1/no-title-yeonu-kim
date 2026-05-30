export type Agreement = {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
};

export const TERMS: Omit<Agreement, 'checked'>[] = [
  { id: 'terms-of-service', label: '이용약관 동의 (필수)', required: true },
  {
    id: 'privacy-policy',
    label: '개인정보 수집 및 이용 동의 (필수)',
    required: true,
  },
  {
    id: 'marketing',
    label: '마케팅 정보 수신 동의 (선택)',
    required: false,
  },
];
