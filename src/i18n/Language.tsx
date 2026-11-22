import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MESSAGES, type Lang, type MessageKey } from "./messages";

const LANG_KEY = "haqpath.lang.v1";

interface LanguageValue {
  lang: Lang;
  t: (key: MessageKey) => string;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

function readLang(): Lang {
  try {
    return globalThis.localStorage.getItem(LANG_KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
    try {
      globalThis.localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Preference stays in memory if storage is blocked.
    }
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((current) => (current === "en" ? "hi" : "en"));
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      t: (key) => MESSAGES[lang][key],
      toggle,
    }),
    [lang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext);
  if (value === null) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
