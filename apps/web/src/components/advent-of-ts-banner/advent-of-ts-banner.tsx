import './advent-of-ts-banner.css';
import { SnowCanvas } from './snow-canvas';

export function AdventofTSBanner() {
  return (
    <div className="container mt-[128px] flex min-h-[500px] justify-center lg:mb-[148px]">
      <div className="content max-w-[900px] overflow-hidden rounded-3xl">
        <SnowCanvas />
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="flex flex-col p-10">
            <h1 className="text-6xl font-bold tracking-tighter sm:text-8xl">
              <span>Advent</span> of <span className="text-red-600">TypeScript</span>
            </h1>
            <div className="z-10 mt-44 text-4xl font-semibold text-red-600">
              12.1.2023
              {/* <button className="candy-cane relative z-10 flex items-center gap-1 bg-[#4476C0] px-8 py-4 text-2xl text-white transition duration-700 ease-in-out hover:scale-110 hover:shadow-[0_0_2rem_-0.5rem_#4476C0]"> */}
              {/*   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> */}
              {/*     <g fill="none" fillRule="evenodd"> */}
              {/*       <path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z" /> */}
              {/*       <path */}
              {/*         fill="currentColor" */}
              {/*         d="M12.23 3a7.23 7.23 0 0 1 7.21 6.676l.544 7.073A3 3 0 1 1 15 19l-9 .001a3 3 0 0 1-1-5.83v-2.94A7.23 7.23 0 0 1 12.23 3ZM18 18a1 1 0 1 0 0 2a1 1 0 0 0 0-2Zm-2.72-3H6a1 1 0 0 0-.117 1.993L6 17h9.764l.135-.141l-.62-1.859Z" */}
              {/*       /> */}
              {/*     </g> */}
              {/*   </svg> */}
              {/*   <span className="relative z-10">Get Started</span> */}
              {/* </button> */}
            </div>
          </div>
          <div className="ground absolute bottom-0 h-[160px] w-full bg-[#f6f9fa]">
            <div className="mound pointer-events-none">
              <div className="mound_text flex translate-x-32 translate-y-[-40px] rotate-6 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                >
                  <path
                    d="M0 23.6842C0 10.6038 10.6038 0 23.6842 0H176.316C189.396 0 200 10.6038 200 23.6842V176.316C200 189.396 189.396 200 176.316 200H23.6842C10.6038 200 0 189.396 0 176.316V23.6842Z"
                    fill="#3178C6"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M82.6039 51.2338H105.263V35.7895H42.1053V51.2338H64.6537V120H82.6039V51.2338Z"
                    fill="white"
                  />
                  <path
                    d="M115.789 120V35.7895H133.953V70.6887H160.74V35.7895H178.947V120H160.74V84.9778H133.953V120H115.789Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
