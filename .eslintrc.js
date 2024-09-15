module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // Custom
    'import/no-import-module-exports': 'off',
    'prettier/prettier': 'error',
    'mocha/no-mocha-arrows': 'off',
    'no-console': 'warn',
    // Possible Errors
    'no-await-in-loop': 'error',
    'no-extra-parens': 'off', // necesaria para el correcto funcionamiento de nest: off
    'no-prototype-builtins': 'error',
    'no-template-curly-in-string': 'error',
    'valid-jsdoc': 'error',
    // Best Practices
    'accessor-pairs': 'error',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'class-methods-use-this': 'off',
    complexity: 'off',
    'consistent-return': 'error',
    curly: 'error',
    'default-case': 'error',
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    eqeqeq: 'error',
    'guard-for-in': 'error',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-div-regex': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'off',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'off',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': [
      'off',
      {
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true
      }
    ],
    'no-multi-spaces': [
      'off',
      {
        ignoreEOLComments: true,
        exceptions: {
          AssignmentExpression: true,
          ArrowFunctionExpression: true,
          CallExpression: true,
          VariableDeclarator: true
        }
      }
    ],
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'off',
    'no-proto': 'error',
    'no-restricted-properties': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-warning-comments': 'off',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    radix: 'error',
    'require-await': 'error',
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    yoda: 'error',
    // Variables
    'init-declarations': 'off',
    'no-catch-shadow': 'error',
    'no-label-var': 'error',
    'no-restricted-globals': 'error',
    'no-shadow-restricted-names': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'off',
    'no-use-before-define': 'off',
    // Para que no de error en las enums
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    // Node.js and CommonJS
    'callback-return': 'off',
    'global-require': 'error',
    'handle-callback-err': 'error',
    'no-mixed-requires': 'error',
    'no-new-require': 'error',
    'no-path-concat': 'error',
    'no-process-env': 'off',
    'no-process-exit': 'off',
    'no-restricted-modules': 'error',
    'no-sync': 'error',
    // ECMAScript 6
    'no-underscore-dangle': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': 'off',
    'arrow-spacing': 'error',
    'generator-star-spacing': 'error',
    'no-confusing-arrow': 'error',
    'no-duplicate-imports': 'error',
    'no-restricted-imports': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'off', //se deshabilita para permitir inyección de dependencias
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: false,
          object: false
        }
      },
      {
        enforceForRenamedProperties: true
      }
    ],
    'prefer-numeric-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'prefer-regex-literals': 'off',
    'rest-spread-spacing': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
        allowSeparatedGroups: true
      }
    ],
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'yield-star-spacing': 'error'
  }
}
