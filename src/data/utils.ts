// ================================
// ユーティリティ関数
// ================================

import { eraDefinitions, eraSubPeriodsByRegion } from "./eraDefinitions";
import type { EraId, SubPeriod, RegionId } from "./types";

/**
 * 指定した地域と時代区分のサブ時代一覧を取得
 * @param regionId - 地域ID（例: "japaneseArchipelago", "yellowRiver"）
 * @param eraId - 時代区分ID（例: "prehistoric", "ancient"）
 * @returns サブ時代の配列
 */
export function getSubPeriods(regionId: RegionId, eraId: EraId): SubPeriod[] {
  return eraSubPeriodsByRegion[regionId][eraId].subPeriods;
}

/**
 * 指定した地域、時代区分、サブ時代IDから詳細情報を取得
 * @param regionId - 地域ID
 * @param eraId - 時代区分ID
 * @param subPeriodId - サブ時代ID
 * @returns サブ時代の詳細情報、見つからない場合はundefined
 */
export function getSubPeriod(
  regionId: RegionId,
  eraId: EraId,
  subPeriodId: string,
): SubPeriod | undefined {
  const subPeriods = getSubPeriods(regionId, eraId);
  return subPeriods.find((sp) => sp.id === subPeriodId);
}

/**
 * 指定した地域の全時代区分における全サブ時代を取得
 * @param regionId - 地域ID
 * @returns 全サブ時代の配列
 */
export function getAllSubPeriodsForRegion(regionId: RegionId): SubPeriod[] {
  const result: SubPeriod[] = [];

  // eraDefinitions を正として回す（Object.keysのキャストを避ける）
  for (const era of eraDefinitions) {
    const subPeriods = eraSubPeriodsByRegion[regionId][era.id].subPeriods;
    result.push(...subPeriods);
  }

  return result;
}

/**
 * 時代区分IDから時代区分の詳細情報を取得
 * @param eraId - 時代区分ID
 * @returns 時代区分の詳細情報、見つからない場合はundefined
 */
export function getEraDefinition(eraId: EraId) {
  return eraDefinitions.find((era) => era.id === eraId);
}

/**
 * 指定した年が属する時代区分を取得
 * @param year - 年（紀元前はマイナス）
 * @returns 該当する時代区分、見つからない場合はundefined
 */
export function getEraByYear(year: number) {
  return eraDefinitions.find((era) => {
    const afterStart = year >= era.startYear;
    const beforeEnd = era.endYear === null || year <= era.endYear;
    return afterStart && beforeEnd;
  });
}

/**
 * 指定した地域、時代区分、年から該当するサブ時代を取得
 * @param regionId - 地域ID
 * @param eraId - 時代区分ID
 * @param year - 年（紀元前はマイナス）
 * @returns 該当するサブ時代の配列
 */
export function getSubPeriodsByYear(
  regionId: RegionId,
  eraId: EraId,
  year: number,
): SubPeriod[] {
  const subPeriods = getSubPeriods(regionId, eraId);
  return subPeriods.filter((sp) => {
    const afterStart = year >= sp.defaultStartYear;
    const beforeEnd = sp.defaultEndYear === null || year <= sp.defaultEndYear;
    return afterStart && beforeEnd;
  });
}

/**
 * 指定した地域と年から該当するサブ時代を取得（全時代区分から検索）
 * @param regionId - 地域ID
 * @param year - 年（紀元前はマイナス）
 * @returns 該当するサブ時代の配列
 */
export function getAllSubPeriodsByYear(
  regionId: RegionId,
  year: number,
): SubPeriod[] {
  const allSubPeriods = getAllSubPeriodsForRegion(regionId);
  return allSubPeriods.filter((sp) => {
    const afterStart = year >= sp.defaultStartYear;
    const beforeEnd = sp.defaultEndYear === null || year <= sp.defaultEndYear;
    return afterStart && beforeEnd;
  });
}
