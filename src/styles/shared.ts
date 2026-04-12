import { StyleSheet, Platform } from 'react-native';
import { colors, typography, spacing, shadows, radius } from '../constants/theme';

// 通用布局样式
export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

// 卡片样式
export const card = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: 10,
    ...shadows.card,
  },
  content: {
    ...typography.callout,
    color: colors.text,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  wordCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

// 空状态样式
export const emptyState = StyleSheet.create({
  icon: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.headline,
    color: colors.text,
  },
  hint: {
    ...typography.callout,
    color: colors.textSecondary,
  },
});

// 滑动操作按钮样式
export const swipeActions = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginLeft: spacing.sm,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
  },
  buttonEdit: {
    backgroundColor: colors.primaryLight,
  },
  buttonDelete: {
    backgroundColor: colors.dangerLight,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
});

// 对话框样式
export const dialog = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  title: {
    ...typography.headline,
    color: colors.text,
  },
  content: {
    ...typography.callout,
    color: colors.textSecondary,
  },
});

// 设置页样式
export const settings = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    ...typography.footnote,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  sectionFooter: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
    lineHeight: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    backgroundColor: colors.surface,
  },
  itemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemIcon: {
    width: 22,
  },
  itemTitle: {
    ...typography.callout,
    color: colors.text,
  },
  itemValue: {
    ...typography.callout,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    ...typography.footnote,
    color: colors.textTertiary,
  },
});

// 笔记编辑/详情页通用样式
export const noteScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  headerBtnText: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '600',
  },
  headerBtnPrimary: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '600',
  },
  dim: {
    opacity: 0.5,
  },
  editorContainer: {
    flex: 1,
  },
  editor: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    ...typography.body,
    color: colors.text,
  },
  reader: {
    flex: 1,
  },
  readerContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaSaved: {
    color: colors.success,
  },
});

// 编辑模式切换栏
export const modeBar = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: colors.background,
  },
  tabText: {
    ...typography.footnote,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.text,
  },
});

// Markdown 样式 - 用于 react-native-markdown-display
export const markdownStyles = {
  body: { ...typography.body, color: colors.text },
  heading1: { ...typography.h1, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  heading2: { ...typography.h2, color: colors.text, marginTop: 14, marginBottom: 6 },
  heading3: { ...typography.h3, color: colors.text, marginTop: 12, marginBottom: spacing.xs },
  strong: { fontWeight: '700' as const },
  em: { fontStyle: 'italic' as const },
  code_inline: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    backgroundColor: colors.background,
    color: colors.primary,
    borderRadius: radius.xs,
  },
  fence: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.sm,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  blockquote: { borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: spacing.md, marginLeft: 0, opacity: 0.8 },
  list_item: { marginVertical: 2 },
  link: { color: colors.primary },
  hr: { backgroundColor: colors.border, height: 1, marginVertical: spacing.lg },
};
