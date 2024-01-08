import { IndependentReport } from "../room.interface";

export function playerWIthHigherProperty(
  independentReport: IndependentReport[],
  propertyName: keyof IndependentReport
): string | null {
  const result = independentReport.reduce(
    (acc, pr) => {
      const property = pr[propertyName];
      if (typeof property !== "number")
        throw new Error(`Property ${propertyName} is not a number`);
      if (property > acc.highest)
        return {
          highest: property,
          hasRepeated: false,
          nickname: pr.nickname,
        };
      if (property === acc.highest)
        return { ...acc, hasRepeated: true, nickname: null };
      return acc;
    },
    { highest: -1, hasRepeated: false, nickname: null }
  );
  return result.hasRepeated ? null : result.nickname;
}
