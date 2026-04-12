import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/theme';
import { settings } from '../../src/styles/shared';

function SettingItem({
  iconName,
  title,
  value,
  isLast,
}: {
  iconName: string;
  title: string;
  value?: string;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity style={[settings.item, !isLast && settings.itemBorder]} activeOpacity={0.6}>
      <View style={settings.itemLeft}>
        <Ionicons name={iconName} size={18} color={colors.textSecondary} style={settings.itemIcon} />
        <Text style={settings.itemTitle}>{title}</Text>
      </View>
      {value && <Text style={settings.itemValue}>{value}</Text>}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <View style={settings.container}>
      <View style={settings.section}>
        <Text style={settings.sectionHeader}>关于</Text>
        <View style={settings.sectionCard}>
          <SettingItem iconName="information-circle-outline" title="版本" value="1.0.0" />
          <SettingItem iconName="lock-closed-outline" title="隐私说明" isLast />
        </View>
        <Text style={settings.sectionFooter}>所有笔记数据仅存储在本地设备，不会上传至云端。</Text>
      </View>

      <View style={settings.footer}>
        <Text style={settings.footerText}>noteapp · 语音笔记</Text>
      </View>
    </View>
  );
}
