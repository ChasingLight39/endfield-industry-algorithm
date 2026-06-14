/**
 * 渲染图层 z-index 常量表
 *
 * 单点定义，全局引用。所有 SCSS 文件通过 CSS 变量使用，所有 TSX 文件通过 import 使用。
 * 修改此处即可全局调整图层层级，无需逐文件查找。
 */
export const Z_INDEX = {
  // ── Grid 渲染层 ──
  CONNECTIONS_LAYER: 1,
  SUPPLY_RANGE: 5,
  MACHINE_CONTAINER: 10,
  BATCH_MOVE_CONNECTIONS: 12,
  MACHINE_SELECTED: 15,
  GHOST: 20,
  GHOST_ARROW: 25,
  SELECTION_BOX: 100,

  // ── Machine 子元素 ──
  MACHINE_HOVER: 2000,
  MACHINE_LABEL: 1000,
  POWER_ALERT_ICON: 10,

  // ── UI 覆盖层 ──
  HEADER: 1000,
  TOOLBAR: 100,
  OPERATION_HINTS: 90,

  // ── 启动加载画面 ──
  LOADING_SCREEN: 9999,
  LOADING_BAR: 10,
  LOADING_CONTENT: 5,

  // ── 工具提示 ──
  ICON_TOOLTIP: 10,
} as const;
