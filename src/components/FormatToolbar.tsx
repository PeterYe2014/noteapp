import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';

interface FormatToolbarProps {
  onInsert: (before: string, after?: string) => void;
}

type FormatAction = {
  icon: string;
  label: string;
  before: string;
  after: string;
};

const formatActions: FormatAction[] = [
  // 块级格式
  { icon: 'format-text', label: '正文', before: '', after: '' },
  { icon: 'format-header-3', label: '标题', before: '### ', after: '' },
  { icon: 'format-list-bulleted', label: '列表', before: '- ', after: '' },
  { icon: 'format-quote-close', label: '引用', before: '> ', after: '' },
  // 行内格式
  { icon: 'format-bold', label: '粗体', before: '**', after: '**' },
  { icon: 'format-italic', label: '斜体', before: '*', after: '*' },
  { icon: 'format-strikethrough', label: '删除线', before: '~~', after: '~~' },
  { icon: 'code-tags', label: '代码', before: '`', after: '`' },
];

export default function FormatToolbar({ onInsert }: FormatToolbarProps) {
  return (
    <View style={styles.container}>
      {formatActions.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={styles.button}
          onPress={() => onInsert(action.before, action.after)}
          activeOpacity={0.6}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <MaterialCommunityIcons
            name={action.icon}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.toolbar,
  },
  button: {
    padding: spacing.sm,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
});