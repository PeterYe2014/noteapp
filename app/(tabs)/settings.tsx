import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

function SettingItem({
  iconName,
  title,
  value,
  isLast,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.item, !isLast && styles.itemBorder]} activeOpacity={0.6}>
      <View style={styles.itemLeft}>
        <Ionicons name={iconName} size={18} color="#8E8E93" style={styles.itemIcon} />
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {value && <Text style={styles.itemValue}>{value}</Text>}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>关于</Text>
        <View style={styles.sectionCard}>
          <SettingItem iconName="information-circle-outline" title="版本" value="1.0.0" />
          <SettingItem iconName="lock-closed-outline" title="隐私说明" isLast />
        </View>
        <Text style={styles.sectionFooter}>所有笔记数据仅存储在本地设备，不会上传至云端。</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>noteapp · 语音笔记</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionFooter: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    paddingHorizontal: 4,
    lineHeight: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
  },
  itemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: {
    width: 22,
  },
  itemTitle: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  itemValue: {
    fontSize: 15,
    color: '#8E8E93',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#C7C7CC',
    fontWeight: '400',
  },
});
