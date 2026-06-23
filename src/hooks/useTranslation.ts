import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = () => {
    const { t, currentLanguage, setLanguage, availableLanguages } = useLanguage();
    
    return {
        t,
        currentLanguage,
        setLanguage,
        availableLanguages
    };
};