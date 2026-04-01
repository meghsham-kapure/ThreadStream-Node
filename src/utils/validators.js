/**
 * - 6 to 64 characters long
 * - Allows: Uppercase, Lowercase, dots (.), hyphens (-), and spaces
 * - No numbers or other special symbols
 */
const NAME_PATTERN = "^[A-Za-z.\\- ]{6,64}$";

export const validateFullName = (name) => {
  const regex = new RegExp(NAME_PATTERN);
  return regex.test(name?.trim() || "");
};

/**
 * Username Rules:
 * - 4 to 32 characters long
 * - Allows: Letters (A-Z, a-z), Numbers (0-9), and single underscores (_)
 * - Restriction: No double underscores (__) allowed
 */
const USERNAME_PATTERN = "^(?!.*__)[a-zA-Z0-9_]{4,32}$";

export const validateUserName = (username) => {
  const regex = new RegExp(USERNAME_PATTERN);
  return regex.test(username?.trim() || "");
};

/**
 * Email Rules:
 * - 4 to 32 characters total length
 * - Format: text + @ + text + . + text
 * - Restriction: No spaces or multiple @ symbols
 */
const EMAIL_PATTERN = "^(?=.{4,32}$)[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

export const validateEmail = (email) => {
  const regex = new RegExp(EMAIL_PATTERN);
  return regex.test(email?.trim() || "");
};

/**
 * Password Rules:
 * - 8 to 32 characters long
 * - Must contain: at least one Letter, one Number, and one Symbol
 */
const PASSWORD_PATTERN = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,32}$";

export const validatePassword = (password) => {
  const regex = new RegExp(PASSWORD_PATTERN);
  // Note: We usually DON'T trim passwords, as a user might intentionally use a space
  return regex.test(password || "");
};
