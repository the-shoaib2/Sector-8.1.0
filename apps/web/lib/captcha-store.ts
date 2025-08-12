// Shared in-memory store for CAPTCHA codes (use Redis in production)
// Singleton pattern for CAPTCHA store to ensure persistence
class CaptchaStore {
  private static instance: CaptchaStore;
  private store: Map<string, { code: string; expires: number }>;

  private constructor() {
    this.store = new Map<string, { code: string; expires: number }>();
  }

  public static getInstance(): CaptchaStore {
    if (!CaptchaStore.instance) {
      CaptchaStore.instance = new CaptchaStore();
    }
    return CaptchaStore.instance;
  }

  public set(id: string, code: string, expires: number): void {
    this.store.set(id, { code, expires });
  }

  public get(id: string): { code: string; expires: number } | undefined {
    return this.store.get(id);
  }

  public delete(id: string): boolean {
    return this.store.delete(id);
  }

  public clear(): void {
    this.store.clear();
  }

  public size(): number {
    return this.store.size;
  }
}



// Clean up expired CAPTCHAs
export function cleanupExpiredCaptchas() {
  const now = Date.now();
  const store = CaptchaStore.getInstance();
  // We need to get all entries and check them
  const entries = Array.from(store['store'].entries());
  for (const [key, value] of entries) {
    if (value.expires <= now) {
      store.delete(key);
    }
  }
}

// Store a CAPTCHA code
export function storeCaptcha(id: string, code: string, expiresInMs: number = 5 * 60 * 1000) {
  const store = CaptchaStore.getInstance();
  store.set(id, code, Date.now() + expiresInMs);
}

// Get a stored CAPTCHA
export function getCaptcha(id: string) {
  const store = CaptchaStore.getInstance();
  return store.get(id);
}

// Remove a CAPTCHA from store
export function removeCaptcha(id: string) {
  const store = CaptchaStore.getInstance();
  return store.delete(id);
}

// Validate CAPTCHA input
export function validateCaptcha(id: string, userInput: string): boolean {
  const store = CaptchaStore.getInstance();
  
  const storedCaptcha = store.get(id);
  
  if (!storedCaptcha) {
    return false;
  }
  
  if (storedCaptcha.expires <= Date.now()) {
    store.delete(id);
    return false;
  }
  
  const isValid = userInput.toUpperCase() === storedCaptcha.code.toUpperCase();
  
  // Remove CAPTCHA after validation attempt
  store.delete(id);
  
  return isValid;
} 