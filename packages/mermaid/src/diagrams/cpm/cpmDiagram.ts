// cspell:ignore cpm cpmdiagram cpmrenderer
import type { DiagramDefinition } from '../../diagram-api/types.js';
import type { CPMModel } from './cpmDb.js';
import db from './cpmDb.js';
import renderer from './cpmRenderer.js';
import styles from './cpmStyles.js';
// @ts-ignore: Jison generated parser
import parser from './parser/cpm.jison';

const cpmDb = db;

const cpmParser = {
  parse: (text: string): void => {
    cpmDb.clear();
    parser.yy = cpmDb; 
    parser.parse(text);
  },
  yy: cpmDb,
};

export const diagram: DiagramDefinition = {
  db,
  renderer,
  parser: cpmParser,
  styles,
};