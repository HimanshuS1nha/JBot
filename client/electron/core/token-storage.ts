import keytar from "keytar";

export class TokenStorage {
  static key = "token";
  static SERVICE = "JBot";

  static async getToken() {
    return await keytar.getPassword(TokenStorage.SERVICE, TokenStorage.key);
  }

  static async setToken(value: string) {
    return await keytar.setPassword(
      TokenStorage.SERVICE,
      TokenStorage.key,
      value,
    );
  }

  static async deleteToken() {
    return await keytar.deletePassword(TokenStorage.SERVICE, TokenStorage.key);
  }
}
