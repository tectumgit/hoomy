import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function IntroScreen() {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    // В вебе видео может отдавать didJustFinish мгновенно, если браузер блокирует автоплей.
    // Поэтому мы делаем жесткий таймер на показ заставки.
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 5000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={styles.container}>
      <Video
        source={require('@/assets/videos/introhoomy.mp4')}
        style={{ width, height }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted
        isLooping={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
