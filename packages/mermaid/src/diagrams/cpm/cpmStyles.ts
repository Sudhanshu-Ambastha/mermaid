// cspell:ignore cpm cpmdiagram cpmrenderer
const getStyles = (options: Record<string, string>): string => {
  const pColor = options.primaryColor ?? '#f0faff';
  const pText = options.primaryTextColor ?? '#000000';
  const pBorder = options.primaryBorderColor ?? pText;
  const fontFamily = options.fontFamily ?? 'Helvetica, Arial, sans-serif';
  const fontSize = options.fontSize ?? '10px';

  const criticalColor = '#fff5f5'; // Light red for critical tasks
  const criticalBorder = '#d32f2f'; // Bold red for critical path
  const lineCol = options.lineColor ?? pBorder;

  return `
  .cpm-node rect {
    fill: ${pColor};
    stroke: ${pBorder};
    stroke-width: 2px;
  }

  .cpm-node.critical rect {
    fill: ${criticalColor};
    stroke: ${criticalBorder};
    stroke-width: 2.5px;
  }

  .cpm-node line {
    stroke: #cccccc;
    stroke-width: 1px;
  }

  .cpm-node text {
    fill: ${pText};
    font-family: ${fontFamily};
    font-size: ${fontSize};
  }

  .cpm-node .task-id {
    font-weight: bold;
    font-size: 12px;
  }

  .cpm-edge {
    fill: none;
    stroke: ${lineCol};
    stroke-width: 2px;
  }

  .cpm-edge.critical {
    stroke: ${criticalBorder};
    stroke-width: 3px;
  }

  .cpm-arrowhead {
    fill: ${lineCol};
  }

  .cpm-arrowhead.critical {
    fill: ${criticalBorder};
  }
  `;
};

export default getStyles;