// cspell:ignore pert pertrenderer
import { log } from '../../logger.js';

export interface PERTActivity {
  from: string;
  to: string;
  te: number;
  variance: number;
  isCritical: boolean;
}

export interface PERTEvent {
  id: string;
  e: number; 
  l: number; 
  successors: { to: string; te: number }[];
  predecessors: { from: string; te: number }[];
}

export interface PERTModel {
  events: Record<string, PERTEvent>;
  activities: PERTActivity[];
}

let events: Record<string, PERTEvent> = {};
let activities: PERTActivity[] = [];

// Temp storage for Jison
let tempActivities: { from: string; to: string }[] = [];
let tempTo: number[] = [];
let tempTm: number[] = [];
let tempTp: number[] = [];

export const clear = (): void => {
  events = {};
  activities = [];
  tempActivities = [];
  tempTo = [];
  tempTm = [];
  tempTp = [];
};

export const setActivities = (list: { from: string; to: string }[]): void => { tempActivities = list; };
export const setOptimistic = (nums: number[]): void => { tempTo = nums; };
export const setLikely = (nums: number[]): void => { tempTm = nums; };
export const setPessimistic = (nums: number[]): void => { tempTp = nums; };

export const addActivity = (from: string, to: string, topt: number, tml: number, tpess: number): void => {
  const te = (topt + 4 * tml + tpess) / 6;
  const variance = Math.pow((tpess - topt) / 6, 2);

  activities.push({ from, to, te, variance, isCritical: false });

  [from, to].forEach((id) => {
    if (!events[id]) {
      events[id] = { id, e: 0, l: Infinity, successors: [], predecessors: [] };
    }
  });

  events[from].successors.push({ to, te });
  events[to].predecessors.push({ from, te });
};

export const getModel = (): PERTModel => {
  // Transfer Jison lists to internal model
  tempActivities.forEach((act, i) => {
    addActivity(act.from, act.to, tempTo[i] ?? 0, tempTm[i] ?? 0, tempTp[i] ?? 0);
  });

  const eventIds = Object.keys(events).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  eventIds.forEach((id) => {
    const node = events[id];
    node.e = node.predecessors.length === 0 ? 0 : Math.max(...node.predecessors.map((p) => events[p.from].e + p.te));
  });

  const lastId = eventIds[eventIds.length - 1];
  const projectTime = events[lastId]?.e ?? 0;

  [...eventIds].reverse().forEach((id) => {
    const node = events[id];
    node.l = node.successors.length === 0 ? projectTime : Math.min(...node.successors.map((s) => events[s.to].l - s.te));
  });

  activities.forEach((act) => {
    const start = events[act.from];
    const end = events[act.to];
    act.isCritical = Math.abs(start.e + act.te - end.e) < 0.01 && Math.abs(start.l + act.te - end.l) < 0.01;
  });

  return { events, activities };
};

export default { clear, setActivities, setOptimistic, setLikely, setPessimistic, getModel };