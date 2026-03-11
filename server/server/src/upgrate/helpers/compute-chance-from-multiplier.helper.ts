export function computeChanceFromMultiplier(multiplier: number): number {
  const chanceRaw = 0.5 / multiplier;
  return Math.min(0.99, Math.max(0.01, chanceRaw));
}

