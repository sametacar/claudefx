#!/usr/bin/env node
import { list, get } from '../src/themes/index.js';
import * as claudeCode from '../src/adapters/claude-code.js';
import { playEvent } from '../src/player.js';
import { showMenu } from '../src/menu.js';

const [,, command, ...args] = process.argv;

function help() {
  console.log(`
claudefx — Retro game sounds for Claude Code

Usage:
  claudefx               Interactive theme menu
  claudefx list          List available themes
  claudefx use <theme>   Apply a theme
  claudefx off           Disable sounds
  claudefx current       Show active theme
  claudefx volume <n>    Set volume (0–100)
  claudefx uninstall     Remove hooks, verbs, and uninstall package
  claudefx hook <event>  Play sound for event (called by hooks)
`);
}

switch (command) {
  case 'list': {
    const themes = list();
    console.log('\nAvailable themes:\n');
    for (const { id, name, full } of themes) {
      const suffix = full ? ' \x1b[2m[full]\x1b[0m' : '';
      console.log(`  ${id.padEnd(12)} ${name}${suffix}`);
    }
    console.log();
    break;
  }

  case 'use': {
    const id = args[0];
    if (!id) {
      console.error('Usage: claudefx use <theme>');
      process.exit(1);
    }
    try {
      const theme = get(id);
      try { claudeCode.ensureGlobalInstall(); } catch { /* npx handles it */ }
      claudeCode.apply(theme);
      const fullNote = theme.full ? ' (full)' : '';
      console.log(`\x1b[1;32m✓ Applied "${theme.name}"${fullNote}\x1b[0m`);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
    break;
  }

  case 'off': {
    claudeCode.off();
    console.log('\x1b[1;33m✓ Sounds disabled\x1b[0m');
    break;
  }

  case 'uninstall': {
    claudeCode.off();
    const { spawnSync } = await import('child_process');
    const result = spawnSync('npm', ['uninstall', '-g', 'claudefx'], { stdio: 'inherit' });
    if (result.status === 0) {
      console.log('\x1b[1;32m✓ claudefx uninstalled\x1b[0m');
    } else {
      console.error('npm uninstall failed. Run manually: npm uninstall -g claudefx');
      process.exit(1);
    }
    break;
  }

  case 'current': {
    const id = claudeCode.current();
    if (!id) {
      console.log('No theme active (sounds off)');
    } else {
      try {
        const theme = get(id);
        const fullNote = theme.full ? ' (full)' : '';
        console.log(`Active theme: ${theme.name}${fullNote} [${id}]`);
      } catch {
        console.log(`Active theme: ${id}`);
      }
    }
    break;
  }

  case 'volume': {
    const vol = parseInt(args[0], 10);
    if (isNaN(vol) || vol < 0 || vol > 100) {
      console.error('Usage: claudefx volume <0–100>');
      process.exit(1);
    }
    claudeCode.setVolume(vol);
    console.log(`\x1b[1;32m✓ Volume set to ${vol}%\x1b[0m`);
    break;
  }

  case 'hook': {
    const event = args[0];
    if (!event) process.exit(0);
    const id = claudeCode.current();
    if (!id) process.exit(0);
    try {
      const theme = get(id);
      const volume = claudeCode.getVolume();
      playEvent(theme, event, volume);
    } catch {
      // silently ignore — hooks must not break Claude Code
    }
    break;
  }

  case undefined: {
    showMenu();
    break;
  }

  default: {
    help();
    break;
  }
}
