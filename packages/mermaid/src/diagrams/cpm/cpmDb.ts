// cspell:ignore cpm cpmdiagram cpmrenderer
import { log } from '../../logger.js';

export interface CPMTask {
  id: string;
  duration: number;
  predecessors: string[];
  successors: string[];
  es: number;
  ef: number;
  ls: number;
  lf: number;
  slack: number;
  isCritical: boolean;
}

export interface CPMModel {
  tasks: Record<string, CPMTask>;
  activityList: string[];
  sortedNodes: CPMTask[];
}

let activities: Record<string, CPMTask> = {};
let order: string[] = [];

export const clear = (): void => {
  activities = {};
  order = [];
};

export const setActivities = (ids: string[]): void => {
  order = ids;
  ids.forEach((id: string) => {
    activities[id] = {
      id,
      duration: 0,
      predecessors: [],
      successors: [],
      es: 0,
      ef: 0,
      ls: 0,
      lf: 0,
      slack: 0,
      isCritical: false,
    };
  });
};

export const setDurations = (nums: number[]): void => {
  order.forEach((id: string, i: number) => {
    if (activities[id]) {
      activities[id].duration = nums[i] ?? 0;
    }
  });
};

export const setPredecessors = (preds: string[][]): void => {
  order.forEach((id: string, i: number) => {
    if (activities[id]) {
      // Filter out empty strings or underscore placeholders
      activities[id].predecessors = (preds[i] || []).filter((p: string) => p && p !== '_');
    }
  });
};

export const getModel = (): CPMModel => {
  const nodes: CPMTask[] = Object.values(activities);

  // 1. Build Successors Map
  nodes.forEach((n: CPMTask) => {
    n.successors = [];
    nodes.forEach((s: CPMTask) => {
      if (s.predecessors.includes(n.id)) {
        n.successors.push(s.id);
      }
    });
  });

  // 2. Topological Sort (Typed)
  const sorted: CPMTask[] = [];
  const visited: Set<string> = new Set();

  const visit = (id: string): void => {
    if (visited.has(id) || !activities[id]) return;
    activities[id].predecessors.forEach((p: string) => visit(p));
    visited.add(id);
    sorted.push(activities[id]);
  };

  order.forEach((id: string) => visit(id));

  // 3. Forward Pass
  sorted.forEach((n: CPMTask) => {
    n.es = n.predecessors.length === 0 
      ? 0 
      : Math.max(...n.predecessors.map((p: string) => activities[p]?.ef ?? 0));
    n.ef = n.es + n.duration;
  });

  // 4. Backward Pass
  const projectFinish: number = Math.max(...nodes.map((n: CPMTask) => n.ef), 0);
  
  [...sorted].reverse().forEach((n: CPMTask) => {
    n.lf = n.successors.length === 0 
      ? projectFinish 
      : Math.min(...n.successors.map((s: string) => activities[s]?.ls ?? projectFinish));
    
    n.ls = n.lf - n.duration;
    n.slack = n.lf - n.ef;
    n.isCritical = Math.abs(n.slack) < 0.001;
  });

  return { tasks: activities, activityList: order, sortedNodes: sorted };
};

export default { clear, setActivities, setDurations, setPredecessors, getModel };