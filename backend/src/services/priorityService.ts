const PRIORITY_CONFIG = {
  NORMAL: 1,
  EXPRESS: 3,
  AGING_RATE: 0.5
} as const;

export const getBasePriority = (
  orderType: "NORMAL" | "EXPRESS"
): number => {
  return PRIORITY_CONFIG[orderType];
};

export const calculateEffectivePriority = (
  basePriority: number,
  waitingTimeMinutes: number
): number => {
  return basePriority + PRIORITY_CONFIG.AGING_RATE * waitingTimeMinutes;
};