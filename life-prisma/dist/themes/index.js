import path from 'path';
import url from 'url';
import { themeConfig } from './custom-theme/index.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const getThemeDir = (theme) => path.join(__dirname, `./${theme}`);
export const customTheme = {
    ...themeConfig,
    bundlePath: `${getThemeDir(themeConfig.id)}/theme.bundle.js`,
    stylePath: `${getThemeDir(themeConfig.id)}/style.css`,
};
