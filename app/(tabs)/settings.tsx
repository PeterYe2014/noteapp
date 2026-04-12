import { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Portal, Dialog, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/theme';
import { settings } from '../../src/styles/shared';

function SettingItem({
  iconName,
  title,
  value,
  isLast,
  onPress,
}: {
  iconName: string;
  title: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={[settings.item, !isLast && settings.itemBorder]} activeOpacity={0.6} onPress={onPress}>
      <View style={settings.itemLeft}>
        <Ionicons name={iconName} size={18} color={colors.textSecondary} style={settings.itemIcon} />
        <Text style={settings.itemTitle}>{title}</Text>
      </View>
      {value && <Text style={settings.itemValue}>{value}</Text>}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [privacyVisible, setPrivacyVisible] = useState(false);

  return (
    <View style={settings.container}>
      <View style={settings.section}>
        <Text style={settings.sectionHeader}>关于</Text>
        <View style={settings.sectionCard}>
          <SettingItem iconName="information-circle-outline" title="版本" value="1.0.0" />
          <SettingItem iconName="lock-closed-outline" title="隐私说明" isLast onPress={() => setPrivacyVisible(true)} />
        </View>
        <Text style={settings.sectionFooter}>所有笔记数据仅存储在本地设备，不会上传至云端。</Text>
      </View>

      <View style={settings.footer}>
        <Text style={settings.footerText}>noteapp · 语音笔记</Text>
      </View>

      <Portal>
        <Dialog visible={privacyVisible} onDismiss={() => setPrivacyVisible(false)} style={{ backgroundColor: colors.surface }}>
          <Dialog.Title style={{ fontSize: 17, fontWeight: '600', color: colors.text }}>隐私说明</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: 12 }}>
                1. 数据存储
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text, marginBottom: 16 }}>
                所有笔记数据仅存储在您的设备本地，使用 SQLite 数据库。我们不会将您的任何数据上传到云端服务器。
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: 12 }}>
                2. 数据安全
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text, marginBottom: 16 }}>
                您的笔记数据完全由您控制。卸载应用或清除数据将导致笔记永久删除，请务必自行备份重要内容。
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: 12 }}>
                3. 权限说明
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
                本应用仅请求必要的存储权限用于保存笔记数据，不会收集任何个人信息或行为数据。
              </Text>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPrivacyVisible(false)} textColor={colors.primary}>了解</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
