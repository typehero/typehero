export function Platinum({ className, shortName }: { className?: string; shortName: string }) {
  return (
    <>
      <svg
        className={className}
        width="250"
        height="250"
        viewBox="0 0 250 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_16_74"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="16"
          y="3"
          width="218"
          height="244"
        >
          <path
            d="M112.5 7.21688C120.235 2.75106 129.765 2.75106 137.5 7.21688L220.753 55.2831C228.488 59.7489 233.253 68.0021 233.253 76.9338V173.066C233.253 181.998 228.488 190.251 220.753 194.717L137.5 242.783C129.765 247.249 120.235 247.249 112.5 242.783L29.2468 194.717C21.5118 190.251 16.7468 181.998 16.7468 173.066V76.9338C16.7468 68.0021 21.5118 59.7489 29.2468 55.2831L112.5 7.21688Z"
            fill="black"
          />
        </mask>
        <g mask="url(#mask0_16_74)">
          <rect width="250" height="250" fill="url(#paint0_linear_16_74)" />
          <path
            d="M74.3309 80.3861L92.2816 71.0789L110.232 80.3861L106.8 60.6722L121.326 46.7073L101.257 43.8349L92.2816 25.899L83.3068 43.8349L63.2314 46.7073L77.7586 60.6722L74.3309 80.3861Z"
            fill="white"
            fillOpacity="0.62"
          />
          <path
            d="M152.246 217.662L45.0404 189.04L29.4744 224.046L172 262.101L152.246 217.662Z"
            fill="white"
            fillOpacity="0.62"
          />
          <path
            d="M123.966 154.044L67.3196 138.92L51.7542 173.926L143.72 198.488L123.966 154.044Z"
            fill="white"
            fillOpacity="0.62"
          />
          <path
            d="M74.0339 123.81L115.44 134.864L92.2815 82.7655L74.0339 123.81Z"
            fill="white"
            fillOpacity="0.62"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_16_74"
            x1="75.1008"
            y1="21.412"
            x2="188.982"
            y2="212.197"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2EECEC" />
            <stop offset="0.677083" stopColor="#00A184" />
            <stop offset="1" stopColor="#0F7562" />
          </linearGradient>
        </defs>
      </svg>
      <p className="text-xs capitalize">{shortName}</p>
    </>
  );
}
