
import { ao2Britons } from './ao2-britons.js';
import { ao2Franks } from './ao2-franks.js';
import { ao2Turks } from './ao2-turks.js';
import { scTerran } from './sc-terran.js';
import { scProtoss } from './sc-protoss.js';
import { wcOrc } from './wc-orc.js';
import { wcHuman } from './wc-human.js';
import { mk } from './mk.js';

const themes = {
  'sc-terran': scTerran,
  'sc-protoss': scProtoss,
  'wc-orc': wcOrc,
  'wc-human': wcHuman,
  mk,
  'ao2-britons': ao2Britons,
  'ao2-franks': ao2Franks,
  'ao2-turks': ao2Turks,
};

export function list() {
  return Object.values(themes);
}

export function get(id) {
  const theme = themes[id];
  if (!theme) {
    throw new Error(`Unknown theme: "${id}". Available: ${Object.keys(themes).join(', ')}`);
  }
  return theme;
}
