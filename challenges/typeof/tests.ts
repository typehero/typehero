import { Expect, Equal } from 'type-testing';

const height = 500;
const width = 700;

type test_Width = Expect<Equal<Width, number>>;

const margin = {
  top: 20,
  right: 30,
  bottom: 40,
  left: 50,
};

type test_Margin = Expect<Equal<Margin, { top: 20; right: 30; bottom: 40; left: 50 }>>;

const d3ChartConfig = {
  width,
  height,
  margin,
  data: [
    { category: 'A', value: 30 },
    { category: 'B', value: 45 },
    { category: 'C', value: 60 },
    { category: 'D', value: 25 },
    { category: 'E', value: 50 },
  ],
  xScale: {
    type: 'band',
    domain: (data) => data.map((d) => d.category),
    range: [0, width - margin.right - margin.left],
  },
  yScale: {
    type: 'linear',
    domain: [0, (data: number[]) => Math.max(data.length, data[0])],
    range: [height - margin.bottom, margin.top],
  },
  xAxis: {
    label: 'Categories',
    tickSize: 5,
  },
  yAxis: {
    label: 'Values',
    tickSize: 5,
  },
  bar: {
    fill: 'steelblue',
  },
};

type test_Data = Expect<Equal<Data, { category: string; value: number }[]>>;

type test_YScale = Expect<
  Equal<
    YScale,
    {
      type: string;
      domain: (number | ((data: number[]) => number))[];
      range: number[];
    }
  >
>;

type test_d3ChartConfig = Expect<
  Equal<
    D3ChartConfig,
    {
      width: number;
      height: Width;
      margin: Margin;
      data: Data;
      xScale: {
        type: string;
        domain: string[];
        range: [number, number];
      };
      yScale: {
        type: string;
        domain: [number, number];
        range: [number, number];
      };
      xAxis: {
        label: string;
        tickSize: number;
      };
      yAxis: {
        label: string;
        tickSize: number;
      };
      bar: {
        fill: string;
        width: number;
      };
    }
  >
>;
