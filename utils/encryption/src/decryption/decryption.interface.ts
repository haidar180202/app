export interface DecryptionResult {
  data: string | object | null | Error;
  status: boolean;
  create: object | null;
}
