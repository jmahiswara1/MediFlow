export default {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{js,jsx,cjs,mjs}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,md,html,json}': ['prettier --write'],
}
