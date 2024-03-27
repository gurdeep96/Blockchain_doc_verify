module.exports = {
  parser: "@typescript-eslint/parser", // Default parser for all files

  plugins: ["@typescript-eslint"], // Default plugins

  overrides: [
    {
      files: ["*.js"], // Files ending with .js
      parserOptions: {
        sourceType: "module", // Enable ES modules for JavaScript files
        ecmaFeatures: {
          // Optional: Specify ECMAScript features supported in your JS files
        },
      },
      rules: {
        // Optional: Override or disable specific rules for JavaScript files
      },
    },
  ],
};
