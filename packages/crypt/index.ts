import CryptoJS from "crypto-js";
import { cryptoIv, cryptoKey } from "./keys";

interface EncryptedData {
  create: Date;
  [key: string]: any;
}

export default class Crypto {
  private key = CryptoJS.enc.Utf8.parse(cryptoKey);
  private vector = CryptoJS.enc.Utf8.parse(cryptoIv);

  public async encrypt(data: any): Promise<any> {
    return new Promise((res) => {
      const now = new Date();

      const temp: EncryptedData = {
        ...data,
        create: now,
      };

      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(temp), this.key, {
        keySize: 128 / 8,
        iv: this.vector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      res(encrypted.toString());
    });
  }

  public async decrypt(encrypted: string): Promise<any> {
    return new Promise((res, rej) => {
      try {
        const byte = CryptoJS.AES.decrypt(encrypted, this.key, {
          keySize: 128 / 8,
          iv: this.vector,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        const data = byte.toString(CryptoJS.enc.Utf8);
        if (!data) {
          throw new Error("Decryption resulted in empty string");
        }
        res(data);
      } catch (error) {
        rej(new Error("Decryption failed: " + error));
      }
    });
  }
}
