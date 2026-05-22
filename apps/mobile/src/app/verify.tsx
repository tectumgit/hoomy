import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';

const CODE_LENGTH = 4;

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(59);
  const inputRef = useRef<TextInput>(null);

  // Таймер обратного отсчета
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Обработка ввода кода
  const handleCodeChange = (text: string) => {
    // Оставляем только цифры
    const numericCode = text.replace(/[^0-9]/g, '');
    setCode(numericCode);

    if (numericCode.length === CODE_LENGTH) {
      // Имитируем проверку и переход
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 300);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(59);
      // логика отправки SMS
    }
  };

  // Фокус на инпут при старте
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Feather name="chevron-left" size={28} color="#FF6500" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.title}>Введите код</ThemedText>
          <ThemedText style={styles.subtitle}>
            Мы отправили SMS с кодом на номер{'\n'}
            <ThemedText style={styles.phoneText}>+7 {phone || '(999) 123-45-67'}</ThemedText>
          </ThemedText>

          {/* Блок ввода OTP */}
          <Pressable style={styles.otpContainer} onPress={() => inputRef.current?.focus()}>
            {[...Array(CODE_LENGTH)].map((_, index) => {
              const digit = code[index] || '';
              const isFocused = code.length === index;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.otpCell,
                    isFocused && styles.otpCellFocused,
                    digit && styles.otpCellFilled,
                  ]}
                >
                  <ThemedText style={styles.otpText}>{digit}</ThemedText>
                </View>
              );
            })}
          </Pressable>

          {/* Скрытый инпут */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={handleCodeChange}
            maxLength={CODE_LENGTH}
            keyboardType="number-pad"
            returnKeyType="done"
            autoFocus
          />

          {/* Таймер / Повторная отправка */}
          <TouchableOpacity 
            style={styles.timerContainer} 
            onPress={handleResend}
            disabled={timer > 0}
          >
            <ThemedText style={[styles.timerText, timer === 0 && styles.resendTextActive]}>
              {timer > 0 ? `Запросить код повторно через 00:${timer.toString().padStart(2, '0')}` : 'Отправить код еще раз'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
    color: '#FF6500',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  phoneText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  otpCell: {
    width: 60,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E2D2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  otpCellFocused: {
    borderColor: '#FF6500',
  },
  otpCellFilled: {
    borderColor: '#FF6500',
    backgroundColor: '#FCFAF5',
  },
  otpText: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
    color: '#FF6500',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  timerContainer: {
    marginTop: 20,
  },
  timerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  resendTextActive: {
    color: '#FF6500',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
