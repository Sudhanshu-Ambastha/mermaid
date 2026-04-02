// cspell:ignore cpm cpmdiagram cpmrenderer
import { select } from 'd3';
import db from './cpmDb.js';

const BLOCK_W = 120;
const BLOCK_H = 100;
const X_SPACING = 220;
const Y_SPACING = 160;

/**
 * Creates SVG definitions for arrowheads.
 */
function buildDefs(svg: any, id: string, isCritical: boolean) {
  const color = isCritical ? '#ff4d4d' : '#4b5563';
  const markerId = `${id}-${isCritical ? 'critical' : 'normal'}`;
  const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');

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

  return markerId;
}

export const draw = (text: string, id: string) => {
  const { tasks, sortedNodes } = db.getModel();
  const svg = select(`[id="${id}"]`);
  svg.selectAll('*').remove();
  
  const normalMarker = buildDefs(svg, id, false);
  const criticalMarker = buildDefs(svg, id, true);

  // 1. Layout Engine: Calculate Horizontal Levels (Ranks)
  const nodeLevels: Record<string, number> = {};
  const levels: Record<number, string[]> = {};
  
  sortedNodes.forEach(node => {
    let level = 0;
    if (node.predecessors.length > 0) {
      level = Math.max(...node.predecessors.map(p => (nodeLevels[p] ?? 0) + 1));
    }
    nodeLevels[node.id] = level;
    if (!levels[level]) levels[level] = [];
    levels[level].push(node.id);
  });

  // 2. Map Positions
  const positions: Record<string, {x: number, y: number}> = {};
  let maxNodesInLevel = 0;
  Object.keys(levels).forEach((levelIdx) => {
    const ids = levels[parseInt(levelIdx)];
    maxNodesInLevel = Math.max(maxNodesInLevel, ids.length);
    ids.forEach((nodeId, i) => {
      positions[nodeId] = {
        x: 80 + parseInt(levelIdx) * X_SPACING,
        y: 80 + i * Y_SPACING
      };
    });
  });

  // 3. Draw Connectors (Arrows)
  sortedNodes.forEach(node => {
    node.successors.forEach(succId => {
      const start = positions[node.id];
      const end = positions[succId];
      if (start && end) {
        const isCritical = node.isCritical && tasks[succId].isCritical;
        svg.append('path')
          .attr('d', `M ${start.x + BLOCK_W} ${start.y + 50} L ${end.x} ${end.y + 50}`)
          .attr('stroke', isCritical ? '#ff4d4d' : '#4b5563')
          .attr('stroke-width', isCritical ? 2.5 : 1.5)
          .attr('fill', 'none')
          .attr('marker-end', `url(#${isCritical ? criticalMarker : normalMarker})`);
      }
    });
  });

  // 4. Draw Nodes (3-Row Blocks)
  sortedNodes.forEach(node => {
    const { x, y } = positions[node.id];
    const g = svg.append('g').attr('transform', `translate(${x}, ${y})`);

    // Top Row: ES | Dur | EF (Greenish/Grey)
    g.append('rect').attr('width', 40).attr('height', 30).attr('fill', '#f1f5f9').attr('stroke', 'black');
    g.append('rect').attr('x', 40).attr('width', 40).attr('height', 30).attr('fill', '#e2e8f0').attr('stroke', 'black');
    g.append('rect').attr('x', 80).attr('width', 40).attr('height', 30).attr('fill', '#f1f5f9').attr('stroke', 'black');

    // Middle Row: ID
    const borderColor = node.isCritical ? "#ff4d4d" : "#000";
    g.append('rect').attr('y', 30).attr('width', 120).attr('height', 40).attr('fill', 'white').attr('stroke', borderColor).attr('stroke-width', node.isCritical ? 2 : 1);

    // Bottom Row: LS | Slack | LF (Blueish/Red)
    g.append('rect').attr('y', 70).attr('width', 40).attr('height', 30).attr('fill', '#f1f5f9').attr('stroke', 'black');
    g.append('rect').attr('x', 40).attr('y', 70).attr('width', 40).attr('height', 30).attr('fill', node.isCritical ? '#fee2e2' : '#f1f5f9').attr('stroke', 'black');
    g.append('rect').attr('x', 80).attr('y', 70).attr('width', 40).attr('height', 30).attr('fill', '#f1f5f9').attr('stroke', 'black');

    // Text Labels
    const txt = (val: any, dx: number, dy: number, size: string, weight: string, color = 'black') =>
      g.append('text').attr('x', dx).attr('y', dy).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .style('font-size', size).style('font-family', 'monospace').style('font-weight', weight).style('fill', color).text(val);

    txt(node.es, 20, 15, '11px', 'normal');
    txt(node.duration, 60, 15, '11px', 'bold');
    txt(node.ef, 100, 15, '11px', 'normal');
    txt(node.id, 60, 50, '13px', '800');
    txt(node.ls, 20, 85, '11px', 'normal');
    txt(node.slack, 60, 85, '11px', 'normal', node.isCritical ? 'red' : 'black');
    txt(node.lf, 100, 85, '11px', 'normal');
  });

  // Final ViewBox calculation
  const width = Object.keys(levels).length * X_SPACING + 160;
  const height = maxNodesInLevel * Y_SPACING + 160;
  svg.attr('viewBox', `0 0 ${width} ${height}`)
     .attr('width', '100%')
     .attr('style', `max-width: ${width}px; background-color: white;`);
};

export default { draw };