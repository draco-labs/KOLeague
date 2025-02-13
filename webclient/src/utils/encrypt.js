import crypto from 'crypto';

function getKeyFromPassword(password) {
  return crypto.createHash('sha256').update(password).digest('base64').substr(0, 32); // Tạo khóa 32-byte từ mật khẩu
}

export function encrypt(text, password) {
  const iv = crypto.randomBytes(16);
  const key = getKeyFromPassword(password);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData, password) {
  try {
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = getKeyFromPassword(password);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return false
  }
}
