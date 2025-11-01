import { useTranslation } from 'react-i18next';
import { HiGlobe } from 'react-icons/hi';
import { Button } from 'flowbite-react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const currentLangDisplay = i18n.language === 'en' ? t('language.arabic') : t('language.english');

  return (
    <Button
      onClick={toggleLanguage}
      size="sm"
      color="gray"
      className="w-full flex items-center justify-center gap-2"
    >
      <HiGlobe className="h-4 w-4" />
      <span>{currentLangDisplay}</span>
    </Button>
  );
}
