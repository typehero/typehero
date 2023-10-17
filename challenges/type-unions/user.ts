// Part 1: Meters
type Meters = {
  unit: 'meters';
  value: number;
};

type Miles = {
  unit: 'miles';
  value: number;
};

type Distance = Meters | Miles;

/////////////////////////////////////////////////
// Part 2: position
type Position = 'top' | 'topLeft' | 'topRight';
