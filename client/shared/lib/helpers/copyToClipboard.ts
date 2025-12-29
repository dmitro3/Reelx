/**
 * Копирует текст в буфер обмена пользователя
 * @param text - Текст для копирования
 * @returns Promise<boolean> - true если успешно, false если ошибка
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        // Проверяем поддержку Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                console.error('Failed to copy text:', err);
                return false;
            }
        }
    } catch (err) {
        console.error('Failed to copy text:', err);
        return false;
    }
};

