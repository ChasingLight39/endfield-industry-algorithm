/**
 * CSS 自定义属性的 TypeScript 类型约束
 *
 * Machine.tsx 设置 --x/--y/--w/--h 四个变量，Machine.scss 通过
 * calc(var(--x) * var(--grid-size)) 消费。此处提供类型安全的工厂函数，
 * 替代 as React.CSSProperties 强制转换。
 */

/** Machine.tsx 设置到 .machine-container 上的 CSS 自定义属性 */
export interface MachinePositionCSS {
  /** 格子列索引 */
  '--x': number;
  /** 格子行索引 */
  '--y': number;
  /** 旋转后宽度（格子数） */
  '--w': number;
  /** 旋转后高度（格子数） */
  '--h': number;
}

/** 创建机器定位 CSS 自定义属性对象，带类型约束 */
export const machinePositionStyle = (x: number, y: number, w: number, h: number): MachinePositionCSS => ({
  '--x': x,
  '--y': y,
  '--w': w,
  '--h': h,
});
