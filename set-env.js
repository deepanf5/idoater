const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, './src/environments');
const targetPath = path.join(dirPath, 'environment.ts');

if (fs.existsSync(dirPath)) {
  console.log(`Directory ${dirPath} does not exist. Creating it...`);
  fs.mkdirSync(dirPath, { recursive: true });
}

const envConfigFile = `export const environment = {
  production: true,
  supabaseUrl: '${process.env.supabaseUrl || ''}',
  supabaseAnonKey: '${process.env.supabaseAnonKey || ''}'
};
`;

console.log('Generating production environment file...');

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.error('Error writing environment file:', err);
    throw err;
  } else {
    console.log(`Environment file generated successfully at ${targetPath}`);
  }
});
