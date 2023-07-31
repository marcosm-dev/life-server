import { ComponentLoader } from 'adminjs';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();
export const add = (url, componentName) => componentLoader.add(componentName, path.join(__dirname, url));
export const override = (url, componentName) => componentLoader.override(componentName, path.join(__dirname, url));
export const DASHBOARD = add('components/dashboard', 'Dashboard');
