export const prepareCookieString = (cookies: chrome.cookies.Cookie[]): string => {
  return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}

export const getCookiesForUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({ url }, (cookies) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(prepareCookieString(cookies));
    });
  });
}