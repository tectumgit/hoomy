import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';

export function Banners() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Сетка рекламных баннеров */}
      <View style={styles.grid}>
        <TouchableOpacity 
          style={[styles.card, styles.cardLarge]}
          activeOpacity={0.85}
          onPress={() => router.push('/weekly-purchase')}
        >
          <View style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>Закупка{'\n'}на неделю</ThemedText>
            <ThemedText style={styles.cardSubtitle}>Готовые наборы{'\n'}по выгодным ценам</ThemedText>
            <View style={styles.cardButton}>
              <ThemedText style={styles.cardButtonText}>Выбрать набор</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.emojiDecorLarge}>🛒</ThemedText>
        </TouchableOpacity>

        <View style={styles.column}>
          <TouchableOpacity 
            style={[styles.card, styles.cardSmall, { backgroundColor: '#FDF7E7' }]}
            activeOpacity={0.85}
            onPress={() => router.push('/b2b/register')}
          >
            <View style={styles.cardContent}>
              <ThemedText style={styles.cardTitle}>Для кафе{'\n'}и ресторанов</ThemedText>
              <ThemedText style={styles.cardSubtitle}>Специальные условия</ThemedText>
              <View style={[styles.cardButton, { backgroundColor: '#F0E2C1' }]}>
                <ThemedText style={styles.cardButtonText}>Подробнее</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.emojiDecorSmall}>🍽️</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.card, styles.cardSmall, { backgroundColor: '#F0EFFC' }]}
            activeOpacity={0.85}
            onPress={() => router.push('/discounts')}
          >
            <View style={styles.cardContent}>
              <ThemedText style={styles.cardTitle}>Скидки{'\n'}месяца</ThemedText>
              <ThemedText style={styles.cardSubtitle}>Выгодные предложения</ThemedText>
              <View style={[styles.cardButton, { backgroundColor: '#E0DEFA' }]}>
                <ThemedText style={styles.cardButtonText}>Смотреть</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.emojiDecorSmall}>%</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Баннер "Одна корзина" */}
      <TouchableOpacity 
        style={styles.unifiedCartBanner}
        activeOpacity={0.9}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.unifiedContent}>
          <ThemedText style={styles.unifiedTitle}>Одна корзина — несколько поставщиков</ThemedText>
          <ThemedText style={styles.unifiedSubtitle}>Добавляйте товары от разных поставщиков, а мы объединим всё в один заказ</ThemedText>
          <View style={styles.unifiedButton}>
            <ThemedText style={styles.unifiedButtonText}>Как это работает?</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.unifiedEmoji}>🚚</ThemedText>
      </TouchableOpacity>

      {/* Модал-объяснение единой корзины */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.infoIconContainer}>
              <ThemedText style={styles.infoEmoji}>🚚</ThemedText>
            </View>

            <ThemedText style={styles.modalTitle}>Одна корзина Hoomy</ThemedText>
            
            <ThemedText style={styles.modalDesc}>
              Больше не нужно делать заказы на разных сайтах и переплачивать за доставку!
            </ThemedText>

            <View style={styles.pointsList}>
              <View style={styles.pointRow}>
                <View style={styles.pointNumber}>
                  <ThemedText style={styles.pointNumberText}>1</ThemedText>
                </View>
                <ThemedText style={styles.pointText}>
                  Добавляйте любые объемы овощей, молока или мяса от разных локальных фермеров и поставщиков в одну корзину.
                </ThemedText>
              </View>

              <View style={styles.pointRow}>
                <View style={styles.pointNumber}>
                  <ThemedText style={styles.pointNumberText}>2</ThemedText>
                </View>
                <ThemedText style={styles.pointText}>
                  Корзина автоматически разделит товары по поставщикам, чтобы вы видели минимальный объем заказа для каждого из них.
                </ThemedText>
              </View>

              <View style={styles.pointRow}>
                <View style={styles.pointNumber}>
                  <ThemedText style={styles.pointNumberText}>3</ThemedText>
                </View>
                <ThemedText style={styles.pointText}>
                  При оформлении выберите удобные даты доставки для каждого поставщика отдельно. Оплачивайте заказ одним платежом!
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.modalButtonText}>Понятно</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardLarge: {
    flex: 1,
    backgroundColor: '#FFF2EB',
    minHeight: 220,
  },
  column: {
    flex: 1,
    gap: 12,
  },
  cardSmall: {
    minHeight: 140,
  },
  cardContent: {
    zIndex: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#666',
    marginBottom: 12,
    lineHeight: 14,
  },
  cardButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD3B5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  emojiDecorLarge: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    fontSize: 90,
    lineHeight: 100,
    opacity: 0.8,
    zIndex: 1,
  },
  emojiDecorSmall: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    fontSize: 50,
    lineHeight: 60,
    opacity: 0.8,
    zIndex: 1,
  },
  unifiedCartBanner: {
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    position: 'relative',
    overflow: 'hidden',
  },
  unifiedContent: {
    flex: 1,
    zIndex: 2,
    paddingRight: 40,
  },
  unifiedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  unifiedSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    lineHeight: 16,
  },
  unifiedButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unifiedButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unifiedEmoji: {
    position: 'absolute',
    right: 10,
    top: 20,
    fontSize: 60,
    lineHeight: 70,
    opacity: 0.2,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  infoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF2EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  infoEmoji: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  pointsList: {
    width: '100%',
    gap: 16,
    marginBottom: 30,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pointNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6500',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  pointNumberText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#FF6500',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
