// src/diagrams/pert/pertDiagram.ts
import type { DiagramDefinition } from '../../diagram-api/types.js';
import db from './pertDb.js';
import renderer from './pertRenderer.js';
import styles from './pertStyles.js';
// @ts-ignore
import parser from './parser/pert.jison';

const pertParser = {
  parse: (text: string): void => {
    db.clear();
    parser.yy = db;
    parser.parse(text);
  }
};

export const diagram: DiagramDefinition = {
  db,
  renderer,
  parser: pertParser,
  styles,
};