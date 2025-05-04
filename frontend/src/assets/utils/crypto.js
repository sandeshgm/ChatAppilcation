import { JSEncrypt } from "jsencrypt";

// Asynchronous RSA Key Generation
export const generateRSAKeys = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      const crypt = new JSEncrypt({ default_key_size: 2048 });
      crypt.getKey(); // ⚠️ Required to actually generate keys
      resolve({
        publicKey: crypt.getPublicKey(),
        privateKey: crypt.getPrivateKey(),
      });
    }, 0); // non-blocking
  });

export const encryptMessage = (publicKey, message) => {
  const crypt = new JSEncrypt();
  crypt.setPublicKey(publicKey);
  return crypt.encrypt(message);
};

export const decryptMessage = (privateKey, encryptedMessage) => {
  const crypt = new JSEncrypt();
  crypt.setPrivateKey(privateKey);
  return crypt.decrypt(encryptedMessage);
};
