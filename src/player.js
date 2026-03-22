import { spawn, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const SOUNDS_DIR = join(__dirname, '..', 'sounds');

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function playFile(filePath, volume = 100) {
  if (!existsSync(filePath)) return;

  let cmd, args;

  if (process.platform === 'darwin') {
    cmd = 'afplay';
    args = ['-v', String(volume / 100), filePath];
  } else if (process.platform === 'win32') {
    const escaped = filePath.replace(/\\/g, '/');
    const mciVol = volume * 10; // MCI range: 0–1000
    const ps = [
      'Add-Type -TypeDefinition \'using System; using System.Text; using System.Runtime.InteropServices; public class MCI { [DllImport("winmm.dll", CharSet=CharSet.Auto)] public static extern int mciSendString(string cmd, StringBuilder ret, int cch, IntPtr hwnd); }\'',
      `[MCI]::mciSendString('open "${escaped}" type mpegvideo alias media', $null, 0, [IntPtr]::Zero)`,
      `[MCI]::mciSendString('setaudio media volume to ${mciVol}', $null, 0, [IntPtr]::Zero)`,
      '[MCI]::mciSendString(\'play media wait\', $null, 0, [IntPtr]::Zero)',
      '[MCI]::mciSendString(\'close media\', $null, 0, [IntPtr]::Zero)',
    ].join('; ');
    try {
      spawnSync('powershell', ['-NonInteractive', '-NoProfile', '-WindowStyle', 'Hidden', '-c', ps], { stdio: 'ignore' });
    } catch {
      // silently fail
    }
    return;
  } else {
    const factor = Math.round(volume / 100 * 32768); // mpg123 range: 0–32768
    cmd = 'mpg123';
    args = ['-q', '-f', String(factor), filePath];
  }

  try {
    const child = spawn(cmd, args, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch {
    // silently fail — hooks must not break Claude Code
  }
}

export function playEvent(theme, event, volume = 100) {
  const files = theme.events[event];
  if (!files || files.length === 0) return;
  const file = pickRandom(files);
  const filePath = join(SOUNDS_DIR, theme.soundDir, file);
  playFile(filePath, volume);
}
