import type { DiagramMetadata } from '../types.js';

export default {
  id: 'pert',
  name: 'PERT Chart',
  description: 'Program Evaluation and Review Technique for project scheduling',
  examples: [
    {
      title: 'Basic PERT Chart',
      isDefault: true,
      code: `pert
    activity: 1-2, 2-3, 2-4, 3-5, 4-5
    optimistic: 2, 5, 1, 8, 3
    likely: 4, 7, 2, 10, 4
    pessimistic: 6, 9, 3, 12, 5`,
    },
    {
      title: 'Software Development Sprint',
      code: `pert
    activity: Start-Dev, Dev-Test, Dev-Docs, Test-Deploy, Docs-Deploy
    optimistic: 3, 2, 1, 1, 1
    likely: 5, 4, 2, 2, 2
    pessimistic: 10, 7, 4, 5, 3`,
    },
    {
      title: 'Complex Multi-Path Project',
      code: `pert
    activity: 1-2, 1-3, 2-4, 3-4, 4-5, 4-6, 5-7, 6-7
    optimistic: 1, 2, 1, 2, 1, 3, 2, 1
    likely: 2, 4, 2, 3, 2, 5, 4, 2
    pessimistic: 3, 6, 4, 5, 3, 8, 6, 4`,
    },
  ],
} satisfies DiagramMetadata;