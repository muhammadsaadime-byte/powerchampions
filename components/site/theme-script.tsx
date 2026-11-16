/**
 * Applies a saved theme choice before first paint (no flash of the wrong theme).
 * With no saved choice <html> has no data-theme and the CSS follows the OS setting.
 * Must stay tiny and dependency-free: it is inlined into every page's HTML.
 */
const code = `try{var t=localStorage.getItem("pc-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
