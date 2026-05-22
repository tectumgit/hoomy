import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface SectionTitleProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export function SectionTitle({ title, actionText, onActionPress }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {actionText && (
        <TouchableOpacity style={styles.actionRow} onPress={onActionPress}>
          <ThemedText style={styles.actionText}>{actionText}</ThemedText>
          <Feather name="chevron-right" size={16} color="#FF6500" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#FF6500',
    fontWeight: '600',
  },
});
