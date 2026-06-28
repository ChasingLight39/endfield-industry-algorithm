import type { Point, Direction, PortType, PlacedMachine, Connection } from '@/types';
import { sideToDir, oppositeDir, DIR_UP, DIR_DOWN, DIR_RIGHT, DIR_LEFT } from '@/types';
import { trySingleLRoute } from './pathfinding';
import { computeHeadFacing, dirFromPoints } from './direction';
import { getInputPortOuterCells } from './port';
import { getCornerPoints } from './port';
import { Mask } from '@/utils/mask';

/**
 * portDir 的垂直方向（取两个垂直方向中与目标更接近的那个）
 */
const perpendicularDir = (dir: Direction, start: Point, end: Point): Direction => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dir === DIR_UP || dir === DIR_DOWN) {
    // 垂直端口(上/下)，垂直方向是水平
    return dx > 0 ? DIR_RIGHT : dx < 0 ? DIR_LEFT : DIR_RIGHT;
  }
  // 水平端口(左/右)，垂直方向是垂直
  return dy > 0 ? DIR_DOWN : dy < 0 ? DIR_UP : DIR_DOWN;
};

/**
 * 检查路径上的桥冲突与拐弯约束
 * @returns true = 无冲突，路径合法
 */
export const validateRouteConflicts = (
  fullPath: Point[],
  tailFacing: Direction,
  headFacing: Direction,
  sameConnGrid: Mask,
  mergedGrid: Mask,
  existingCornerGrid: Mask,
  bridgeMask: number,
  connMask: number,
  options: { isContinuing: boolean; startPos: Point }
): boolean => {
  const { isContinuing, startPos } = options;
  const gw = sameConnGrid.width;
  const gh = sameConnGrid.height;

  // 拐弯点在同类型连线上的检查（自动续接时豁免起点格）
  for (const cp of getCornerPoints(fullPath, tailFacing, headFacing)) {
    if (isContinuing && cp.x === startPos.x && cp.y === startPos.y) continue;
    if (cp.x >= 0 && cp.x < gw && cp.y >= 0 && cp.y < gh
        && sameConnGrid.get(cp.x, cp.y)) {
      return false;
    }
  }

  // 桥掩码冲突检查 (物理冲突 + 拐弯约束)
  for (const p of fullPath) {
    if (isContinuing && p.x === startPos.x && p.y === startPos.y) continue;
    if (p.x < 0 || p.x >= gw || p.y < 0 || p.y >= gh) continue;
    if (!sameConnGrid.get(p.x, p.y)) continue;
    // 物理冲突: (bridgeMask & cellMask) 不能超出同类型连线层
    const cellMask = mergedGrid.get(p.x, p.y) | connMask;
    if ((bridgeMask & cellMask) !== connMask) return false;
    // 拐弯约束: 桥不能放在已有线的拐弯上
    if (existingCornerGrid.get(p.x, p.y)) return false;
  }

  return true;
};

/**
 * 检查新连线起点是否与已有同类型连线同向/反向重叠
 * 续接模式豁免（起点有意与上一段重合）
 * @returns true = 无重叠，可以继续；false = 重叠，路径非法
 */
export const checkStartOverlap = (
  startPos: Point,
  tailFacing: Direction,
  connections: Connection[],
  portType: PortType,
  isContinuing: boolean,
): boolean => {
  if (isContinuing) return true;

  const oppositeFacing = oppositeDir(tailFacing);
  for (const c of connections) {
    if (c.portType !== portType) continue;
    for (let i = 0; i < c.path.length; i++) {
      if (c.path[i].x !== startPos.x || c.path[i].y !== startPos.y) continue;
      // 出方向
      if (i < c.path.length - 1) {
        const outDir = dirFromPoints(c.path[i], c.path[i + 1]);
        if (outDir === tailFacing || outDir === oppositeFacing) return false;
      }
      // 入方向
      if (i > 0) {
        const inDir = dirFromPoints(c.path[i - 1], c.path[i]);
        if (inDir === tailFacing || inDir === oppositeFacing) return false;
      }
      break;
    }
  }
  return true;
};

export interface RouteToMachineResult {
  path: Point[];
  headFacing: Direction;
  isValid: boolean;
  targetIsMachine: boolean;
}

/**
 * 尝试从 startPos 连接到目标机器的输入端口
 * 遍历所有匹配类型的输入端口，尝试 L 形路径，检查冲突
 * 若无合法路径则返回忽略障碍的视觉 fallback 路径
 */
export const findRouteForMachine = (
  startPos: Point,
  tailFacing: Direction,
  targetMachine: PlacedMachine,
  targetPortType: PortType,
  lShapeMode: 'auto' | 'perpendicular' | 'same-dir',
  mergedGrid: Mask,
  sameConnGrid: Mask,
  existingCornerGrid: Mask,
  bridgeMask: number,
  connMask: number,
  gh: number,
  isContinuing: boolean,
  mouseGridPos: Point
): RouteToMachineResult => {
  const inputCells = getInputPortOuterCells(targetMachine, targetPortType);
  const gw = mergedGrid.width;

  // ── 第一轮：尝试找到合法路径 ──
  let bestInput: { pos: Point; side: 'top' | 'right' | 'bottom' | 'left'; path: Point[] } | null = null;
  let bestInputDist = Infinity;

  for (const ic of inputCells) {
    const firstAxis = lShapeMode === 'perpendicular'
      ? perpendicularDir(tailFacing, startPos, ic.pos)
      : tailFacing;

    // 起终点相同：检查是否能放桥
    if (startPos.x === ic.pos.x && startPos.y === ic.pos.y) {
      if (mergedGrid.IsBlocked(startPos.x, startPos.y, connMask)) continue;

      const entryDir = oppositeDir(sideToDir[ic.side]);
      // 非续接时拐弯在同类型线上 → 不放桥（续接首格豁免）
      if (!isContinuing && sameConnGrid.get(startPos.x, startPos.y) && tailFacing !== entryDir) {
        continue;
      }
      // 桥掩码冲突检查
      if (sameConnGrid.get(startPos.x, startPos.y)) {
        const cellMask = mergedGrid.get(startPos.x, startPos.y) | connMask;
        if ((bridgeMask & cellMask) !== connMask) continue;
        if (existingCornerGrid.get(startPos.x, startPos.y)) continue;
      }
      bestInput = { pos: ic.pos, side: ic.side, path: [startPos] };
      bestInputDist = 0;
      break;
    }

    // 起点被阻挡 → 跳过
    if (mergedGrid.IsBlocked(startPos.x, startPos.y, connMask)) continue;

    let path = trySingleLRoute(startPos, ic.pos, firstAxis, mergedGrid, connMask);
    if (!path && lShapeMode === 'auto') {
      path = trySingleLRoute(startPos, ic.pos, perpendicularDir(tailFacing, startPos, ic.pos), mergedGrid, connMask);
    }
    if (!path) continue;

    const fullPath = [startPos, ...path];
    const entryDir = oppositeDir(sideToDir[ic.side]);

    if (!validateRouteConflicts(fullPath, tailFacing, entryDir, sameConnGrid, mergedGrid,
        existingCornerGrid, bridgeMask, connMask, { isContinuing, startPos })) {
      continue;
    }

    const dist = Math.abs(ic.pos.x - mouseGridPos.x) + Math.abs(ic.pos.y - mouseGridPos.y);
    if (dist < bestInputDist) {
      bestInputDist = dist;
      bestInput = { pos: ic.pos, side: ic.side, path: fullPath };
    }
  }

  if (bestInput) {
    const headFacing = oppositeDir(sideToDir[bestInput.side]);
    return { path: bestInput.path, headFacing, isValid: true, targetIsMachine: true };
  }

  // ── 无合法路径：忽略障碍计算 L 形路径用于视觉预览 ──
  const emptyGrid = Mask.Uniform(gw, gh, 0);
  let bestVisual: { path: Point[]; headFacing: Direction; dist: number } | null = null;

  for (const ic of inputCells) {
    if (startPos.x === ic.pos.x && startPos.y === ic.pos.y) {
      bestVisual = { path: [startPos], headFacing: oppositeDir(sideToDir[ic.side]), dist: 0 };
      break;
    }
    const firstAxis = lShapeMode === 'perpendicular'
      ? perpendicularDir(tailFacing, startPos, ic.pos)
      : tailFacing;
    const p = trySingleLRoute(startPos, ic.pos, firstAxis, emptyGrid);
    if (p) {
      const d = Math.abs(ic.pos.x - mouseGridPos.x) + Math.abs(ic.pos.y - mouseGridPos.y);
      const hf = oppositeDir(sideToDir[ic.side]);
      if (!bestVisual || d < bestVisual.dist) {
        bestVisual = { path: [startPos, ...p], headFacing: hf, dist: d };
      }
    }
  }

  return {
    path: bestVisual?.path ?? [startPos, mouseGridPos],
    headFacing: bestVisual?.headFacing ?? tailFacing,
    isValid: false,
    targetIsMachine: false,
  };
};

export interface RouteToGroundResult {
  path: Point[];
  headFacing: Direction;
  isValid: boolean;
}

/**
 * 尝试从 startPos 连接到地面目标位置
 * 尝试 L 形路径，检查冲突，若被阻挡则返回视觉 fallback 路径
 */
export const findRouteToGround = (
  startPos: Point,
  tailFacing: Direction,
  targetPos: Point,
  lShapeMode: 'auto' | 'perpendicular' | 'same-dir',
  mergedGrid: Mask,
  sameConnGrid: Mask,
  existingCornerGrid: Mask,
  bridgeMask: number,
  connMask: number,
  gh: number,
  isContinuing: boolean
): RouteToGroundResult => {
  const firstAxis = lShapeMode === 'perpendicular'
    ? perpendicularDir(tailFacing, startPos, targetPos)
    : tailFacing;
  const gw = mergedGrid.width;

  // 视觉 fallback（忽略障碍的 L 形路径，用于被阻挡时的预览显示）
  const visualFallback = (): RouteToGroundResult => {
    const emptyGrid = Mask.Uniform(gw, gh, 0);
    const visualPath = trySingleLRoute(startPos, targetPos, firstAxis, emptyGrid);
    if (visualPath) {
      const visualFullPath = [startPos, ...visualPath];
      return { path: visualFullPath, headFacing: computeHeadFacing(visualFullPath, tailFacing), isValid: false };
    }
    return { path: [startPos, targetPos], headFacing: tailFacing, isValid: false };
  };

  // 起点自身被阻挡 → 视觉 fallback（避免跳到斜线）
  if (mergedGrid.IsBlocked(startPos.x, startPos.y, connMask)) {
    return visualFallback();
  }

  let path = trySingleLRoute(startPos, targetPos, firstAxis, mergedGrid, connMask);
  if (!path && lShapeMode === 'auto') {
    path = trySingleLRoute(startPos, targetPos, perpendicularDir(tailFacing, startPos, targetPos), mergedGrid, connMask);
  }

  if (path) {
    const fullPath = [startPos, ...path];
    const headFacing = computeHeadFacing(fullPath, tailFacing);
    const valid = validateRouteConflicts(fullPath, tailFacing, headFacing, sameConnGrid, mergedGrid,
        existingCornerGrid, bridgeMask, connMask, { isContinuing, startPos });
    return { path: fullPath, headFacing, isValid: valid };
  }

  // 真实路径被阻挡 → 视觉 fallback
  return visualFallback();
};
