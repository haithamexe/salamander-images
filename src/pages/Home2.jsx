import { searchTracks } from "../utils/spotify";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Download, Trash2, Move, Upload, Search } from "lucide-react";
import Draggable, { DraggableCore } from "react-draggable"; // Both at the same time

const ResizableDiv = ({
  initialWidth = 200,
  initialHeight = 150,
  children,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const wrapperRef = useRef(null);

  // Function to get the correct clientX and clientY from mouse or touch event
  const getClientCoords = (e) => {
    if (e.touches) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (isResizing && wrapperRef.current) {
        const { clientX, clientY } = getClientCoords(e);
        const { left, top } = wrapperRef.current.getBoundingClientRect();
        const newWidth = clientX - left;
        const newHeight = clientY - top;

        setDimensions({
          width: Math.max(newWidth, 50), // Set a minimum width
          height: Math.max(newHeight, 50), // Set a minimum height
        });
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("touchmove", resize);
      window.addEventListener("mouseup", stopResizing);
      window.addEventListener("touchend", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("touchmove", resize);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("touchend", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      ref={wrapperRef}
      className=""
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* The wrapped children */}
      {children}
      {/* The resize handle */}
      <div
        className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize bg-black rounded-full"
        onMouseDown={startResizing}
        onTouchStart={startResizing}
      />
    </div>
  );
};

const Home2 = () => {
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoaded2, setImageLoaded2] = useState(false);
  const [divs, setDivs] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [editingDiv, setEditingDiv] = useState(null);
  const [draggedDiv, setDraggedDiv] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const [sheSearched, setSheSearched] = useState(false);

  const nodeRef = useRef(null);

  const imageRef = useRef(null);
  const imageRef2 = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const canvasContainerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  const [searchedSongs, setSearchedSongs] = useState([]);

  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const currentDivs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!search) return;
      if (search.length < 3) return;

      const results = await searchTracks(search);
      setSearchedSongs(results.tracks.items);
      console.log("Search results:", results);
      console.log("Search results:", results.tracks.items);
      console.log("Search results:", results?.tracks?.items[0]?.name);
      console.log(
        "Search results:",
        results?.tracks?.items[0]?.artists[0]?.name
      );
      console.log(
        "Search results:",
        results?.tracks?.items[0]?.album?.images?.[0]?.url
      );
    };
    if (focused) {
      fetchData();
    } else {
      setSearchedSongs([]);
    }
  }, [search, focused]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle image upload/replace
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setImageLoaded(false);
        setDivs([]);
        setSelectedDiv(null);
        setEditingDiv(null);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };
  const handleImageChange2 = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage2(e.target.result);
        setImageLoaded2(false);
        setDivs([]);
        setSelectedDiv(null);
        setEditingDiv(null);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const triggerFileInput2 = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.value = "";
      fileInputRef2.current.click();
    }
  };

  const addSongDiv = (song) => {
    if (!imageLoaded || !containerRef.current) return;

    if (currentDivs.current.length > 4) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const maxX = Math.max(0, containerRect.width - 220);
    const maxY = Math.max(0, containerRect.height - 80);

    const newDiv = {
      id: Date.now(),
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      width: 20,
      height: 40,
      text: song.name,
      artist: song.artists?.[0]?.name || "Unknown Artist",
      imageUrl: song.album?.images?.[0]?.url || null,
    };

    if (song.name === "The Labyrinth Song") {
      setSheSearched(true);
    }

    setDivs([...divs, newDiv]);
    setSelectedDiv(newDiv.id);
    setSearchedSongs([]);

    currentDivs.current = [...currentDivs.current, newDiv];
  };

  const deleteDiv = (id) => {
    setDivs(divs.filter((div) => div.id !== id));
    if (selectedDiv === id) setSelectedDiv(null);
    if (editingDiv === id) setEditingDiv(null);

    currentDivs.current = currentDivs.current.filter((div) => div.id !== id);
  };

  const updateDiv = (id, updates) => {
    setDivs(divs.map((div) => (div.id === id ? { ...div, ...updates } : div)));
  };

  const getEventPosition = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleDragStart = (e, div) => {
    e.preventDefault();
    e.stopPropagation();

    const containerRect = containerRef.current.getBoundingClientRect();
    const divRect = e.currentTarget.getBoundingClientRect();
    const position = getEventPosition(e);

    setDraggedDiv(div.id);
    setSelectedDiv(div.id);
    setDragOffset({
      x: position.x - divRect.left,
      y: position.y - divRect.top,
    });
  };
  const handleDragStart2 = (e, div) => {
    e.preventDefault();
    e.stopPropagation();

    const containerRect = containerRef.current.getBoundingClientRect();
    const divRect = e.currentTarget.getBoundingClientRect();
    const position = getEventPosition(e);

    setDraggedDiv(div.id);
    setSelectedDiv(div.id);
    setDragOffset({
      x: position.x - divRect.left,
      y: position.y - divRect.top,
    });
  };

  const handleTouchStart = (e, div) => {
    const currentTime = Date.now();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300 && tapGap > 0) {
      e.preventDefault();
      setEditingDiv(div.id);
      setSelectedDiv(div.id);
      setLastTap(0);
    } else {
      setLastTap(currentTime);
      handleDragStart(e, div);
    }
  };
  const handleTouchStart2 = (e, div) => {
    const currentTime = Date.now();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300 && tapGap > 0) {
      e.preventDefault();
      setEditingDiv(div.id);
      setSelectedDiv(div.id);
      setLastTap(0);
    } else {
      setLastTap(currentTime);
      handleDragStart(e, div);
    }
  };

  const handleMove = useCallback(
    (e) => {
      if (!draggedDiv || !containerRef.current) return;

      e.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();
      const position = getEventPosition(e);
      const newX = position.x - containerRect.left - dragOffset.x;
      const newY = position.y - containerRect.top - dragOffset.y;

      const draggedDivData = divs.find((div) => div.id === draggedDiv);
      if (draggedDivData) {
        updateDiv(draggedDiv, {
          x: Math.max(
            0,
            Math.min(newX, containerRect.width - draggedDivData.width)
          ),
          y: Math.max(
            0,
            Math.min(newY, containerRect.height - draggedDivData.height)
          ),
        });
      }
    },
    [draggedDiv, dragOffset, divs]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedDiv(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (draggedDiv) {
      const handleMouseMove = (e) => handleMove(e);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (e) => handleMove(e);
      const handleTouchEnd = () => handleDragEnd();

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [draggedDiv, handleMove, handleDragEnd]);

  // useEffect(() => {
  //   const resizableDiv = document.querySelector(".resizable-div-js");
  //   const resizeHandle = resizableDiv.querySelector("::after");

  //   let isResizing = false;

  //   resizeHandle.addEventListener("mousedown", (e) => {
  //     isResizing = true;
  //   });

  //   window.addEventListener("mousemove", (e) => {
  //     if (isResizing) {
  //       const newWidth = e.clientX - resizableDiv.getBoundingClientRect().left;
  //       const newHeight = e.clientY - resizableDiv.getBoundingClientRect().top;
  //       resizableDiv.style.width = `${newWidth}px`;
  //       resizableDiv.style.height = `${newHeight}px`;
  //     }
  //   });

  //   window.addEventListener("mouseup", () => {
  //     isResizing = false;
  //   });

  //   return () => {
  //     window.removeEventListener("mousemove", () => {});
  //     window.removeEventListener("mouseup", () => {});
  //   };
  // }, []);

  return (
    <div className="min-h-full p-2 flex flex-col gap-1">
      {/* Search Section */}
      <div className="relative mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      {searchedSongs.length > 0 && search && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 ">
          <h3 className="text-lg font-semibold mb-3">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {searchedSongs.map((song, index) => (
              <div
                key={index}
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => addSongDiv(song)}
              >
                {song.album?.images?.[0]?.url && (
                  <img
                    src={song.album.images[0].url}
                    alt="Album cover"
                    className="w-12 h-12 rounded-lg mr-3 object-cover"
                  />
                )}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    {song.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {song.artists?.[0]?.name || "Unknown Artist"}
                  </div>
                </div>
                <Plus size={16} className="text-gray-400 ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <input
        ref={fileInputRef2}
        type="file"
        accept="image/*"
        onChange={handleImageChange2}
        style={{ display: "none" }}
      />
      {/* Upload Section */}
      {!image && !image2 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6 border-gray-200 border-1 flex flex-col justify-center items-center gap-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <button
            onClick={triggerFileInput}
            className="bg-black hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Upload Background Image
          </button>

          <p className="text-gray-500 mt-2">
            Choose an image to start adding songs
          </p>
        </div>
      )}
      {!image2 && (
        <button
          onClick={triggerFileInput2}
          className="bg-black hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Upload png
        </button>
      )}
      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className=" rounded-lg p-0">
              <div
                ref={containerRef}
                className="relative inline-block border border-gray-200 rounded-lg overflow-hidden"
                onClick={(e) => {
                  if (
                    e.target === containerRef.current ||
                    e.target === imageRef.current
                  ) {
                    setSelectedDiv(null);
                    setEditingDiv(null);
                  }
                }}
              >
                <div
                  ref={nodeRef}
                  className="resizable-div-js  absolute top-0 left-0 h-full cursor-pointer overflow-hidden z-999"
                >
                  <ResizableDiv>
                    <Draggable nodeRef={imageRef2}>
                      <img
                        ref={imageRef2}
                        src={image2}
                        alt="Uploaded"
                        className="w-full h-full object-contain "
                        onLoad={() => setImageLoaded2(true)}
                      />
                    </Draggable>
                  </ResizableDiv>
                </div>
                {divs.map((div) => (
                  <div key={div.id} className="absolute inset-0">
                    <img
                      src={div.imageUrl}
                      alt="Uploaded"
                      className="w-30 h-30 object-contain"
                    />
                    <div>
                      <h1>{div.text}</h1>
                      <h1>{div.artist}</h1>
                    </div>
                  </div>
                ))}
                <img
                  ref={imageRef}
                  src={image}
                  alt="Uploaded"
                  className="max-w-full h-auto block %]"
                  onLoad={() => setImageLoaded(true)}
                  style={{ maxHeight: "80vh" }}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-4">
              <button
                onClick={triggerFileInput}
                className="flex items-center gap-2 bg-black hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center"
              >
                <Upload size={16} />
                Replace Background
              </button>

              {/* <button
                    onClick={downloadImage}
                    disabled={!imageLoaded}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center"
                  >
                    <Download size={16} />
                    Download
                  </button> */}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tips:</strong> Search and click songs to add them. Drag
                to move
              </p>
            </div>
          </div>

          {/* Songs Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">
                Added Songs ({divs.length})
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home2;
