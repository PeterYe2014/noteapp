import { useEffect, useCallback, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Animated, Alert } from 'react-native';
import { Text, Card, ActivityIndicator, Portal, Dialog, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { useNoteStore } from '../../src/store/noteStore';
import { Note } from '../../src/types/note';

function SwipeableNoteCard({
  item,
  onPress,
  onEdit,
  onDelete,
}: {
  item: Note;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const swipeableRef = useRef<Swipeable>(null);

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

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const translateX = dragX.interpolate({
      inputRange: [-160, 0],
      outputRange: [0, 160],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.swipeActions, { transform: [{ translateX }] }]}>
        <Animated.View style={styles.swipeButtonEdit}>
          <Text
            style={styles.swipeButtonText}
            onPress={() => {
              swipeableRef.current?.close();
              onEdit();
            }}
          >
            编辑
          </Text>
        </Animated.View>
        <Animated.View style={styles.swipeButtonDelete}>
          <Text
            style={styles.swipeButtonText}
            onPress={() => {
              swipeableRef.current?.close();
              onDelete();
            }}
          >
            删除
          </Text>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      <Card style={styles.card} onPress={onPress}>
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
    </Swipeable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { notes, isLoading, loadNotes, deleteNote } = useNoteStore();
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNote(deleteTarget);
    } catch {
      Alert.alert('错误', '删除失败，请重试');
    } finally {
      setDeleteTarget(null);
    }
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <SwipeableNoteCard
            item={item}
            onPress={() => router.push(`/note/${item.id}`)}
            onEdit={() => router.push(`/note/${item.id}?edit=1`)}
            onDelete={() => setDeleteTarget(item.id)}
          />
        )}
      />

      <Portal>
        <Dialog
          visible={deleteTarget !== null}
          onDismiss={() => setDeleteTarget(null)}
        >
          <Dialog.Title>确认删除</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">确定要删除这条笔记吗？此操作无法撤销。</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)}>取消</Button>
            <Button onPress={handleDelete} textColor="#E57373">
              删除
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 8,
  },
  swipeButtonEdit: {
    backgroundColor: '#64B5F6',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  swipeButtonDelete: {
    backgroundColor: '#E57373',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  swipeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
