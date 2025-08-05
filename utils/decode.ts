// jsonweb
import { jwtDecode, JwtPayload } from "jwt-decode";

// Mendefinisikan tipe kustom yang memperluas JwtPayload
interface CustomJwtPayload extends JwtPayload {
  cisea: any;
}

export function decodeJWT(token: any): CustomJwtPayload | null {
  try {
    // Decode the JWT without verifying the signature
    const decoded = jwtDecode(token) as CustomJwtPayload;
    return decoded;
  } catch (error) {
    console.error("Gagal mendekripsi JWT:", error);
    return null;
  }
}
// import {Buffer} from "buffer"

// export async function decodeJWT(base64String:any) {
//   try {
//     const decodedBuffer = await Buffer.from(base64String, 'base64');
//     return decodedBuffer.toString('utf-8');
//   } catch (error) {
//     console.error('Gagal mendekripsi Base64:', error);
//     return '';
//   }
// }
