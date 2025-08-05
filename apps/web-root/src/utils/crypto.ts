import CryptoJS from "crypto-js";

interface EncryptedData {
  create: Date;
  [key: string]: any;
}

export const useCrypto = () => {
  const cryptoKey = process.env.PUBLIC_CRYPTO_KEY || "";
  const cryptoIv = process.env.PUBLIC_CRYPTO_IV || "";

  const getKeyAndIv = () => {
    const key = CryptoJS.enc.Utf8.parse(cryptoKey);
    const iv = CryptoJS.enc.Utf8.parse(cryptoIv);
    return { key, iv };
  };

  const encryptSync = (data: any): string => {
    const { key, iv } = getKeyAndIv();
    const timestamp = new Date();

    const tampData: EncryptedData = {
      ...data,
      create: timestamp,
    };

    const dataString = JSON.stringify(tampData);

    const encrypted = CryptoJS.AES.encrypt(dataString, key, {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  };

  const encrypt = async (data: any): Promise<string> => {
    return new Promise((resolve) => {
      const encrypted = encryptSync(data);
      resolve(encrypted);
    });
  };

  const decrypt = async (ciphertext: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        const { key, iv } = getKeyAndIv();

        // First, try to decrypt the data
        const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
          keySize: 128 / 8,
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });

        // Convert to string and handle potential encoding issues
        const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedStr) {
          throw new Error("Decryption resulted in empty string");
        }

        // Try to parse the JSON
        try {
          const parsed = JSON.parse(decryptedStr);
          resolve(parsed);
        } catch (parseError) {
          // If JSON parsing fails, return the raw decrypted string
          resolve(decryptedStr);
        }
      } catch (error) {
        reject(new Error(`Decryption failed: ${error}`));
      }
    });
  };

  const objTrimStr = (obj: any): any => {
    if (typeof obj === "string") {
      return obj.trim();
    } else if (typeof obj === "object") {
      if (Array.isArray(obj)) {
        return obj.map((item) => objTrimStr(item));
      } else {
        const trimmedObj: { [key: string]: any } = {};
        Object.keys(obj).forEach((key) => {
          trimmedObj[key] = objTrimStr(obj[key]);
        });
        return trimmedObj;
      }
    }
    return obj;
  };

  const makeHash = (data: any): string => {
    const payload = JSON.stringify(objTrimStr(data));
    return CryptoJS.SHA3(payload, { outputLength: 512 }).toString(
      CryptoJS.enc.Base64,
    );
  };

  return {
    encrypt,
    encryptSync,
    decrypt,
    makeHash,
  };
};
