# noteapp MVP 设计文档

## 1. 执行摘要

**noteapp** 是一款移动端 Markdown 笔记应用，让用户快速创建、编辑并以 Markdown 格式管理笔记。采用本地优先架构，保护用户隐私。

- **核心价值**：Markdown 笔记 + 本地存储 + 隐私保护
- **目标平台**：iOS / Android
- **开发周期**：4 周

## 2. 核心问题

- 传统笔记缺乏格式化能力，内容表达受限
- 富文本编辑器复杂笨重，移动场景体验差
- 云端笔记存在隐私顾虑

**目标用户**：需要在移动中快速记录和整理结构化想法、重视隐私的用户

## 3. MVP 功能范围

### 3.1 核心功能（仅 3 个）

| 功能 | 描述 | 验收标准 |
|------|------|----------|
| **Markdown 笔记创建** | 支持 Markdown 语法输入，实时预览，自动保存 | 能以 Markdown 格式创建并渲染笔记 |
| **笔记管理** | 查看列表、查看详情、编辑、删除 | 列表显示、详情查看、内容可编辑、删除确认 |
| **本地存储** | SQLite 本地存储，无云端上传 | 关闭应用后数据保留 |

### 3.2 不在 MVP 范围

- 标签系统
- 搜索功能
- 云同步 / 用户账号
- 语音录制与转文字
- 深色模式

## 4. 技术栈

| 类别 | 选择 |
|------|------|
| 框架 | React Native + Expo |
| 语言 | TypeScript |
| 状态管理 | Zustand |
| 本地存储 | expo-sqlite |
| Markdown 渲染 | react-native-markdown-display |
| UI 组件 | React Native Paper |
| 导航 | Expo Router |

## 5. 数据模型

```typescript
interface Note {
  id: string;          // UUID
  title: string;       // 笔记标题（取首行或前 30 字）
  content: string;     // Markdown 格式笔记内容
  createdAt: number;   // 创建时间戳
  updatedAt: number;   // 更新时间戳
  wordCount: number;   // 字数
}
```

## 6. 仓库结构

```
noteapp/
├── app/                    # Expo Router 页面
│   ├── (tabs)/             # Tab 导航页面
│   │   ├── _layout.tsx     # Tab 导航配置
│   │   ├── index.tsx       # 首页（笔记列表）
│   │   └── settings.tsx    # 设置页
│   ├── note/
│   │   ├── [id].tsx        # 笔记详情页（预览）
│   │   └── [id]/edit.tsx   # 笔记编辑页
│   └── _layout.tsx         # 根布局
├── src/
│   ├── db/
│   │   └── database.ts     # SQLite 数据库配置
│   ├── store/
│   │   └── noteStore.ts    # Zustand 状态管理
│   └── types/
│       └── note.ts         # TypeScript 类型定义
├── assets/                 # 静态资源
├── app.json               # Expo 配置
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript 配置
├── CLAUDE.md              # AI 助手指南
├── MVP_DESIGN.md          # MVP 设计文档（本文件）
└── README.md              # 项目描述
```

## 7. 页面结构

- **首页**：笔记列表（按时间倒序，显示标题和摘要）
- **详情页**：Markdown 渲染预览 + 编辑 / 删除按钮
- **编辑页**：Markdown 原文编辑器 + 实时预览切换

底部 Tab 导航：首页 | 新建 | 设置（预留）

## 8. 开发计划（4 周）

| 周次 | 目标 | 交付物 |
|------|------|--------|
| 第 1 周 | 项目搭建 | Expo 项目初始化、导航配置、UI 组件库、数据库配置 |
| 第 2 周 | 笔记管理 | 笔记列表、详情页、删除功能、数据持久化 |
| 第 3 周 | Markdown 支持 | Markdown 编辑器、实时预览、编辑功能 |
| 第 4 周 | 测试发布 | 双平台测试、Bug 修复、提交应用商店 |

### 里程碑

| 里程碑 | 时间 | 验收标准 | 状态 |
|--------|------|----------|------|
| M1 | 第 1 周 | 应用骨架运行，导航正常 | ✅ 已完成 |
| M2 | 第 2 周 | 笔记 CRUD 功能可用 | ✅ 已完成 |
| M3 | 第 3 周 | Markdown 编辑与预览可用 | ✅ 已完成 |
| M4 | 第 4 周 | 提交至应用商店 | 🔲 待开始 |

### 当前状态

**M3 里程碑已完成**：Markdown 编辑与预览可用。

- 项目已初始化（Expo + TypeScript）
- 底部 Tab 导航已配置
- UI 组件库已集成（React Native Paper）
- 数据库已配置（expo-sqlite）
- 基础页面已创建（首页、设置、详情页）
- 笔记创建功能（支持 Markdown 输入 + 实时预览）
- 笔记列表展示（按时间倒序，支持下拉刷新）
- 笔记详情查看（Markdown 渲染预览）
- 笔记编辑（编辑/预览模式快速切换 + 自动保存）
- 笔记删除（含确认对话框）
- 数据持久化（SQLite 本地存储）
- Markdown 语法支持：标题、粗体、斜体、列表、代码块、引用

## 9. 关键风险

| 风险 | 缓解措施 |
|------|----------|
| Markdown 渲染性能 | 使用成熟渲染库，大文档分页加载 |
| App Store 审核 | 确保功能完整稳定，遵守指南 |
| 跨平台兼容性 | 使用 Expo 封装 API，双平台测试 |

## 10. 发布

- **构建**：Expo EAS Build
- **iOS**：Apple Developer ($99/年) → App Store Connect
- **Android**：Google Play Developer ($25) → Play Console

## 11. 特别注意事项

### Markdown 编辑功能
- 支持常用 Markdown 语法：标题、粗体、斜体、列表、代码块、引用
- 编辑模式与预览模式可快速切换
- 自动保存，避免内容丢失

### 隐私和安全
- 笔记数据仅存储在设备本地，无任何网络上传

### 无障碍访问
- 支持键盘导航
- 确保屏幕阅读器兼容性

---

**版本**: 3.0 | **日期**: 2026-02-20 | **状态**: Markdown 笔记版本，3 个核心功能
