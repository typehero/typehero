export function getEventDeltas(e: MouseEvent | TouchEvent, origin: { x: number; y: number }) {
  if (e instanceof MouseEvent) {
    return {
      dx: e.clientX - origin.x,
      dy: e.clientY - origin.y,
      currPosX: e.clientX,
      currPosY: e.clientY,
    };
  }

  const touch = e.changedTouches[0];
  if (!touch) {
    return {
      dx: 0,
      dy: 0,
      currPosX: 0,
      currPosY: 0,
    };
  }

  return {
    dx: touch.clientX - origin.x,
    dy: touch.clientY - origin.y,
    currPosX: touch.clientX,
    currPosY: touch.clientY,
  };
}
