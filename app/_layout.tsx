import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from '../src/db/database';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#8E8E93',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    onBackground: '#1C1C1E',
    onSurface: '#1C1C1E',
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
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="note/[id]"
              options={{
                title: '笔记详情',
                headerBackTitle: '返回',
                headerStyle: { backgroundColor: '#F2F2F7' },
                headerShadowVisible: false,
                headerTitleStyle: { color: '#1C1C1E', fontWeight: '600' },
                headerTintColor: '#007AFF',
              }}
            />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
