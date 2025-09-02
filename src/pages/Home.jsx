import React, { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Download, Trash2, Move, Upload, Search } from "lucide-react";
import { searchTracks } from "../utils/spotify";

const Home = () => {
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [divs, setDivs] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [editingDiv, setEditingDiv] = useState(null);
  const [draggedDiv, setDraggedDiv] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const [sheSearched, setSheSearched] = useState(false);

  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  const [searchedSongs, setSearchedSongs] = useState([]);

  const [search, setSearch] = useState("");

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

    fetchData();
  }, [search]);

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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const addSongDiv = (song) => {
    if (!imageLoaded || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const maxX = Math.max(0, containerRect.width - 220);
    const maxY = Math.max(0, containerRect.height - 80);

    const newDiv = {
      id: Date.now(),
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      width: 130,
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
  };

  const deleteDiv = (id) => {
    setDivs(divs.filter((div) => div.id !== id));
    if (selectedDiv === id) setSelectedDiv(null);
    if (editingDiv === id) setEditingDiv(null);
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

  // Simplified download function using DOM-to-image approach
  const downloadImage = async () => {
    if (!imageLoaded || !containerRef.current) {
      alert("Please wait for the image to load completely");
      return;
    }

    try {
      const container = containerRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Get the displayed size of the image
      const img = imageRef.current;
      const rect = container.getBoundingClientRect();

      // Set canvas size to match the displayed image
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Draw the background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Process each song div
      for (const div of divs) {
        // Draw background with rounded corners
        ctx.save();

        // Create rounded rectangle path
        const radius = 5;
        ctx.beginPath();
        ctx.moveTo(div.x + radius, div.y);
        ctx.lineTo(div.x + div.width - radius, div.y);
        ctx.quadraticCurveTo(
          div.x + div.width,
          div.y,
          div.x + div.width,
          div.y + radius
        );
        ctx.lineTo(div.x + div.width, div.y + div.height - radius);
        ctx.quadraticCurveTo(
          div.x + div.width,
          div.y + div.height,
          div.x + div.width - radius,
          div.y + div.height
        );
        ctx.lineTo(div.x + radius, div.y + div.height);
        ctx.quadraticCurveTo(
          div.x,
          div.y + div.height,
          div.x,
          div.y + div.height - radius
        );
        ctx.lineTo(div.x, div.y + radius);
        ctx.quadraticCurveTo(div.x, div.y, div.x + radius, div.y);
        ctx.closePath();

        // Fill background
        ctx.fillStyle = "rgba(255, 255, 255)";
        ctx.fill();

        // Draw border
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Clip to rounded rectangle for content
        ctx.clip();

        const padding = 12;
        let textStartX = div.x + padding;

        // Draw album image if available
        if (div.imageUrl) {
          try {
            const albumImg = new Image();
            albumImg.crossOrigin = "anonymous";
            await new Promise((resolve, reject) => {
              albumImg.onload = resolve;
              albumImg.onerror = reject;
              albumImg.src = div.imageUrl;
            });

            const imageSize = 50;
            const imageY = div.y + (div.height - imageSize) / 2;
            ctx.drawImage(albumImg, textStartX, imageY, imageSize, imageSize);
            textStartX += imageSize + padding;
          } catch (error) {
            console.warn("Failed to load album image:", error);
          }
        }

        // Draw text
        const textWidth = div.x + div.width - textStartX - padding;

        // Song name
        ctx.fillStyle = "#000000";
        ctx.font = "bold 14px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";

        const songY = div.y + padding + div.height * 0.3;
        const truncatedSong = truncateText(ctx, div.text, textWidth);
        ctx.fillText(truncatedSong, textStartX, songY);

        // Artist name
        ctx.fillStyle = "#808080";
        ctx.font = "12px Arial, sans-serif";
        const artistY = div.y + padding + div.height * 0.65;
        const truncatedArtist = truncateText(ctx, div.artist, textWidth);
        ctx.fillText(truncatedArtist, textStartX, artistY);

        ctx.restore();
      }

      // Download the canvas
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `song-photo-${Date.now()}.png`;
            link.style.display = "none";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 100);
          }
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  // Helper function to truncate text
  const truncateText = (ctx, text, maxWidth) => {
    if (ctx.measureText(text).width <= maxWidth) {
      return text;
    }

    let truncated = text;
    while (
      ctx.measureText(truncated + "...").width > maxWidth &&
      truncated.length > 0
    ) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
  };

  return (
    <div
      className={`min-h-screen ${
        sheSearched ? "bg-[#92A07F]" : "bg-gray-200"
      } p-4`}
    >
      <div className="max-w-6xl mx-auto">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchedSongs.length > 0 && search && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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

        {/* Upload Section */}
        {!image && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <button
              onClick={triggerFileInput}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Upload Photo
            </button>
            <p className="text-gray-500 mt-2">
              Choose an image to start adding songs
            </p>
          </div>
        )}

        {/* Main Editor */}
        {image && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Image Canvas */}
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
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Uploaded"
                    className="max-w-full h-auto block"
                    onLoad={() => setImageLoaded(true)}
                    style={{ maxHeight: "70vh" }}
                  />

                  {/* Song Overlays */}
                  {divs.map((div) => (
                    <div
                      key={div.id}
                      className={`absolute cursor-move select-none touch-none ${
                        sheSearched ? "bg-[#92A07F]" : "bg-white"
                      } bg-opacity-95  rounded-xs shadow-lg ${
                        selectedDiv === div.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      style={{
                        left: div.x,
                        top: div.y,
                        // width: div.width,
                        // height: div.height,
                        padding: "3px 3px",
                        paddingLeft: "3px",
                      }}
                      onMouseDown={(e) => handleDragStart(e, div)}
                      onTouchStart={(e) => handleTouchStart(e, div)}
                      onDoubleClick={() => setEditingDiv(div.id)}
                    >
                      {editingDiv === div.id ? (
                        <div className="w-full h-full flex flex-col gap-1">
                          <input
                            value={div.text}
                            onChange={(e) =>
                              updateDiv(div.id, { text: e.target.value })
                            }
                            onBlur={() => setEditingDiv(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setEditingDiv(null);
                              }
                            }}
                            autoFocus
                            className="flex-1 bg-transparent text-black text-sm font-semibold outline-none border-none p-0"
                            placeholder="Song name"
                          />
                          <input
                            value={div.artist}
                            onChange={(e) =>
                              updateDiv(div.id, { artist: e.target.value })
                            }
                            className="bg-transparent text-black text-xs outline-none border-none p-0"
                            placeholder="Artist name"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center">
                          {div.imageUrl && (
                            <div className="w-5 h-auto mr-[4px] flex-shrink-0">
                              <img
                                src={div.imageUrl}
                                alt="Album cover"
                                className="w-full h-full object-cover rounded-xs"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-center overflow-hidden">
                            <div
                              className={`font-bold text-[0.45rem]  ${
                                !sheSearched ? "text-black" : "text-white"
                              } truncate leading-tight`}
                            >
                              {div.text}
                            </div>
                            <div
                              className={`text-[0.35rem] ${
                                !sheSearched ? "text-black" : "text-white"
                              } mt-0.5`}
                            >
                              {div.artist}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Controls */}

                {/* Mobile Instructions */}
              </div>
              <div className="flex gap-2 flex-wrap mt-4">
                <button
                  onClick={triggerFileInput}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center"
                >
                  <Upload size={16} />
                  Replace Image
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
                  <strong>Tips:</strong> Search and click songs to add them.
                  Drag to move
                </p>
              </div>
            </div>

            {/* Songs Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">
                  Added Songs ({divs.length})
                </h3>

                {divs.length > 0 ? (
                  <div className="space-y-2">
                    {divs.map((div) => (
                      <div
                        key={div.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedDiv === div.id
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedDiv(div.id)}
                      >
                        <div className="flex items-center">
                          {div.imageUrl && (
                            <img
                              src={div.imageUrl}
                              alt="Album cover"
                              className="w-8 h-8 rounded mr-2 flex-shrink-0 object-cover"
                            />
                          )}
                          <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-medium truncate">
                              {div.text}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {div.artist}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDiv(div.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <Move size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No songs added yet</p>
                    <p className="text-sm mt-1">
                      Search above to find and add songs
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2 justify-center items-center text-xs">
        <h1>Powered by</h1>
        <a
          href="https://haithamexe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          <h1>Haitham Jalal</h1>
        </a>
      </div>
    </div>
  );
};

export default Home;
