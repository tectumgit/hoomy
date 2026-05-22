import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface Props {
  data: any[];
  scrollX: SharedValue<number>;
}

interface DotProps {
  i: number;
  width: number;
  scrollX: SharedValue<number>;
}

function Dot({ i, width, scrollX }: DotProps) {
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [10, 20, 10],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.dot, animatedDotStyle]}
    />
  );
}

export function Paginator({ data, scrollX }: Props) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, i) => (
        <Dot
          key={i.toString()}
          i={i}
          width={width}
          scrollX={scrollX}
        />
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6500',
    marginHorizontal: 8,
  },
});
