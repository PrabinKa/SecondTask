import CryptoJS from 'react-native-crypto-js';

const encryptData = (data: string, key: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (encryptedData: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export {encryptData, decryptData};
