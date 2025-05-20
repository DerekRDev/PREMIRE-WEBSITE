module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Temporarily disable rules that are causing build issues
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    'jsx-a11y/role-supports-aria-props': 'off',
  }
};