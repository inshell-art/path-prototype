/**
 * Build a square SVG frame with 3 squares in one line.
 * Each square is shown when its corresponding boolean is true (YES),
 * hidden when false (NO).
 */
export function pathGenerator(values = [], options = {}) {
  const {
    size = 600,
    background = '#000000',
    fill = '#ffffff',
    willValue = 0,
    willCount = willValue,
  } = options;

  const square = Math.max(1, Math.round(size));
  const boolValues = Array.isArray(values)
    ? values
    : [values?.thought, values?.will, values?.awa];
  const flags = boolValues.slice(0, 3).map((value) => Boolean(value));
  while (flags.length < 3) flags.push(false);

  const side = Math.max(20, Math.round(square / 10));
  const gap = Math.max(10, Math.round(square / 20));
  const totalWidth = side * 3 + gap * 2;
  const startX = Math.round((square - totalWidth) / 2);
  const y = Math.round((square - side) / 2);
  const willRectX = startX + (side + gap);

  const willInputValue = Math.min(10, Math.max(0, Number.isFinite(Number(willCount)) ? Number(willCount) : 0));
  const fillRatio = Math.min(1, Math.max(0, Number(willInputValue) / 10));
  const fillWidth = Math.round(side * fillRatio);
  const shouldDrawFill = flags[1] && fillWidth > 0;
  const willFillRect = shouldDrawFill
    ? `<rect x="${willRectX}" y="${y}" width="${fillWidth}" height="${side}" fill="${fill}" />`
    : '';

  const rects = flags
    .map((isVisible, index) => {
      const display = isVisible ? 'inline' : 'none';
      const isWillRect = index === 1;
      const baseFill = isWillRect ? 'none' : fill;
      return `<rect x="${startX + index * (side + gap)}" y="${y}" width="${side}" height="${side}" fill="${baseFill}" display="${display}" />`;
    })
    .join('');

  const willFillOverlay = flags[1]
    ? `<g id="will-fill-overlay" display="inline">
      ${willFillRect}
    </g>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${square} ${square}" width="${square}" height="${square}" role="img" aria-label="Three squares controlled by boolean flags">
  <rect width="${square}" height="${square}" fill="${background}" />
  ${rects}
  ${willFillOverlay}
</svg>`;
}
