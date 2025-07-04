import { release } from '@jezvejs/release-tools';

const MAIN_PACKAGE = 'matrix-constructor';

if (process.argv.length < 3) {
  console.log('Usage: release.js <newversion> [<package>]');
  process.exit(1);
}

const newVersion = process.argv[2];
const packageName = (process.argv.length > 3)
  ? process.argv[3]
  : MAIN_PACKAGE;
const isMainPackage = (packageName === MAIN_PACKAGE);

release({
  packageName: null,
  isMainPackage,
  newVersion,
  publish: false,
  buildAllCommand: 'npm run build',
});
