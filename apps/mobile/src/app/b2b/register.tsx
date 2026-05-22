import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function B2BRegisterScreen() {
  const [companyName, setCompanyName] = useState('');
  const [inn, setInn] = useState('');
  const [kpp, setKpp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!companyName.trim() || !inn.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (inn.length < 10 || inn.length > 12) {
      Alert.alert('Ошибка', 'ИНН должен содержать от 10 до 12 цифр');
      return;
    }

    setIsLoading(true);

    // Имитация POST /api/b2b/register
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Заявка принята',
        'Ваша заявка на активацию B2B-аккаунта успешно отправлена. Модератор проверит данные компании в течение 1 рабочего дня.',
        [
          {
            text: 'Отлично',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Шапка */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>B2B Программа</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.introCard}>
              <View style={styles.iconBadge}>
                <Feather name="briefcase" size={32} color="#FF6500" />
              </View>
              <ThemedText style={styles.introTitle}>Оптовый аккаунт Hoomy</ThemedText>
              <ThemedText style={styles.introDesc}>
                Для ресторанов, кафе, магазинов и оптовых закупщиков. Получите специальные цены, оплату по счету и закрывающие документы УПД.
              </ThemedText>
            </View>

            {/* Форма */}
            <View style={styles.formContainer}>
              <ThemedText style={styles.sectionLabel}>Сведения об организации</ThemedText>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Название компании / ИП *</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="ООО Звезда или ИП Иванов"
                  placeholderTextColor="#999"
                  value={companyName}
                  onChangeText={setCompanyName}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <ThemedText style={styles.inputLabel}>ИНН *</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="10 или 12 цифр"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={inn}
                    onChangeText={setInn}
                    maxLength={12}
                    editable={!isLoading}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <ThemedText style={styles.inputLabel}>КПП (для ООО)</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="9 цифр"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={kpp}
                    onChangeText={setKpp}
                    maxLength={9}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <ThemedText style={styles.sectionLabel}>Контакты для связи</ThemedText>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Телефон ответственного лица *</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="+7 (999) 000-00-00"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>E-mail для отправки счетов *</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="purchasing@company.ru"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Информационный блок */}
            <View style={styles.warningBox}>
              <Feather name="info" size={18} color="#FF6500" style={styles.warningIcon} />
              <ThemedText style={styles.warningText}>
                Данные компании проверяются автоматически по базе ЕГРЮЛ. Вы получите пуш-уведомление при успешной активации B2B-профиля.
              </ThemedText>
            </View>

            {/* Кнопка отправки */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <ThemedText style={styles.submitButtonText}>Отправить заявку</ThemedText>
              )}
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  introCard: {
    backgroundColor: '#FFF2EB',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFD9C4',
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  introDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  formContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#FF6500',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#FFA366',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
