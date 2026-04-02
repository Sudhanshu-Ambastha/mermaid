// cspell:ignore pert
import type { ExternalDiagramDefinition } from '../../diagram-api/types.js';

const id = 'pert';

const detector = (text: string): boolean => /^\s*pert/i.test(text);

const loader = async () => {
  const { diagram } = await import('./pertDiagram.js');
  return { id, diagram };
};

const pertDetector: ExternalDiagramDefinition = { 
  id, 
  detector, 
  loader 
};

export default pertDetector;