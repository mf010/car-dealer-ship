import i18n from '../i18n';

/**
 * Format currency with LYD (Libyan Dinar)
 * NOTE: Always uses Western digits (123456789) as requested
 * @param amount - The amount to format
 * @param locale - Optional locale override
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, locale?: string): string => {
  const currentLocale = locale || i18n.language || 'en';
  
  try {
    // Always use 'en-US' numbering system to keep Western digits
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LYD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    let formatted = formatter.format(amount);
    
    // For Arabic, move currency symbol to the end and use Arabic symbol
    if (currentLocale === 'ar') {
      // Remove 'LYD' from the beginning and add 'د.ل' at the end
      formatted = formatted.replace('LYD', '').trim() + ' د.ل';
    }
    
    return formatted;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount.toFixed(2)} LYD`;
  }
};

/**
 * Format number with locale awareness
 * NOTE: Always uses Western digits (123456789) as requested
 * @param number - The number to format
 * @param locale - Optional locale override
 * @returns Formatted number string
 */
export const formatNumber = (number: number, locale?: string): string => {
  try {
    // Always use 'en-US' to keep Western digits
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};

/**
 * Format date with locale awareness
 * @param dateString - The date string to format
 * @param locale - Optional locale override
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string, locale?: string): string => {
  if (!dateString) return 'N/A';
  
  const currentLocale = locale || i18n.language || 'en';
  
  try {
    const date = new Date(dateString);
    
    // For Arabic, use Arabic locale but with Western digits
    const dateLocale = currentLocale === 'ar' ? 'ar-LY' : 'en-US';
    
    let formatted = date.toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    
    // Convert Arabic-Indic numerals to Western numerals if present
    if (currentLocale === 'ar') {
      formatted = convertToWesternNumerals(formatted);
    }
    
    return formatted;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Convert Arabic-Indic numerals to Western numerals
 * @param str - String containing Arabic-Indic numerals
 * @returns String with Western numerals
 */
const convertToWesternNumerals = (str: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const westernNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = str;
  arabicNumerals.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), westernNumerals[index]);
  });
  
  return result;
};

/**
 * Format datetime with locale awareness
 * @param dateString - The datetime string to format
 * @param locale - Optional locale override
 * @returns Formatted datetime string
 */
export const formatDateTime = (dateString?: string, locale?: string): string => {
  if (!dateString) return 'N/A';
  
  const currentLocale = locale || i18n.language || 'en';
  
  try {
    const date = new Date(dateString);
    const dateLocale = currentLocale === 'ar' ? 'ar-LY' : 'en-US';
    
    let formatted = date.toLocaleString(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Convert to Western numerals for Arabic
    if (currentLocale === 'ar') {
      formatted = convertToWesternNumerals(formatted);
    }
    
    return formatted;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return dateString;
  }
};
