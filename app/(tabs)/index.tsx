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
import { colors, spacing, radius } from '../../src/constants/theme';
import { layout, card, emptyState, swipeActions, dialog } from '../../src/styles/shared';

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
      <Animated.View style={[swipeActions.container, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          style={[swipeActions.button, swipeActions.buttonEdit]}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit();
          }}
          activeOpacity={0.8}
        >
          <RNText style={swipeActions.buttonText}>编辑</RNText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[swipeActions.button, swipeActions.buttonDelete]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
          activeOpacity={0.8}
        >
          <RNText style={swipeActions.buttonText}>删除</RNText>
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
      <TouchableOpacity style={card.container} onPress={onPress} activeOpacity={0.7}>
        <Text numberOfLines={2} style={card.content}>
          {item.content}
        </Text>
        <View style={card.meta}>
          <Text style={card.date}>{formatDate(item.createdAt)}</Text>
          <Text style={card.wordCount}>{item.wordCount} 字</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { notes, isLoading, loadNotes, deleteNote } = useNoteStore();
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

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
      await deleteNote(deleteTarget.id);
    } catch {
      Alert.alert('错误', '删除失败，请重试');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <View style={layout.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={layout.centered}>
        <Ionicons name="create-outline" size={48} color={colors.textTertiary} style={emptyState.icon} />
        <Text style={emptyState.title}>还没有笔记</Text>
        <Text style={emptyState.hint}>点击底部新建按钮开始写作</Text>
      </View>
    );
  }

  return (
    <View style={layout.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <SwipeableNoteCard
            item={item}
            onPress={() => router.push(`/note/${item.id}`)}
            onEdit={() => router.push(`/note/${item.id}?edit=1`)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Portal>
        <Dialog
          visible={deleteTarget !== null}
          onDismiss={() => setDeleteTarget(null)}
          style={dialog.container}
        >
          <Dialog.Title style={dialog.title}>删除笔记</Dialog.Title>
          <Dialog.Content>
            <Text style={dialog.content}>确定要删除这条笔记吗？此操作无法撤销。</Text>
            {deleteTarget && (
              <View style={styles.deletePreview}>
                <Text style={styles.deletePreviewText} numberOfLines={3}>
                  {deleteTarget.content}
                </Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDeleteTarget(null)}
              textColor={colors.textSecondary}
            >
              取消
            </Button>
            <Button onPress={handleDelete} textColor={colors.danger}>
              删除
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    paddingTop: 12,
  },
  deletePreview: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
  },
  deletePreviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
