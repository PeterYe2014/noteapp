import { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';

export default function HomeScreen() {
  const router = useRouter();
  const { notes, isLoading, loadNotes } = useNoteStore();

  useEffect(() => {
    loadNotes();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          暂无笔记
        </Text>
        <Text variant="bodyMedium" style={styles.emptyHint}>
          点击"录音"开始创建语音笔记
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => router.push(`/note/${item.id}`)}
          >
            <Card.Content>
              <Text variant="bodyLarge" numberOfLines={2} style={styles.content}>
                {item.content}
              </Text>
              <View style={styles.meta}>
                <Text variant="bodySmall" style={styles.date}>
                  {formatDate(item.createdAt)}
                </Text>
                <Text variant="bodySmall" style={styles.wordCount}>
                  {item.wordCount} 字
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  content: {
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: '#757575',
  },
  wordCount: {
    color: '#757575',
  },
  emptyText: {
    color: '#757575',
    marginBottom: 8,
  },
  emptyHint: {
    color: '#9e9e9e',
  },
});
