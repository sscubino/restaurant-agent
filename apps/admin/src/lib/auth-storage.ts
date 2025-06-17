const AUTH_TOKEN_KEY = "auth_token";

let authToken = localStorage.getItem(AUTH_TOKEN_KEY);

export const setToken = (token: string) => {
  authToken = token;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  if (authToken) return authToken;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeToken = () => {
  authToken = null;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
