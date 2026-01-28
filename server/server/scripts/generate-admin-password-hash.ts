import * as bcrypt from 'bcrypt';

/**
 * Скрипт для генерации хэша пароля админа
 * 
 * Использование:
 *   npx ts-node scripts/generate-admin-password-hash.ts <password>
 * 
 * Пример:
 *   npx ts-node scripts/generate-admin-password-hash.ts mySecurePassword123
 */

const password = process.argv[2];

if (!password) {
  console.error('Ошибка: Укажите пароль для хэширования');
  console.log('Использование: npx ts-node scripts/generate-admin-password-hash.ts <password>');
  process.exit(1);
}

async function generateHash() {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Хэш пароля успешно сгенерирован:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(hash);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Добавьте в .env файл (ВАЖНО: используйте одинарные кавычки!):');
    console.log(`ADMIN_LOGIN=your_admin_login`);
    console.log(`ADMIN_PASSWORD_HASH='${hash}'\n`);
    console.log('Или экранируйте $ символы:');
    console.log(`ADMIN_PASSWORD_HASH=\\$${hash.substring(1)}\n`);
  } catch (error) {
    console.error('Ошибка при генерации хэша:', error);
    process.exit(1);
  }
}

generateHash();
