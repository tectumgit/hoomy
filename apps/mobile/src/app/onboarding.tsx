import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, FadeIn } from 'react-native-reanimated';

import { OnboardingItem } from '@/components/Onboarding/OnboardingItem';
import { Paginator } from '@/components/Onboarding/Paginator';
import { ThemedText } from '@/components/themed-text';
import { ONBOARDING_SLIDES } from '@/constants/onboarding-data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const slidesRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/auth');
    }
  };

  const skip = () => {
    router.replace('/auth');
  };

  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <Animated.FlatList
        data={ONBOARDING_SLIDES}
        renderItem={({ item, index }) => <OnboardingItem item={item} index={index} scrollX={scrollX} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Верхняя кнопка пропуска */}
      <View style={[styles.skipContainer, { top: insets.top + 10 }]} pointerEvents="box-none">
        <TouchableOpacity onPress={skip} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <ThemedText style={styles.skipText}>Пропустить</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Нижняя панель с пагинатором и кнопкой */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]} pointerEvents="box-none">
        <Paginator data={ONBOARDING_SLIDES} scrollX={scrollX} />
        
        <TouchableOpacity style={styles.button} onPress={scrollToNext} activeOpacity={0.8}>
          <ThemedText style={styles.buttonText}>
            {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Начать' : 'Далее'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  skipContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
    elevation: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#FF6500',
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 10,
  },
  button: {
    backgroundColor: '#FF6500',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
