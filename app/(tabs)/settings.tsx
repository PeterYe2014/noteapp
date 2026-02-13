import { View, StyleSheet } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>关于</List.Subheader>
        <List.Item
          title="版本"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <Divider />
        <List.Item
          title="隐私说明"
          description="所有笔记数据仅存储在本地设备"
          left={(props) => <List.Icon {...props} icon="shield-check" />}
        />
      </List.Section>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          noteapp - 语音笔记应用
        </Text>
        <Text variant="bodySmall" style={styles.footerText}>
          本地优先，保护隐私
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    color: '#9e9e9e',
    marginBottom: 4,
  },
});
