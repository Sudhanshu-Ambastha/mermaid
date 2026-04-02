// cspell:ignore pert pertrenderer
import { select } from 'd3';
import db from './pertDb.js';

const RADIUS = 30;
const X_SPACING = 250;
const Y_SPACING = 180;

export const draw = (text: string, id: string) => {
  const { events, activities } = db.getModel();
  const svg = select(`[id="${id}"]`);
  svg.selectAll('*').remove();

  const defs = svg.append('defs');
  
  const addMarker = (markerId: string, color: string) => {
    defs.append('marker')
      .attr('id', markerId)
      .attr('viewBox', '0 0 10 7')
      .attr('refX', 9)
      .attr('refY', 3.5)
      .attr('markerWidth', 10)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3.5, 0 7')
      .attr('fill', color);
  };

  addMarker('arrow-pert-norm', 'black');
  addMarker('arrow-pert-crit', '#ff4d4d');

  const eventLevels: Record<string, number> = {};
  const levels: Record<number, string[]> = {};
  
  const eventIds = Object.keys(events).sort((a, b) => 
    a.localeCompare(b, undefined, { numeric: true })
  );

  eventIds.forEach((id) => {
    let level = 0;
    if (events[id].predecessors.length > 0) {
      level = Math.max(...events[id].predecessors.map((p) => (eventLevels[p.from] ?? 0) + 1));
    }
    eventLevels[id] = level;
    if (!levels[level]) levels[level] = [];
    levels[level].push(id);
  });

  const positions: Record<string, { x: number; y: number }> = {};
  let maxEventsInLevel = 0;
  
  Object.keys(levels).forEach((levelIdxStr) => {
    const levelIdx = parseInt(levelIdxStr);
    const ids = levels[levelIdx];
    maxEventsInLevel = Math.max(maxEventsInLevel, ids.length);
    
    ids.forEach((nodeId, i) => {
      const totalLevelHeight = (ids.length - 1) * Y_SPACING;
      const startY = 150 + (maxEventsInLevel * Y_SPACING) / 2 - totalLevelHeight / 2;
      positions[nodeId] = {
        x: 100 + levelIdx * X_SPACING,
        y: ids.length > 1 ? startY + i * Y_SPACING : 150 + (maxEventsInLevel * Y_SPACING) / 2,
      };
    });
  });

  activities.forEach((act) => {
    const start = positions[act.from];
    const end = positions[act.to];
    if (!start || !end) return;

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const x1 = start.x + RADIUS * Math.cos(angle);
    const y1 = start.y + RADIUS * Math.sin(angle);
    const x2 = end.x - RADIUS * Math.cos(angle);
    const y2 = end.y - RADIUS * Math.sin(angle);

    const group = svg.append('g').attr('class', 'activity');
    
    group.append('path')
      .attr('d', `M ${x1} ${y1} L ${x2} ${y2}`)
      .attr('stroke', act.isCritical ? '#ff4d4d' : 'black')
      .attr('stroke-width', act.isCritical ? 3 : 1.5)
      .attr('fill', 'none')
      .attr('marker-end', `url(#arrow-pert-${act.isCritical ? 'crit' : 'norm'})`);

    group.append('text')
      .attr('x', (x1 + x2) / 2).attr('y', (y1 + y2) / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif').attr('font-weight', 'bold')
      .style('font-size', '14px').text(act.te.toFixed(1));
  });

  eventIds.forEach((eventId) => {
    const event = events[eventId];
    const pos = positions[eventId];
    const g = svg.append('g').attr('transform', `translate(${pos.x}, ${pos.y})`);

    g.append('circle').attr('r', RADIUS).attr('fill', 'black').attr('stroke', 'black');
    g.append('text').attr('y', 7).attr('text-anchor', 'middle')
      .attr('fill', 'white').attr('font-weight', 'bold').attr('font-size', '18px')
      .text(event.id);

    const info = g.append('g').attr('transform', 'translate(-17.5, -85)');
    
    info.append('rect').attr('width', 35).attr('height', 25).attr('fill', 'white').attr('stroke', 'black');
    info.append('text').attr('x', 17.5).attr('y', 18).attr('text-anchor', 'middle')
      .attr('font-size', '12px').attr('font-family', 'monospace').attr('font-weight', 'bold')
      .text(event.e.toFixed(1));
    
    info.append('rect').attr('y', 25).attr('width', 35).attr('height', 25).attr('fill', 'white').attr('stroke', 'black');
    info.append('text').attr('x', 17.5).attr('y', 43).attr('text-anchor', 'middle')
      .attr('font-size', '12px').attr('font-family', 'monospace').attr('font-weight', 'bold')
      .text(event.l.toFixed(1));
  });

  const width = Object.keys(levels).length * X_SPACING + 200;
  const height = maxEventsInLevel * Y_SPACING + 300;
  svg.attr('viewBox', `0 0 ${width} ${height}`);
};

export default { draw };