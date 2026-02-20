import { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Animated,
  Alert,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import { Text, ActivityIndicator, Portal, Dialog, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
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
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;

    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
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
        <TouchableOpacity
          style={styles.swipeButtonEdit}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit();
          }}
          activeOpacity={0.8}
        >
          <RNText style={styles.swipeButtonText}>编辑</RNText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.swipeButtonDelete}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
          activeOpacity={0.8}
        >
          <RNText style={styles.swipeButtonText}>删除</RNText>
        </TouchableOpacity>
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
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <Text
          numberOfLines={2}
          style={styles.cardContent}
        >
          {item.content}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.cardWordCount}>{item.wordCount} 字</Text>
        </View>
      </TouchableOpacity>
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
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="mic-outline" size={48} color="#C7C7CC" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>还没有笔记</Text>
        <Text style={styles.emptyHint}>前往录音页开始记录</Text>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
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
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>删除笔记</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogContent}>此操作无法撤销。</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDeleteTarget(null)}
              textColor="#8E8E93"
            >
              取消
            </Button>
            <Button onPress={handleDelete} textColor="#FF3B30">
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
    backgroundColor: '#F2F2F7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    gap: 8,
  },
  list: {
    padding: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1C1C1E',
    marginBottom: 10,
    fontWeight: '400',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDate: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
  },
  cardWordCount: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  emptyHint: {
    fontSize: 14,
    color: '#8E8E93',
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    marginLeft: 8,
  },
  swipeButtonEdit: {
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
  },
  swipeButtonDelete: {
    backgroundColor: 'rgba(255, 59, 48, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
  },
  swipeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  dialogContent: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
