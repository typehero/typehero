import { Expect, Extends } from 'type-testing';

/** temporary */
const expect = <T>(a: T) => ({
  toEqual: (b: T) => a === b
});

const getDistanceInMeters = (distance: Distance) => {
  switch (distance.unit) {
    case 'miles':
      return {
        unit: 'meters',
        value: distance.value / 1609.34,
      } satisfies Meters;

    case 'meters':
      return {
        unit: 'meters',
        value: distance.value,
      } satisfies Meters;

    case 'feet':
      return {
        unit: 'meters',
        value: distance.value * 3.28084,
      } satisfies Meters;

    default:
      // @ts-expect-error (in production codebases, we'd assert an unreachable case here but that's beyond the scope of this lesson)
      throw new Error(`unrecognized unit: ${distance.unit}`)
  }
}

const lowMarsOrbit = {
  unit: 'meters',
  value: 300_000
} satisfies Meters;

const mediumMarsOrbit = {
  unit: 'meters',
  value: 2_000_000
} satisfies Meters;

const highMarsOrbit = {
  unit: 'meters',
  value: 5_000_000
} satisfies Meters;


expect(getDistanceInMeters({
  unit: 'miles',
  value: 186.41182099494205,
})).toEqual(lowMarsOrbit);

expect(getDistanceInMeters({
  unit: 'meters',
  value: 2_000_000,
})).toEqual(mediumMarsOrbit);

expect(getDistanceInMeters({
  unit: 'feet',
  value: 1523999.9512320017,
})).toEqual(highMarsOrbit);


/////////////////////////////////////////////////
// Part 2

interface AbsolutePosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

const positionElement = (position: Position): AbsolutePosition => {
  switch (position) {
    case 'topLeft':
      return { top: 0, left: 0 };

    case 'top':
      return { top: 0 };

    case 'topRight':
      return { top: 0, right: 0 };

    case 'left':
      return { left: 0 };

    case 'center':
      return { top: 0, left: 0, bottom: 0, right: 0 };

    case 'right':
      return { right: 0 };

    case 'bottomLeft':
      return { bottom: 0, left: 0 };

    case 'bottom':
      return { bottom: 0 };

    case 'bottomRight':
      return { bottom: 0, right: 0 };

    default:
      return {}
  }
}

type test_topLeft = Expect<Extends<'topLeft', Position>>;
type test_top = Expect<Extends<'top', Position>>;
type test_topRight = Expect<Extends<'topRight', Position>>;
type test_left = Expect<Extends<'left', Position>>;
type test_center = Expect<Extends<'center', Position>>;
type test_right = Expect<Extends<'right', Position>>;
type test_bottomLeft = Expect<Extends<'bottomLeft', Position>>;
type test_bottom = Expect<Extends<'bottom', Position>>;
type test_bottomRight = Expect<Extends<'bottomRight', Position>>;

