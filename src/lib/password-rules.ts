const COMMON_PASSWORDS = new Set([
  "password1",
  "password123",
  "contraseña1",
  "contrasena1",
  "qwerty123",
  "12345678a",
  "abcdefg1",
]);

export function getPasswordRuleError(password: string) {
  if (!password) return "Escribe una contraseña.";
  if (password.length < 8) return "La contraseña debe tener mínimo 8 caracteres.";
  if (password.length > 128) return "La contraseña es demasiado larga.";

  const hasLetter = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(password);
  const hasNumber = /\d/.test(password);
  const repeatedCharacter = /^(.)\1+$/.test(password);

  if (!hasLetter || !hasNumber || repeatedCharacter || COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "Usa una contraseña más segura: combina letras y números.";
  }

  return null;
}
