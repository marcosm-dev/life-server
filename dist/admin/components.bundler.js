import { ComponentLoader } from 'adminjs';
import path from 'path';
export const componentLoader = new ComponentLoader();
export const add = (url, componentName) => componentLoader.add(componentName, path.join(__dirname, url));
