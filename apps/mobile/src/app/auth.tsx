import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  const handleGetCode = () => {
    router.push({ pathname: '/verify', params: { phone } });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Логотип */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.svg')}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText style={styles.logoText}>Hoomy</ThemedText>
        </View>

        {/* Заголовки */}
        <ThemedText style={styles.title}>Вход в аккаунт</ThemedText>
        <ThemedText style={styles.subtitle}>
          Введите номер телефона,{'\n'}мы отправим код для входа
        </ThemedText>

        {/* Карточка ввода телефона */}
        <View style={styles.inputCard}>
          <ThemedText style={styles.inputLabel}>Номер телефона</ThemedText>
          <View style={styles.phoneInputContainer}>
            {/* Выбор страны (заглушка) */}
            <TouchableOpacity style={styles.countryPicker}>
              <ThemedText style={styles.countryFlag}>🇷🇺</ThemedText>
              <ThemedText style={styles.countryCode}>+7</ThemedText>
              <Feather name="chevron-down" size={16} color="#000" />
            </TouchableOpacity>

            {/* Ввод телефона */}
            <TextInput
              style={styles.textInput}
              placeholder="(999) 123-45-67"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={15}
            />
          </View>
          <ThemedText style={styles.inputHint}>
            На этот номер придёт SMS с кодом для входа
          </ThemedText>
        </View>

        {/* Кнопка "Получить код" */}
        <TouchableOpacity style={styles.mainButton} onPress={handleGetCode} activeOpacity={0.8}>
          <ThemedText style={styles.mainButtonText}>Получить код</ThemedText>
        </TouchableOpacity>



        {/* Соглашение */}
        <ThemedText style={styles.agreementText}>
          Нажимая кнопку «Получить код», вы принимаете{' '}
          <ThemedText style={styles.agreementLink} onPress={() => setTermsVisible(true)}>
            Условия использования сервиса
          </ThemedText>{' '}
          и{' '}
          <ThemedText style={styles.agreementLink} onPress={() => setPrivacyVisible(true)}>
            Политику конфиденциальности
          </ThemedText>
        </ThemedText>
      </ScrollView>

      {/* Модалка Условий */}
      <Modal visible={termsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setTermsVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Условия использования</ThemedText>
            <TouchableOpacity onPress={() => setTermsVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <ThemedText style={styles.modalText}>
              Здесь будет располагаться полный текст условий использования сервиса Hoomy. {'\n\n'}
              В данном разделе описываются права и обязанности пользователя, правила использования приложения, покупки товаров у поставщиков и другие юридические аспекты.
            </ThemedText>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Модалка Политики */}
      <Modal visible={privacyVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPrivacyVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Политика конфиденциальности</ThemedText>
            <TouchableOpacity onPress={() => setPrivacyVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <ThemedText style={styles.modalText}>
              Здесь будет располагаться полный текст политики конфиденциальности сервиса Hoomy. {'\n\n'}
              В данном разделе описывается, как мы собираем, храним и обрабатываем ваши персональные данные, включая номер телефона, адрес доставки и информацию о заказах.
            </ThemedText>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // Кремовый фон из макета
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 90,
    height: 80,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6500',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
    color: '#FF6500',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6500',
    marginBottom: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 10,
  },
  countryFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
    color: '#000',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  inputHint: {
    fontSize: 12,
    color: '#888',
  },
  mainButton: {
    backgroundColor: '#FF6500',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  agreementText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 'auto',
    paddingHorizontal: 20,
  },
  agreementLink: {
    fontSize: 12,
    color: '#FF6500',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5230',
  },
  modalContent: {
    padding: 20,
  },
  modalText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    marginBottom: 40,
  },
});
