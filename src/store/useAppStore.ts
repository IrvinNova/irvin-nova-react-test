import { create } from "zustand";
import CryptoJS from "crypto-js";

interface AppState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  restoreSession: () => void;
}

const SECRET_KEY = "my-secret-key";

// 🔒 Cifrar y descifrar token
const encrypt = (data: string) => CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
const decrypt = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};

export const useAppStore = create<AppState>((set) => ({
  token: null,

  // ✅ Guarda token y hora de login
  setToken: (token) => {
    const encrypted = encrypt(token);
    localStorage.setItem("token", encrypted);
    localStorage.setItem("loginTime", Date.now().toString());
    set({ token });
  },

  // ✅ Limpia sesión
  clearToken: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    set({ token: null });
  },

  // ✅ Restaura sesión al recargar si no ha expirado
  restoreSession: () => {
    const stored = localStorage.getItem("token");
    const lastLoginTime = localStorage.getItem("loginTime");

    if (!stored || !lastLoginTime) {
      set({ token: null });
      return;
    }

    const now = Date.now();
    const diff = now - parseInt(lastLoginTime, 10);

    // 5 minutos = 300000 ms
    if (diff > 5 * 60 * 1000) {
      // Expirada
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      set({ token: null });
    } else {
      // Activa
      const decrypted = decrypt(stored);
      set({ token: decrypted });
    }
  },
}));
