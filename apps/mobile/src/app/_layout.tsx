import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { CartProvider } from '@/hooks/use-cart';
import { AddressProvider } from '@/hooks/use-address';
import { InboxProvider } from '@/hooks/use-inbox';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AddressProvider>
        <CartProvider>
          <InboxProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="address-map" options={{ presentation: 'modal' }} />
              <Stack.Screen name="supplier/[id]" />
              <Stack.Screen name="product/[id]" options={{ presentation: 'modal', gestureEnabled: true, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="b2b/register" options={{ presentation: 'modal', gestureEnabled: true, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="weekly-purchase/index" />
              <Stack.Screen name="discounts/index" />
            </Stack>
          </InboxProvider>
        </CartProvider>
      </AddressProvider>
    </ThemeProvider>
  );
}



