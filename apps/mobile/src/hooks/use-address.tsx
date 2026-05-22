import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser, Address } from '@/mocks/userData';

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  selectAddress: (id: string) => void;
  addAddress: (address: Omit<Address, 'id' | 'isDefault'>) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const STORAGE_KEY = 'hoomy_selected_address_id';
const ADDRESSES_STORAGE_KEY = 'hoomy_user_addresses';
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Инициализация адресов
  useEffect(() => {
    let initialAddresses = [...mockUser.addresses];
    
    if (isWeb) {
      try {
        const storedAddresses = window.localStorage.getItem(ADDRESSES_STORAGE_KEY);
        if (storedAddresses) {
          initialAddresses = JSON.parse(storedAddresses);
        } else {
          window.localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(initialAddresses));
        }
      } catch (e) {
        console.warn('Failed to load addresses from localStorage', e);
      }
    }
    
    setAddresses(initialAddresses);

    // Выбираем дефолтный адрес или первый из списка
    let activeAddress = initialAddresses.find(a => a.isDefault) || initialAddresses[0] || null;

    if (isWeb) {
      try {
        const storedSelectedId = window.localStorage.getItem(STORAGE_KEY);
        if (storedSelectedId) {
          const found = initialAddresses.find(a => a.id === storedSelectedId);
          if (found) {
            activeAddress = found;
          }
        }
      } catch (e) {
        console.warn('Failed to load selected address ID from localStorage', e);
      }
    }

    setSelectedAddress(activeAddress);
  }, []);

  const selectAddress = (id: string) => {
    const found = addresses.find(a => a.id === id);
    if (found) {
      setSelectedAddress(found);
      if (isWeb) {
        try {
          window.localStorage.setItem(STORAGE_KEY, id);
        } catch (e) {
          console.warn('Failed to save selected address ID to localStorage', e);
        }
      }
    }
  };

  const addAddress = (newAddr: Omit<Address, 'id' | 'isDefault'>) => {
    const newId = `addr_${Date.now()}`;
    const addressWithId: Address = {
      ...newAddr,
      id: newId,
      isDefault: addresses.length === 0, // если это первый адрес, делаем его дефолтным
    };

    const updated = [...addresses, addressWithId];
    setAddresses(updated);
    
    if (addresses.length === 0) {
      setSelectedAddress(addressWithId);
    }

    if (isWeb) {
      try {
        window.localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
        if (addresses.length === 0) {
          window.localStorage.setItem(STORAGE_KEY, newId);
        }
      } catch (e) {
        console.warn('Failed to save addresses to localStorage', e);
      }
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectAddress,
        addAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}
