import { useState, useEffect, useRef } from "react";

const Home = () => {
  const [songs, setSongs] = useState([]);

  const [search, setSearch] = useState("");

  const [songsArray, setSongsArray] = useState(new Set());

  const [image, setImage] = useState("");

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Clear the selected image
  const handleClearImage = () => {
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-[100dvh] w-full p-5">
      <div className="w-full h-full">
        <form>
          <input
            type="text"
            placeholder="song name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="px-4 py-1 pb-1.5 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </form>
        <section className="flex flex-col bg-black rounded-lg p-2 mt-2 gap-1">
          <h1 className="text-white ">Songs added:</h1>
          <div className="w-full">
            {Array.from(songsArray).map((song, index) => (
              <div key={index}>{song}</div>
            ))}
            {songsArray.size === 0 && (
              <div className="text-gray-600 w-full h-50 items-center justify-center flex bg-gray-200 rounded-md border-1">
                No songs added yet.
              </div>
            )}
          </div>
        </section>
        <section className="w-full md:h-[100vh]">
          {image ? (
            <img
              src={image}
              alt="Album Art"
              className="w-full h-full object-contain rounded-lg mt-4"
            />
          ) : (
            <div className="w-full h-115 flex items-center justify-center flex-col gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 mt-4">
              <h1>No image uploaded.</h1>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={handleImageButtonClick}
                className="mt-2 px-4 py-2 bg-blue-400 text-white rounded-lg text-md"
              >
                Upload Image
              </button>
            </div>
          )}
        </section>
        <button className="mt-2 px-4 py-2 bg-blue-400 text-white rounded-lg text-md w-full">
          Download
        </button>
        <section className="w-full flex justify-center items-center mt-2 gap-1 text-xs pb-2">
          <h1>Powered by </h1>
          <a
            href="https://haithamexe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 "
          >
            Haitham Jalal
          </a>
        </section>
      </div>
    </div>
  );
};

export default Home;
