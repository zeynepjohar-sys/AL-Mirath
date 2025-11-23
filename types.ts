export enum HeirType {
  HUSBAND = 'Husband',
  WIFE = 'Wife',
  SON = 'Son',
  DAUGHTER = 'Daughter',
  FATHER = 'Father',
  MOTHER = 'Mother',
  PATERNAL_GRANDFATHER = 'Paternal Grandfather',
  PATERNAL_GRANDMOTHER = 'Paternal Grandmother',
  MATERNAL_GRANDMOTHER = 'Maternal Grandmother',
  FULL_BROTHER = 'Full Brother',
  FULL_SISTER = 'Full Sister',
  PATERNAL_BROTHER = 'Paternal Brother',
  PATERNAL_SISTER = 'Paternal Sister',
  MATERNAL_BROTHER = 'Maternal Brother',
  MATERNAL_SISTER = 'Maternal Sister',
}

export interface HeirInput {
  type: HeirType;
  count: number;
}

export interface CalculatedShare {
  heirType: string;
  count: number;
  shareFraction: string;
  sharePercentage: number;
  shareAmount: number;
  description: string;
}

export interface CalculationResult {
  shares: CalculatedShare[];
  totalEstate: number;
  remainingEstate: number;
  explanation: string;
}

export const HEIR_LIMITS: Record<HeirType, number> = {
  [HeirType.HUSBAND]: 1,
  [HeirType.WIFE]: 4,
  [HeirType.FATHER]: 1,
  [HeirType.MOTHER]: 1,
  [HeirType.PATERNAL_GRANDFATHER]: 1,
  [HeirType.PATERNAL_GRANDMOTHER]: 1,
  [HeirType.MATERNAL_GRANDMOTHER]: 1,
  [HeirType.SON]: 20,
  [HeirType.DAUGHTER]: 20,
  [HeirType.FULL_BROTHER]: 20,
  [HeirType.FULL_SISTER]: 20,
  [HeirType.PATERNAL_BROTHER]: 20,
  [HeirType.PATERNAL_SISTER]: 20,
  [HeirType.MATERNAL_BROTHER]: 20,
  [HeirType.MATERNAL_SISTER]: 20,
};

export type CurrencyCode = 'EGP' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED';
