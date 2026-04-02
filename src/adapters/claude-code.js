import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { spawnSync } from 'child_process';

const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json');

const EVENT_MAP = {
  SessionStart: 'sessionstart',
  Stop: 'stop',
  Notification: 'question',
  UserPromptSubmit: 'submit',
  SessionEnd: 'sessionend',
};

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function readSettings() {
  return readJson(SETTINGS_PATH);
}

function writeSettings(settings) {
  mkdirSync(join(homedir(), '.claude'), { recursive: true });
  writeJson(SETTINGS_PATH, settings);
}

function getVscodeSettingsPath() {
  if (process.platform === 'win32') {
    return join(process.env.APPDATA || homedir(), 'Code', 'User', 'settings.json');
  }
  if (process.platform === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Code', 'User', 'settings.json');
  }
  return join(homedir(), '.config', 'Code', 'User', 'settings.json');
}

function applyVscode(verbs) {
  try {
    const path = getVscodeSettingsPath();
    const settings = readJson(path);
    settings['claudeCode.spinnerVerbs'] = { mode: 'replace', verbs };
    writeJson(path, settings);
  } catch {
    // VSCode settings not available
  }
}

function resetVscode() {
  try {
    const path = getVscodeSettingsPath();
    const settings = readJson(path);
    delete settings['claudeCode.spinnerVerbs'];
    writeJson(path, settings);
  } catch {
    // VSCode settings not available
  }
}

function isGloballyInstalled() {
  const cmd = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(cmd, ['claudefx'], { stdio: 'ignore' });
  return result.status === 0;
}

export function ensureGlobalInstall() {
  if (isGloballyInstalled()) return;
  console.log('\x1b[2mInstalling claudefx globally for hooks...\x1b[0m');
  const result = spawnSync('npm', ['install', '-g', 'claudefx'], { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error('Global install failed. Run manually: npm install -g claudefx');
  }
}

function isSoundHook(h) {
  return h?.hooks?.some(hh => hh.command?.includes('claudefx hook'));
}

export function apply(theme, volume) {
  const settings = readSettings();
  const hooks = settings.hooks ?? {};

  for (const [event, arg] of Object.entries(EVENT_MAP)) {
    const cleaned = (hooks[event] ?? []).filter(h => !isSoundHook(h));
    cleaned.push({ hooks: [{ type: 'command', command: `npx -y claudefx hook ${arg}` }] });
    hooks[event] = cleaned;
  }

  settings.hooks = hooks;
  settings.spinnerVerbs = { mode: 'replace', verbs: theme.verbs };
  const current = settings['claudefx'] ?? {};
  settings['claudefx'] = { ...current, theme: theme.id, volume: volume ?? current.volume ?? 50 };

  if (theme.statusLine) {
    settings.statusLine = {
      type: 'command',
      command: `npx -y claudefx statusline ${theme.statusLine.label} ${theme.statusLine.ctxLabel ?? '⛏️'} ${theme.statusLine.ctxBar ? 'bar' : ''}`,
    };
  } else {
    delete settings.statusLine;
  }

  writeSettings(settings);
  applyVscode(theme.verbs);
}

export function getVolume() {
  const settings = readSettings();
  return settings['claudefx']?.volume ?? 50;
}

export function setVolume(volume) {
  const settings = readSettings();
  settings['claudefx'] = { ...(settings['claudefx'] ?? {}), volume };
  writeSettings(settings);
}

export function off() {
  const settings = readSettings();
  const hooks = settings.hooks ?? {};

  for (const event of Object.keys(EVENT_MAP)) {
    const cleaned = (hooks[event] ?? []).filter(h => !isSoundHook(h));
    if (cleaned.length === 0) {
      delete hooks[event];
    } else {
      hooks[event] = cleaned;
    }
  }

  if (Object.keys(hooks).length > 0) {
    settings.hooks = hooks;
  } else {
    delete settings.hooks;
  }

  delete settings.spinnerVerbs;
  delete settings['claudefx'];
  delete settings.statusLine;
  writeSettings(settings);
  resetVscode();
}

export function current() {
  const settings = readSettings();
  return settings['claudefx']?.theme ?? null;
}
