// Part 1: Meters
type Meters = {
  unit: 'meters';
  value: number;
};

type Miles = {
  unit: 'miles';
  value: number;
};

type Feet = {
  unit: 'feet';
  value: number;
}

type Distance = Meters | Miles | Feet;

/////////////////////////////////////////////////
// Part 2: position
type Position =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'left'
  | 'center'
  | 'right'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'
;
