import replace from '@rollup/plugin-replace';

export default {
  // ... otras configuraciones de Rollup ...
  plugins: [
    // ... otros plugins ...
    replace({
      // Otras opciones del plugin...
      preventAssignment: true,
    }),
  ],
};