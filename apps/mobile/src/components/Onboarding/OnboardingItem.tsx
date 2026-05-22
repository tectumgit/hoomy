import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

interface Props {
  item: {
    id: string;
    title: string;
    description: string;
    image: any;
  };
  index: number;
  scrollX: SharedValue<number>;
}

export function OnboardingItem({ item, index, scrollX }: Props) {
  const { width, height } = useWindowDimensions();

  const animatedTextStyle = useAnimatedStyle(() => {
    // Рассчитываем положение текущего слайда относительно скролла
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50], // Фрейм с текстом плавно выезжает снизу
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0], // Плавное исчезновение/появление
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={item.image}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      {/* Плашка с текстом поверх картинки с анимацией выезда */}
      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <ThemedText type="title" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.description}>
          {item.description}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    position: 'absolute',
    bottom: 160, // Сдвигаем наверх, чтобы освободить место для пагинатора и кнопки "Далее"
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Затемнение, чтобы текст читался на любом фоне
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: 'white',
    fontSize: 34, // Уменьшено на ~30% (от базовых 48px)
    lineHeight: 40,
  },
  description: {
    fontWeight: '400',
    textAlign: 'center',
    color: 'white',
    opacity: 0.9,
  },
});
