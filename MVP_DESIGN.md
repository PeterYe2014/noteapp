# noteapp MVP 设计文档

## 1. 执行摘要

**noteapp** 是一款移动端语音笔记应用，让用户通过语音快速记录并自动转换为文本。采用本地优先架构，保护用户隐私。

- **核心价值**：语音记录 + 本地存储 + 隐私保护
- **目标平台**：iOS / Android
- **开发周期**：4 周

## 2. 核心问题

- 传统笔记需要手动输入，移动场景效率低
- 纯音频文件难以管理和搜索
- 云端语音笔记存在隐私顾虑

**目标用户**：需要在移动中快速记录想法、重视隐私的用户

## 3. MVP 功能范围

### 3.1 核心功能（仅 3 个）

| 功能 | 描述 | 验收标准 |
|------|------|----------|
| **语音录制与转文字** | 点击录音，实时转文字，自动保存 | 语音能转为文字并保存 |
| **笔记管理** | 查看列表、查看详情、删除（不含编辑） | 列表显示、详情查看、删除确认 |
| **本地存储** | SQLite 本地存储，无云端上传 | 关闭应用后数据保留 |

### 3.2 不在 MVP 范围

- 标签系统
- 搜索功能
- 笔记编辑
- 云同步 / 用户账号
- 音频文件保存
- 深色模式

## 4. 技术栈

| 类别 | 选择 |
|------|------|
| 框架 | React Native + Expo |
| 语言 | TypeScript |
| 状态管理 | Zustand |
| 本地存储 | expo-sqlite |
| 语音识别 | @react-native-voice/voice |
| UI 组件 | React Native Paper |
| 导航 | Expo Router |

## 5. 数据模型

```typescript
interface Note {
  id: string;          // UUID
  content: string;     // 笔记内容
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
│   │   ├── record.tsx      # 录音页
│   │   └── settings.tsx    # 设置页
│   ├── note/
│   │   └── [id].tsx        # 笔记详情页
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

- **首页**：笔记列表（按时间倒序）
- **录音页**：麦克风按钮 + 实时转写显示
- **详情页**：笔记内容 + 删除按钮

底部 Tab 导航：首页 | 录音 | 设置（预留）

## 8. 开发计划（4 周）

| 周次 | 目标 | 交付物 |
|------|------|--------|
| 第 1 周 | 项目搭建 | Expo 项目初始化、导航配置、UI 组件库、数据库配置 |
| 第 2 周 | 笔记管理 | 笔记列表、详情页、删除功能、数据持久化 |
| 第 3 周 | 语音功能 | 语音识别集成、录音界面、实时转写、自动保存 |
| 第 4 周 | 测试发布 | 双平台测试、Bug 修复、提交应用商店 |

### 里程碑

| 里程碑 | 时间 | 验收标准 | 状态 |
|--------|------|----------|------|
| M1 | 第 1 周 | 应用骨架运行，导航正常 | ✅ 已完成 |
| M2 | 第 2 周 | 笔记 CRUD 功能可用 | ✅ 已完成 |
| M3 | 第 3 周 | 语音转文字并保存成功 | 🔲 待开始 |
| M4 | 第 4 周 | 提交至应用商店 | 🔲 待开始 |

### 当前状态

**M2 里程碑已完成**：笔记 CRUD 功能可用。

- 项目已初始化（Expo + TypeScript）
- 底部 Tab 导航已配置
- UI 组件库已集成（React Native Paper）
- 数据库已配置（expo-sqlite）
- 基础页面已创建（首页、录音、设置、详情页）
- 笔记创建功能（文字输入，M3 将增加语音输入）
- 笔记列表展示（按时间倒序，支持下拉刷新）
- 笔记详情查看
- 笔记删除（含确认对话框）
- 数据持久化（SQLite 本地存储）

## 9. 关键风险

| 风险 | 缓解措施 |
|------|----------|
| 语音识别准确率不可控 | 显示实时转写，Post-MVP 支持编辑 |
| App Store 审核 | 确保功能完整稳定，遵守指南 |
| 跨平台兼容性 | 使用 Expo 封装 API，双平台测试 |

## 10. 发布

- **构建**：Expo EAS Build
- **iOS**：Apple Developer ($99/年) → App Store Connect
- **Android**：Google Play Developer ($25) → Play Console

## 11. 特别注意事项

### 音频/语音功能
- 优雅地处理麦克风权限
- 在录制期间提供视觉反馈
- 使用系统语音识别 API（iOS: Apple Speech, Android: Google Speech）

### 隐私和安全
- 笔记数据仅存储在设备本地
- 语音识别使用系统 API（iOS: Apple Speech, Android: Google Speech）
- 首次使用需告知用户语音数据会发送至系统服务器

### 无障碍访问
- 为音频反馈提供视觉替代方案
- 支持键盘导航
- 确保屏幕阅读器兼容性

---

**版本**: 2.0 | **日期**: 2026-02-12 | **状态**: React Native 版本，3 个核心功能
