import crypto from "crypto";
import { algo, cryptoKey, cryptoVector } from "../key";
import { DecryptionResult } from "./decryption.interface";

export default function Decryption(
  encrypted: string,
  type: "json" | "response" | "string",
) {
  const dataR: DecryptionResult = {
    data: null,
    status: false,
    create: null,
  };
  try {
    const encryptedText = Buffer.from(encrypted, "base64");
    const decipher = crypto.createDecipheriv(algo, cryptoKey, cryptoVector);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    const decryptedText = decrypted.toString("utf8");
    if (type === "json") {
      const datadec = JSON.parse(decryptedText);
      dataR.data = datadec.value;
      dataR.create = datadec.create;
      dataR.status = true;

      if (datadec.expire !== undefined && datadec.expire !== null) {
        const now = new Date();
        if (new Date(datadec.expire) < now) {
          dataR.status = false;
        }
      }
      return dataR;
    } else if (type === "response") {
      return JSON.parse(decryptedText);
    } else {
      return decryptedText;
    }
  } catch (e) {
    if (type === "response") {
      return encrypted;
    } else {
      dataR.data = e instanceof Error ? e : new Error(String(e));
      dataR.status = false;
      return dataR;
    }
  }
}
