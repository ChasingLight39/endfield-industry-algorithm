import type { Point, Direction } from '@/types';
import { isHorizontal, DIR_RIGHT, DIR_LEFT, DIR_DOWN } from '@/types';
import { Mask } from '@/utils/mask';

/** 尝试单 L 形路径：从 start 沿 firstAxis 走第一段，再垂直走到 end */
export const trySingleLRoute = (
  start: Point,
  end: Point,
  firstAxis: Direction,
  grid: Mask,
  mask: number = 0xFF
): Point[] | null => {
  const path: Point[] = [];
  const gw = grid.width;
  const gh = grid.height;

  const horizontalFirst = isHorizontal(firstAxis);
  const corner: Point = horizontalFirst
    ? { x: end.x, y: start.y }
    : { x: start.x, y: end.y };

  const step1 = firstAxis === DIR_RIGHT ? { x: 1, y: 0 }
    : firstAxis === DIR_LEFT ? { x: -1, y: 0 }
    : firstAxis === DIR_DOWN ? { x: 0, y: 1 }
    : { x: 0, y: -1 };

  let cx = start.x;
  let cy = start.y;

  // 第一段：start → corner
  while (cx !== corner.x || cy !== corner.y) {
    cx += step1.x;
    cy += step1.y;
    if (cx < 0 || cx >= gw || cy < 0 || cy >= gh) return null;
    if (grid.IsBlocked(cx, cy, mask)) return null;
    path.push({ x: cx, y: cy });
  }

  // 第二段：corner → end（垂直方向）
  if (corner.x !== end.x || corner.y !== end.y) {
    const step2 = end.x > corner.x ? { x: 1, y: 0 }
      : end.x < corner.x ? { x: -1, y: 0 }
      : end.y > corner.y ? { x: 0, y: 1 }
      : { x: 0, y: -1 };

    while (cx !== end.x || cy !== end.y) {
      cx += step2.x;
      cy += step2.y;
      if (cx < 0 || cx >= gw || cy < 0 || cy >= gh) return null;
      if (grid.IsBlocked(cx, cy, mask)) return null;
      path.push({ x: cx, y: cy });
    }
  }

  return path;
};
