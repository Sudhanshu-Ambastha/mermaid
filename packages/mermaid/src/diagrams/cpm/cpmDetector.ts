import type { ExternalDiagramDefinition } from '../../diagram-api/types.js';

const id = 'cpm';
const detector = (text: string): boolean => /^\s*cpm/i.test(text);
const loader = async () => {
  const { diagram } = await import('./cpmDiagram.js');
  return { id, diagram };
};

const cpmDetector: ExternalDiagramDefinition = { id, detector, loader };
export default cpmDetector;