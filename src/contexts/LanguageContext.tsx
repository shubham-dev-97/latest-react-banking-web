import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = {
    code: string;
    name: string;
    nativeName: string;
};

type LanguageContextType = {
    currentLanguage: Language;
    setLanguage: (languageCode: string) => void;
    t: (key: string, defaultValue?: string) => string;
    availableLanguages: Language[];
};

const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
     { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
];

const translationsCache: Record<string, Record<string, string>> = {};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    useEffect(() => {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('appLanguage');
        if (savedLanguage) {
            const lang = languages.find(l => l.code === savedLanguage);
            if (lang) {
                setCurrentLanguage(lang);
                loadTranslations(savedLanguage);
            }
        } else {
            // Detect browser language
            const browserLang = navigator.language.split('-')[0];
            const matchedLang = languages.find(l => l.code === browserLang);
            if (matchedLang) {
                setCurrentLanguage(matchedLang);
                loadTranslations(matchedLang.code);
            } else {
                loadTranslations('en');
            }
        }
    }, []);

    const loadTranslations = async (languageCode: string) => {
        // Check cache first
        if (translationsCache[languageCode]) {
            setTranslations(translationsCache[languageCode]);
            return;
        }

        try {
            const response = await fetch(`/locales/${languageCode}.json`);
            if (response.ok) {
                const data = await response.json();
                translationsCache[languageCode] = data;
                setTranslations(data);
                console.log(`Loaded translations for ${languageCode}`);
            } else {
                console.error(`Failed to load ${languageCode}.json`);
                // Fallback to English
                const fallbackResponse = await fetch(`/locales/en.json`);
                const fallbackData = await fallbackResponse.json();
                translationsCache['en'] = fallbackData;
                setTranslations(fallbackData);
            }
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    };

    const setLanguage = (languageCode: string) => {
        const language = languages.find(l => l.code === languageCode);
        if (language) {
            setCurrentLanguage(language);
            localStorage.setItem('appLanguage', languageCode);
            loadTranslations(languageCode);
        }
    };

    const t = (key: string, defaultValue?: string): string => {
        // Handle nested keys like 'home.portfolio_overview'
        const keys = key.split('.');
        let value: any = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue || key;
            }
        }
        
        return value || defaultValue || key;
    };

    return (
        <LanguageContext.Provider value={{
            currentLanguage,
            setLanguage,
            t,
            availableLanguages: languages
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
