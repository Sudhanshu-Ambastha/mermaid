import type { DiagramMetadata } from '../types.js';

export default {
  id: 'cpm',
  name: 'CPM Diagram',
  description: 'Critical Path Method for deterministic project scheduling',
  examples: [
    {
      title: 'Simple Critical Path',
      isDefault: true,
      code: `cpm
    activity: A-B, B-C, C-D
    duration: 5, 10, 5`,
    },
    {
      title: 'Parallel Activities',
      code: `cpm
    activity: 1-2, 1-3, 2-4, 3-4
    duration: 4, 6, 2, 5`,
    },
    {
      title: 'Construction Phase',
      code: `cpm
    activity: Foundation-Walls, Walls-Roof, Walls-Plumbing, Roof-Finish, Plumbing-Finish
    duration: 7, 5, 4, 6, 3`,
    },
  ],
} satisfies DiagramMetadata;