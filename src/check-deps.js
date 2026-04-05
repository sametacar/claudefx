import { spawnSync } from 'child_process';

function commandExists(cmd) {
  try {
    const checker = process.platform === 'win32' ? 'where' : 'which';
    const result = spawnSync(checker, [cmd], { stdio: 'ignore' });
    return result.status === 0;
  } catch {
    return false;
  }
}

/**
 * Checks that the OS-specific audio tool required by claudefx is available.
 * Prints a warning to stderr if it is missing.
 *
 * Requirements (from README):
 *   macOS   — afplay      (built-in)
 *   Windows — powershell  (built-in)
 *   Linux   — mpg123      (must be installed separately)
 */
export function checkDependencies() {
  const { platform } = process;

  if (platform === 'darwin') {
    if (!commandExists('afplay')) {
      console.warn(
        '\x1b[1;33m⚠  Warning:\x1b[0m \x1b[33mafplay\x1b[0m is not accessible.\n' +
        '   Sound playback requires afplay, which is built into macOS.\n' +
        '   Try reinstalling macOS command-line tools: xcode-select --install'
      );
      console.warn();
    }
  } else if (platform === 'win32') {
    if (!commandExists('powershell')) {
      console.warn(
        '\x1b[1;33m⚠  Warning:\x1b[0m \x1b[33mPowerShell\x1b[0m is not accessible.\n' +
        '   Sound playback requires PowerShell, which is built into Windows.\n' +
        '   Make sure PowerShell is in your PATH.'
      );
      console.warn();
    }
  } else {
    // Linux / other Unix-like
    if (!commandExists('mpg123')) {
      console.warn(
        '\x1b[1;33m⚠  Warning:\x1b[0m \x1b[33mmpg123\x1b[0m is not installed or not in PATH.\n' +
        '   Sound playback on Linux requires mpg123.\n' +
        '\n' +
        '   Install it with:  \x1b[1msudo apt install mpg123\x1b[0m\n' +
        '   Or (Fedora/RHEL): \x1b[1msudo dnf install mpg123\x1b[0m\n' +
        '   Or (Arch):        \x1b[1msudo pacman -S mpg123\x1b[0m'
      );
      console.warn();
    }
  }
}
