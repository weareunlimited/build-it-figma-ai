const esbuild = require('esbuild');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const placeholder = '__OPENAI_API_KEY__';

fs.readFile('widget-src/helpers.ts', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(placeholder, apiKey);

  fs.writeFile('widget-src/helpers.ts', result, 'utf8', function(err) {
     if (err) return console.log(err);

     esbuild.build({
       entryPoints: ['widget-src/code.tsx'],
       bundle: true,
       outfile: 'dist/code.js',
       target: 'es6',
     }).then(() => {
       fs.readFile('widget-src/helpers.ts', 'utf8', function(err, data) {
         if (err) {
           return console.log(err);
         }
         const result = data.replace(apiKey, placeholder);

         fs.writeFile('widget-src/helpers.ts', result, 'utf8', function(err) {
           if (err) return console.log(err);
         });
       });
     }).catch(() => process.exit(1));
  });
});