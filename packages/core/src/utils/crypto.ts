import CryptoJS from 'crypto-js';
import { API_ENCRYPTION_KEY as DEFAULT_API_KEY } from '@env';

export let API_ENCRYPTION_KEY = DEFAULT_API_KEY || '';

export const setEncryptionKey = (key: string) => {
  API_ENCRYPTION_KEY = key;
};

export const encryptData = (data: any, key: string = API_ENCRYPTION_KEY): string => {
  if (!key) {
    throw new Error('Encryption key is not set. Call setEncryptionKey() before encrypting.');
  }
  const plainText = typeof data === 'string' ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(plainText, key).toString();
};

export const decryptData = (ciphertext: string, key: string = API_ENCRYPTION_KEY): any => {
  if (!key) {
    throw new Error('Encryption key is not set. Call setEncryptionKey() before decrypting.');
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decryptedText);
  } catch {
    return decryptedText;
  }
};
