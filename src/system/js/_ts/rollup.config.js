import typescript from 'rollup-plugin-typescript2';

export default {
  input: './jify.ts',

  output: {
    name: 'Jify',
    file: '../jify-1.0.2.js',
    format: 'iife'
  },

  plugins: [
    typescript({
      clean: true,
      cacheRoot: '.cache'
    })
  ]
}