// Utility functions for Settings page

export const MAX_AVATAR_SIZE = 1_000_000; // 1 MB

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "New password needs at least 6 characters";
  }
  return null;
};

export const readFileAsDataURL = (file, callback, errorCallback) => {
  if (!file) return;
  if (file.size > MAX_AVATAR_SIZE) {
    errorCallback?.("Picture must be under 1 MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback?.(reader.result);
  reader.onerror = () => errorCallback?.("Failed to read image file");
  reader.readAsDataURL(file);
};
