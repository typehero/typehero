import { Expect, Equal } from 'type-testing';

type test_Name = Expect<Equal<Name, string>>;
type test_Year = Expect<Equal<Year, number>>;
type test_Count = Expect<Equal<Count, number>>;
type test_IsOperational = Expect<Equal<IsOperational, boolean>>;

type test_PayloadName = Expect<Equal<
  Payload['name'],
  string
>>;

type test_Kilograms = Expect<Equal<
  Kilograms,
  number
>>;

type test_PayloadMass = Expect<Equal<
  Payload['mass'],
  Kilograms
>>;

interface Spacecraft {
  name: Name;
  yearBuilt: Year;
  crewCapacity: Count;
  launchDate: Date;
  isOperational: IsOperational;
  propulsionSystem: string[];
  payload: Payload[];
}

const voyager1 = {
  name: "Voyager 1",
  yearBuilt: 1977,
  crewCapacity: 0,
  launchDate: new Date("1977 09 05"),
  isOperational: true,
  propulsionSystem: ["RTG (Radioisotope Thermoelectric Generator)"],
  payload: [
    { name: "Golden Record", mass: 0.3 },
    { name: "Instruments", mass: 721 },
  ],
} satisfies Spacecraft;