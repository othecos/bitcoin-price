export enum LocalStorageKeys {
  BITCOIN_PRICE = "bitcoin:price",
}

export class LocalStorageService {
  static getItem(key: LocalStorageKeys) {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  }

  static setItem(key: LocalStorageKeys, value: string) {
    if (typeof window === "undefined") {
      return null;
    }
    localStorage.setItem(key, value);
  }

  static removeItem(key: LocalStorageKeys) {
    if (typeof window === "undefined") {
      return null;
    }
    localStorage.removeItem(key);
  }

  static clear() {
    if (typeof window === "undefined") {
      return null;
    }
    localStorage.clear();
  }
}
