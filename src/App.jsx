import { useState, useRef } from "react";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import Draggable from "react-draggable";

function App() {
  const [type, setType] = useState("");
  const nodeRef = useRef(null);
  return (
    <>
      {!type && (
        <>
          <h1 className="text-center text-2xl px-2 py-4 font-bold bg-gray-100 rounded-b-3xl">
            Oi there, Choose a Filter buddy!
          </h1>
          <section className="flex gap-2 w-full  justify-center items-start p-2 mt-5">
            <div
              className="relative flex-1 h-65 bg-gray-50 shadow-md  rounded-2xl flex justify-center items-center border-1 border-blue-200 overflow-hidden"
              onClick={() => setType("type1")}
            >
              <h1 className="text-black text-lg text-center absolute text-white font-extrabold z-10 bottom-0 m-4">
                Instagram Story Songs Effect
              </h1>
              <div
                className="w-full h-full bg-gradient-to-t from-black to-transparent absolute z-2 top-0 left-0 opacity-80
              "
              ></div>
              <img
                src="/images/spotify-1.jpg"
                alt="Instagram Story Songs Filter"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="relative flex-1 h-65 bg-gray-50 shadow-md rounded-2xl flex flex-col justify-center items-center border-1 border-blue-200"
              onClick={() => setType("type2")}
            >
              <h1 className="text-black font-semibold text-xl text-center">
                Capcut Cards Songs
              </h1>
              <p className="text-xs font-bold text-blue-400">
                work in progress
              </p>
            </div>
          </section>
        </>
      )}
      {type === "type1" && <Home />}
      {type === "type2" && <Home2 />}
      <div className=" flex gap-2 justify-center items-center text-xs p-4 ">
        <h1 ref={nodeRef}>Powered by</h1>
        <a
          href="https://haithamexe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Haitham Jalal
        </a>
      </div>
    </>
  );
}

export default App;
