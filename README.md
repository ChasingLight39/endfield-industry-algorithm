# 菲比拉基建 — 终末地蓝图工具

《明日方舟：终末地》网页版基建规划工具，用于规划工厂布局、管理蓝图、生成分享链接。

**[在线体验](https://zmd-bp-tool.pages.dev/)**

## 主要功能

- **可视化编辑器**：基于 DOM 的网格画布，支持缩放/平移，机器放置、旋转、传送带与管道连接
- **43 台机器**：涵盖核心、物流、仓储存取、基础生产、合成制造、电力六大分类
- **智能连线**：L 形曼哈顿路由自动寻路，点击端口自动吸附，自动放置物流桥/管道桥，支持续接
- **蓝图系统**：保存/加载蓝图到本地，支持框选+批量移动/复制/删除，V3 紧凑二进制分享链接
- **撤销/重做**：50 步历史记录，Ctrl+Z/Y
- **繁简切换**：opencc-js 实时繁简中文转换，MutationObserver 监听增量 DOM

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 |
| 语言 | TypeScript 5.9 (strict) |
| 构建工具 | Vite 7 |
| UI 组件库 | Chakra UI v3 |
| CSS | Emotion + SCSS |
| 状态管理 | Zustand 5（切片模式，细粒度 selector） |
| 图标 | lucide-react + @iconify/react |
| 截图 | html2canvas |
| 繁简转换 | opencc-js |

## 快速开始

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npm run build        # 类型检查 + 生产构建
npm run lint         # ESLint 检查
npm run test         # 运行测试
npm run preview      # 预览生产构建
```

## 操作指南

### 通用

| 操作 | 快捷键 |
|------|--------|
| 平移画布 | 鼠标中键拖拽 |
| 缩放画布 | 滚轮（以鼠标位置为锚点） |
| 撤销 | `Ctrl + Z` |
| 重做 | `Ctrl + Y` 或 `Ctrl + Shift + Z` |
| 保存/另存 | `Ctrl + S` |
| 取消当前操作 | `Escape` 或 右键 |

### 建造模式 (BUILD)

| 操作 | 快捷键 |
|------|--------|
| 旋转待放置机器 | `R` |
| 放置机器 | 左键点击 |
| 连续放置 | `Ctrl + 左键` |
| 长按拾取已放置机器 | 左键按住 500ms |

### 连线模式 — 传送带 (E) / 管道 (Q)

| 操作 | 说明 |
|------|------|
| 开始连线 | 点击机器输出端口或其外侧单元格 |
| 切换 L 形策略 | `R`（主轴优先 ↔ 次轴优先） |
| 完成连线 | 点击目标机器输入端口 |
| 取消连线 | `Escape` 或 右键 |

### 框选模式 (X)

| 操作 | 说明 |
|------|------|
| 框选 | 左键拖拽 |
| 反选 | `Shift + 左键` 拖拽 |
| 批量移动 | 选中后按 `M` 或拖拽已选中项 |
| 批量复制 | 选中后按 `Ctrl + C` |
| 批量删除 | 选中后按 `F` |

### 蓝图

| 操作 | 快捷键 |
|------|--------|
| 打开蓝图列表 | `F1` |
| 插入蓝图到当前地图 | 蓝图列表 → 选择插入模式 |
| 插入蓝图到新地图 | 蓝图列表 → 新建地图放置 |

## 项目结构

```
src/
├── main.tsx              # 入口：StrictMode + ChakraProvider
├── App.tsx               # 根组件：uiView 路由 + 全局快捷键 + Toast
├── types.ts              # 共享类型（Point, Direction, MachineConfig, Connection 等）
├── store/
│   ├── gameStore.ts      # Zustand thin wrapper（组合 6 个切片）
│   ├── settingsStore.ts  # 独立 persist store（语言设置）
│   └── slices/           # canvas / machines / connection / selection / history / blueprint
├── config/
│   ├── machines.ts       # 43 台机器配置
│   ├── materials.ts      # 76 种材料
│   ├── constants.ts      # GRID_SIZE, GRID_PRESETS 等常量
│   └── memberInfo.ts     # 团队成员信息
├── utils/
│   ├── grid/             # 碰撞检测 / 方向 / 占用网格 / 寻路 / 端口工具
│   ├── machineUtils.ts   # 旋转尺寸/端口 + 供电网格
│   ├── shareUtils.ts     # V3 二进制分享编码/解码 + 截图
│   └── storage.ts        # localStorage 蓝图 CRUD
├── hooks/
│   ├── useGridEvents.ts  # 画布鼠标/键盘事件处理
│   └── useChineseConverter.ts  # 繁简实时转换
└── components/
    ├── Grid.tsx          # 核心画布
    ├── Machine.tsx       # 已放置机器（React.memo）
    ├── Toolbar.tsx       # 底部工具栏（6 分类 + 模式切换）
    ├── Header.tsx        # 顶部栏（logo + 网格尺寸 + 操作按钮）
    ├── ConnectionSVGLayer.tsx  # SVG 连线渲染
    ├── OperationHints.tsx      # 操作提示面板
    ├── BlueprintList.tsx       # 蓝图管理
    ├── ShareModal.tsx          # 分享弹窗
    ├── SaveDialog.tsx          # 保存命名对话框
    ├── Settings.tsx            # 语言设置
    ├── About.tsx               # 关于页面
    ├── LoadingScreen.tsx       # 启动加载画面
    ├── ErrorBoundary.tsx       # 错误边界
    └── IconButton.tsx          # 通用图标按钮
```

## 许可证

本专案为闭源专案，保留所有权利。未经作者书面许可，禁止散布、修改或商业使用。

## 免责声明

所有游戏相关图像与商标权归原厂所有。本工具仅為玩家社群制作的辅助工具，与游戏官方无任何关联，不进行任何商业营利行为。

## 作者

- 大木
- ChasingLight

（顺序不分先后）
