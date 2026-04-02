// cspell:ignore pert pertrenderer
export const getStyles = (options: any) => `
  /* Event Node - The Black Circle */
  .event-node circle {
    fill: ${options.pertEventColor || '#2d2d2d'};
    stroke: ${options.pertEventStroke || '#000'};
    stroke-width: 2px;
  }

  /* Event ID text inside the circle */
  .event-node > text {
    fill: white !important; /* Force white text on dark background */
    font-family: ${options.fontFamily || 'sans-serif'};
    font-size: 16px;
    font-weight: bold;
    pointer-events: none;
  }

  /* The E/L Information Boxes */
  .event-node rect {
    fill: #fdfdfd;
    stroke: #333;
    stroke-width: 1px;
  }

  /* E/L values text inside the boxes */
  .event-node .info-text {
    fill: #000 !important; /* Black text on white boxes */
    font-family: monospace;
    font-size: 11px;
    font-weight: bold;
  }

  /* Activity Lines and Labels */
  .activity path {
    fill: none;
    stroke: #333;
    stroke-width: 2px;
  }
  
  .activity text {
    fill: #333;
    font-family: ${options.fontFamily || 'sans-serif'};
    font-size: 14px;
    background: white;
  }

  /* Critical Path */
  .activity.critical path {
    stroke: #ff4d4d !important;
    stroke-width: 3.5px !important;
  }
`;

export default getStyles;