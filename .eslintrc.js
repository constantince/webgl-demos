module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "semi": "error",
    "indent": ["error", 4],
    "no-console": "off",
    "react/jsx-filename-extension": [1, {extensions: [".js", ".ts", ".jsx", ".tsx"]}],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
  },
};
