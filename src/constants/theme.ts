// 主题颜色常量 - 统一使用 iOS 系统颜色
export const colors = {
  // 主色
  primary: '#007AFF',
  primaryLight: 'rgba(0, 122, 255, 0.85)',

  // 状态色
  success: '#34C759',
  danger: '#FF3B30',
  dangerLight: 'rgba(255, 59, 48, 0.85)',

  // 背景色
  background: '#F2F2F7',
  surface: '#FFFFFF',
  toolbar: '#FAFAFA',

  // 文字色
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',

  // 边框和分隔线
  border: 'rgba(60, 60, 67, 0.12)',

  // 阴影
  shadow: '#000',
};

// 字体规格
export const typography = {
  // 标题
  h1: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },

  // 正文
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  bodyLarge: { fontSize: 17, fontWeight: '400' as const, lineHeight: 24 },

  // 辅助文字
  callout: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20 },
  footnote: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },

  // 强调
  headline: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  subheadline: { fontSize: 14, fontWeight: '600' as const, lineHeight: 18 },
};

// 间距
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// 圆角
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

// 阴影样式
export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  subtle: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
};
