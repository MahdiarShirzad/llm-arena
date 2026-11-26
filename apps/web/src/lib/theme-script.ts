/**
 * Applies the stored theme before first paint. Kept in sync with the
 * next-themes config in `components/layout/theme-provider.tsx`:
 * attribute="class", defaultTheme="dark", storageKey="theme",
 * enableSystem={false}.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t="dark";var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t}catch(e){}})()`;
