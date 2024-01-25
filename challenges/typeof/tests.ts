import { Expect, Equal } from 'type-testing';

const height = 500;
const width = 700;

type test_Width = Expect<Equal<
  Width,
  700
>>;

const margin = {
  top: 20,
  right: 30,
  bottom: 40,
  left: 50,
};

type test_Margin = Expect<Equal<
  Margin,
  { top: number, right: number, bottom: number, left: number }
>>;

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
    domain: [0, 100],
    range: [0, width - margin.right - margin.left],
  },
  yScale: {
    type: 'linear',
    domain: [0, 100],
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
    fill: 'rebeccapurple',
  },
};

type test_Data = Expect<Equal<
  Data,
  { category: string, value: number }[]
>>;

type test_YScale = Expect<Equal<
  YScale,
  {
    type: string;
    domain: number[];
    range: number[];
  }
>>;

type test_d3ChartConfig = Expect<Equal<
  D3ChartConfig,
  {
    width: number;
    height: number;
    margin: Margin;
    data: Data;
    xScale: {
      type: string;
      domain: number[];
      range: number[];
    };
    yScale: {
      type: string;
      domain: number[];
      range: number[];
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
    };
  }
>>;
