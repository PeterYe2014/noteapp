import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from '../src/db/database';
import { colors } from '../src/constants/theme';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.textSecondary,
    background: colors.background,
    surface: colors.surface,
    onBackground: colors.text,
    onSurface: colors.text,
  },
};

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerShadowVisible: false,
              headerTitleStyle: { color: colors.text, fontWeight: '600' },
              headerTintColor: colors.primary,
              headerBackTitle: '返回',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="note/[id]" options={{ title: '笔记详情' }} />
            <Stack.Screen name="note/new" options={{ title: '新建笔记' }} />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
