// import { useState, useEffect, useRef } from "react";

// const Home = () => {
//   const [songs, setSongs] = useState([]);

//   const [search, setSearch] = useState("");

//   const [songsArray, setSongsArray] = useState(new Set());

//   const [image, setImage] = useState("");

//   const fileInputRef = useRef(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Create a URL for the selected image
//       const imageUrl = URL.createObjectURL(file);
//       setImage(imageUrl);
//     }
//   };

//   const handleImageButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   // Clear the selected image
//   const handleClearImage = () => {
//     setImage("");
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <div className="h-[100dvh] w-full p-5">
//       <div className="w-full h-full">
//         <form>
//           <input
//             type="text"
//             placeholder="song name"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//             }}
//             className="px-4 py-1 pb-1.5 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//           />
//         </form>
//         <section className="flex flex-col bg-black rounded-lg p-2 mt-2 gap-1">
//           <h1 className="text-white ">Songs added:</h1>
//           <div className="w-full">
//             {Array.from(songsArray).map((song, index) => (
//               <div key={index}>{song}</div>
//             ))}
//             {songsArray.size === 0 && (
//               <div className="text-gray-600 w-full h-50 items-center justify-center flex bg-gray-200 rounded-md border-1">
//                 No songs added yet.
//               </div>
//             )}
//           </div>
//         </section>
//         <section className="w-full md:h-[100vh]">
//           {image ? (
//             <img
//               src={image}
//               alt="Album Art"
//               className="w-full h-full object-contain rounded-lg mt-4"
//             />
//           ) : (
//             <div className="w-full h-115 flex items-center justify-center flex-col gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 mt-4">
//               <h1>No image uploaded.</h1>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//                 ref={fileInputRef}
//               />
//               <button
//                 type="button"
//                 onClick={handleImageButtonClick}
//                 className="mt-2 px-4 py-2 bg-blue-400 text-white rounded-lg text-md"
//               >
//                 Upload Image
//               </button>
//             </div>
//           )}
//         </section>
//         <button className="mt-2 px-4 py-2 bg-blue-400 text-white rounded-lg text-md w-full">
//           Download
//         </button>
//         <section className="w-full flex justify-center items-center mt-2 gap-1 text-xs pb-2">
//           <h1>Powered by </h1>
//           <a
//             href="https://haithamexe.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 "
//           >
//             Haitham Jalal
//           </a>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Home;

// import React, { useState, useRef, useCallback } from "react";
// import { Plus, Download, Trash2, Edit3, Move } from "lucide-react";

// const PhotoEditor = () => {
//   const [image, setImage] = useState(null);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [divs, setDivs] = useState([]);
//   const [selectedDiv, setSelectedDiv] = useState(null);
//   const [editingDiv, setEditingDiv] = useState(null);
//   const [draggedDiv, setDraggedDiv] = useState(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

//   const imageRef = useRef(null);
//   const containerRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImage(e.target.result);
//         setImageLoaded(false);
//         setDivs([]);
//         setSelectedDiv(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Add new div with hardcoded styling and random position
//   const addDiv = () => {
//     if (!imageLoaded || !containerRef.current) return;

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const maxX = Math.max(0, containerRect.width - 200); // Adjust for div width
//     const maxY = Math.max(0, containerRect.height - 60); // Adjust for div height

//     // Hardcoded styling - modify these values as needed
//     const newDiv = {
//       id: Date.now(),
//       x: Math.random() * maxX,
//       y: Math.random() * maxY,
//       width: 200,
//       height: 60,
//       text: "Sample Text",
//       fontSize: 20,
//       color: "#FFFFFF",
//       backgroundColor: "rgba(0, 0, 0, 0.7)",
//       borderColor: "#FFD700",
//       borderWidth: 2,
//     };

//     setDivs([...divs, newDiv]);
//     setSelectedDiv(newDiv.id);
//   };

//   // Delete div
//   const deleteDiv = (id) => {
//     setDivs(divs.filter((div) => div.id !== id));
//     if (selectedDiv === id) setSelectedDiv(null);
//     if (editingDiv === id) setEditingDiv(null);
//   };

//   // Update div properties
//   const updateDiv = (id, updates) => {
//     setDivs(divs.map((div) => (div.id === id ? { ...div, ...updates } : div)));
//   };

//   // Mouse down handler for dragging
//   const handleMouseDown = (e, div) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const divRect = e.currentTarget.getBoundingClientRect();

//     setDraggedDiv(div.id);
//     setSelectedDiv(div.id);
//     setDragOffset({
//       x: e.clientX - divRect.left,
//       y: e.clientY - divRect.top,
//     });
//   };

//   // Mouse move handler
//   const handleMouseMove = useCallback(
//     (e) => {
//       if (!draggedDiv || !containerRef.current) return;

//       const containerRect = containerRef.current.getBoundingClientRect();
//       const newX = e.clientX - containerRect.left - dragOffset.x;
//       const newY = e.clientY - containerRect.top - dragOffset.y;

//       updateDiv(draggedDiv, {
//         x: Math.max(0, Math.min(newX, containerRect.width - 120)),
//         y: Math.max(0, Math.min(newY, containerRect.height - 40)),
//       });
//     },
//     [draggedDiv, dragOffset, updateDiv]
//   );

//   // Mouse up handler
//   const handleMouseUp = useCallback(() => {
//     setDraggedDiv(null);
//     setDragOffset({ x: 0, y: 0 });
//   }, []);

//   // Add event listeners
//   React.useEffect(() => {
//     if (draggedDiv) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//       };
//     }
//   }, [draggedDiv, handleMouseMove, handleMouseUp]);

//   // Download merged image
//   const downloadImage = () => {
//     if (!imageLoaded || !imageRef.current || !containerRef.current) {
//       alert("Please wait for the image to load completely");
//       return;
//     }

//     try {
//       const img = imageRef.current;

//       // Check if image is properly loaded
//       if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
//         alert("Image not loaded properly. Please try again.");
//         return;
//       }

//       // Create a new image to ensure CORS compatibility
//       const tempImg = new Image();
//       tempImg.crossOrigin = "anonymous";

//       tempImg.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           if (!ctx) {
//             alert("Canvas not supported in your browser");
//             return;
//           }

//           canvas.width = tempImg.naturalWidth || tempImg.width;
//           canvas.height = tempImg.naturalHeight || tempImg.height;

//           // Draw the original image
//           ctx.drawImage(tempImg, 0, 0);

//           // Calculate scale factors
//           const displayWidth = img.offsetWidth || img.clientWidth;
//           const displayHeight = img.offsetHeight || img.clientHeight;
//           const scaleX = canvas.width / displayWidth;
//           const scaleY = canvas.height / displayHeight;

//           // Draw each div
//           divs.forEach((div) => {
//             const scaledX = div.x * scaleX;
//             const scaledY = div.y * scaleY;
//             const scaledWidth = div.width * scaleX;
//             const scaledHeight = div.height * scaleY;
//             const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//             // Draw background
//             if (div.backgroundColor && div.backgroundColor !== "transparent") {
//               ctx.fillStyle = div.backgroundColor;
//               ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             // Draw border
//             if (div.borderWidth > 0) {
//               ctx.strokeStyle = div.borderColor;
//               ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//               ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             // Draw text
//             if (div.text && div.text.trim()) {
//               ctx.fillStyle = div.color;
//               ctx.font = `${scaledFontSize}px Arial, sans-serif`;
//               ctx.textAlign = "center";
//               ctx.textBaseline = "middle";

//               const centerX = scaledX + scaledWidth / 2;
//               const centerY = scaledY + scaledHeight / 2;

//               // Handle multiline text
//               const lines = div.text.split("\n").filter((line) => line.trim());
//               const lineHeight = scaledFontSize * 1.2;
//               const totalHeight = lines.length * lineHeight;
//               const startY = centerY - totalHeight / 2 + lineHeight / 2;

//               lines.forEach((line, index) => {
//                 ctx.fillText(line.trim(), centerX, startY + index * lineHeight);
//               });
//             }
//           });

//           // Try different download methods
//           try {
//             // Method 1: toBlob (preferred)
//             canvas.toBlob(
//               (blob) => {
//                 if (blob) {
//                   const url = URL.createObjectURL(blob);
//                   const link = document.createElement("a");
//                   link.href = url;
//                   link.download = `edited-photo-${Date.now()}.png`;
//                   link.style.display = "none";

//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);

//                   setTimeout(() => URL.revokeObjectURL(url), 100);
//                 } else {
//                   // Method 2: Fallback to toDataURL
//                   downloadFallback(canvas);
//                 }
//               },
//               "image/png",
//               1.0
//             );
//           } catch (blobError) {
//             console.warn("Blob method failed, using fallback:", blobError);
//             downloadFallback(canvas);
//           }
//         } catch (canvasError) {
//           console.error("Canvas processing error:", canvasError);
//           alert("Error processing image. Please try with a different image.");
//         }
//       };

//       tempImg.onerror = () => {
//         console.warn("Temp image load failed, trying direct method");
//         // Fallback: try with original image
//         directDownload();
//       };

//       // Set source to trigger load
//       tempImg.src = img.src;
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Download failed. Please try again.");
//     }
//   };

//   // Fallback download method using toDataURL
//   const downloadFallback = (canvas) => {
//     try {
//       const dataURL = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = dataURL;
//       link.download = `edited-photo-${Date.now()}.png`;
//       link.style.display = "none";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Fallback download failed:", error);
//       alert("Download failed. Your browser may not support this feature.");
//     }
//   };

//   // Direct download method (last resort)
//   const directDownload = () => {
//     try {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = imageRef.current;

//       canvas.width = img.naturalWidth || img.width;
//       canvas.height = img.naturalHeight || img.height;

//       ctx.drawImage(img, 0, 0);

//       const displayWidth = img.offsetWidth || img.clientWidth;
//       const displayHeight = img.offsetHeight || img.clientHeight;
//       const scaleX = canvas.width / displayWidth;
//       const scaleY = canvas.height / displayHeight;

//       divs.forEach((div) => {
//         const scaledX = div.x * scaleX;
//         const scaledY = div.y * scaleY;
//         const scaledWidth = div.width * scaleX;
//         const scaledHeight = div.height * scaleY;
//         const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//         if (div.backgroundColor && div.backgroundColor !== "transparent") {
//           ctx.fillStyle = div.backgroundColor;
//           ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         if (div.borderWidth > 0) {
//           ctx.strokeStyle = div.borderColor;
//           ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//           ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         if (div.text && div.text.trim()) {
//           ctx.fillStyle = div.color;
//           ctx.font = `${scaledFontSize}px Arial, sans-serif`;
//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";

//           const centerX = scaledX + scaledWidth / 2;
//           const centerY = scaledY + scaledHeight / 2;

//           ctx.fillText(div.text, centerX, centerY);
//         }
//       });

//       downloadFallback(canvas);
//     } catch (error) {
//       console.error("Direct download failed:", error);
//       alert(
//         "All download methods failed. Please try with a different browser."
//       );
//     }
//   };

//   const selectedDivData = divs.find((div) => div.id === selectedDiv);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Songs Bombs Maker
//         </h1>

//         {/* Upload Section */}
//         {!image && (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="hidden"
//             />
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//             >
//               Upload Photo
//             </button>
//             <p className="text-gray-500 mt-2">
//               Choose an image to start editing
//             </p>
//           </div>
//         )}

//         {/* Main Editor */}
//         {image && (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Image Canvas */}
//             <div className="lg:col-span-3">
//               <div className="bg-white rounded-lg shadow-md p-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold">Canvas</h2>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={addDiv}
//                       disabled={!imageLoaded}
//                       className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-medium transition-colors"
//                     >
//                       <Plus size={16} />
//                       Add Text
//                     </button>
//                     <button
//                       onClick={downloadImage}
//                       disabled={!imageLoaded}
//                       className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-medium transition-colors"
//                     >
//                       <Download size={16} />
//                       Download
//                     </button>
//                   </div>
//                 </div>

//                 <div
//                   ref={containerRef}
//                   className="relative inline-block border border-gray-200 rounded overflow-hidden"
//                   onClick={(e) => {
//                     if (
//                       e.target === containerRef.current ||
//                       e.target === imageRef.current
//                     ) {
//                       setSelectedDiv(null);
//                       setEditingDiv(null);
//                     }
//                   }}
//                 >
//                   <img
//                     ref={imageRef}
//                     src={image}
//                     alt="Uploaded"
//                     className="max-w-full h-auto block"
//                     onLoad={() => setImageLoaded(true)}
//                     style={{ maxHeight: "70vh" }}
//                   />

//                   {/* Draggable Divs */}
//                   {divs.map((div) => (
//                     <div
//                       key={div.id}
//                       className={`absolute cursor-move select-none ${
//                         selectedDiv === div.id ? "ring-2 ring-blue-500" : ""
//                       }`}
//                       style={{
//                         left: div.x,
//                         top: div.y,
//                         width: div.width,
//                         height: div.height,
//                         backgroundColor: div.backgroundColor,
//                         color: div.color,
//                         fontSize: div.fontSize,
//                         border: `${div.borderWidth}px solid ${div.borderColor}`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         textAlign: "center",
//                         whiteSpace: "pre-wrap",
//                         wordWrap: "break-word",
//                         padding: "4px",
//                       }}
//                       onMouseDown={(e) => handleMouseDown(e, div)}
//                       onDoubleClick={() => setEditingDiv(div.id)}
//                     >
//                       {editingDiv === div.id ? (
//                         <textarea
//                           value={div.text}
//                           onChange={(e) =>
//                             updateDiv(div.id, { text: e.target.value })
//                           }
//                           onBlur={() => setEditingDiv(null)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter" && e.ctrlKey) {
//                               setEditingDiv(null);
//                             }
//                           }}
//                           autoFocus
//                           className="w-full h-full bg-transparent text-center resize-none outline-none border-none"
//                           style={{ fontSize: div.fontSize, color: div.color }}
//                         />
//                       ) : (
//                         div.text
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Properties Panel */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
//                 <h3 className="text-lg font-semibold mb-4">Elements</h3>

//                 {divs.length > 0 ? (
//                   <div className="space-y-2">
//                     {divs.map((div) => (
//                       <div
//                         key={div.id}
//                         className={`p-3 border rounded cursor-pointer transition-colors ${
//                           selectedDiv === div.id
//                             ? "border-blue-500 bg-blue-50"
//                             : "border-gray-200 hover:bg-gray-50"
//                         }`}
//                         onClick={() => setSelectedDiv(div.id)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm font-medium truncate">
//                             {div.text.substring(0, 20)}
//                             {div.text.length > 20 ? "..." : ""}
//                           </span>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteDiv(div.id);
//                             }}
//                             className="text-red-500 hover:text-red-700 transition-colors ml-2"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Position: {Math.round(div.x)}, {Math.round(div.y)}
//                         </div>
//                       </div>
//                     ))}

//                     {selectedDivData && (
//                       <div className="mt-4 p-3 bg-gray-50 rounded">
//                         <label className="block text-sm font-medium mb-1">
//                           Edit Text
//                         </label>
//                         <textarea
//                           value={selectedDivData.text}
//                           onChange={(e) =>
//                             updateDiv(selectedDiv, { text: e.target.value })
//                           }
//                           className="w-full p-2 border border-gray-300 rounded text-sm"
//                           rows={2}
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           Double-click element to edit inline
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="text-gray-500 text-center py-8">
//                     <Move size={32} className="mx-auto mb-2 opacity-50" />
//                     <p>No elements added yet</p>
//                     <p className="text-sm mt-2">Click "Add Text" to start</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PhotoEditor;

// import React, { useState, useRef, useCallback } from "react";
// import { Plus, Download, Trash2, Edit3, Move } from "lucide-react";

// const PhotoEditor = () => {
//   const [image, setImage] = useState(null);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [divs, setDivs] = useState([]);
//   const [selectedDiv, setSelectedDiv] = useState(null);
//   const [editingDiv, setEditingDiv] = useState(null);
//   const [draggedDiv, setDraggedDiv] = useState(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [lastTap, setLastTap] = useState(0);

//   const imageRef = useRef(null);
//   const containerRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImage(e.target.result);
//         setImageLoaded(false);
//         setDivs([]);
//         setSelectedDiv(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Add new div with hardcoded styling and random position
//   const addDiv = () => {
//     if (!imageLoaded || !containerRef.current) return;

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const maxX = Math.max(0, containerRect.width - 200);
//     const maxY = Math.max(0, containerRect.height - 60);

//     const newDiv = {
//       id: Date.now(),
//       x: Math.random() * maxX,
//       y: Math.random() * maxY,
//       width: 200,
//       height: 60,
//       text: "Sample Text",
//       fontSize: 20,
//       color: "#FFFFFF",
//       backgroundColor: "rgba(0, 0, 0, 0.7)",
//       borderColor: "#FFD700",
//       borderWidth: 2,
//     };

//     setDivs([...divs, newDiv]);
//     setSelectedDiv(newDiv.id);
//   };

//   // Delete div
//   const deleteDiv = (id) => {
//     setDivs(divs.filter((div) => div.id !== id));
//     if (selectedDiv === id) setSelectedDiv(null);
//     if (editingDiv === id) setEditingDiv(null);
//   };

//   // Update div properties
//   const updateDiv = (id, updates) => {
//     setDivs(divs.map((div) => (div.id === id ? { ...div, ...updates } : div)));
//   };

//   // Get position from mouse or touch event
//   const getEventPosition = (e) => {
//     if (e.touches && e.touches.length > 0) {
//       return { x: e.touches[0].clientX, y: e.touches[0].clientY };
//     }
//     return { x: e.clientX, y: e.clientY };
//   };

//   // Handle start of drag (mouse or touch)
//   const handleDragStart = (e, div) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const divRect = e.currentTarget.getBoundingClientRect();
//     const position = getEventPosition(e);

//     setDraggedDiv(div.id);
//     setSelectedDiv(div.id);
//     setDragOffset({
//       x: position.x - divRect.left,
//       y: position.y - divRect.top,
//     });
//   };

//   // Handle double tap on mobile for editing
//   const handleTouchStart = (e, div) => {
//     const currentTime = Date.now();
//     const tapGap = currentTime - lastTap;

//     if (tapGap < 300 && tapGap > 0) {
//       // Double tap detected
//       e.preventDefault();
//       setEditingDiv(div.id);
//       setSelectedDiv(div.id);
//       setLastTap(0);
//     } else {
//       setLastTap(currentTime);
//       handleDragStart(e, div);
//     }
//   };

//   // Mouse/Touch move handler
//   const handleMove = useCallback(
//     (e) => {
//       if (!draggedDiv || !containerRef.current) return;

//       e.preventDefault();
//       const containerRect = containerRef.current.getBoundingClientRect();
//       const position = getEventPosition(e);
//       const newX = position.x - containerRect.left - dragOffset.x;
//       const newY = position.y - containerRect.top - dragOffset.y;

//       const draggedDivData = divs.find((div) => div.id === draggedDiv);
//       if (draggedDivData) {
//         updateDiv(draggedDiv, {
//           x: Math.max(
//             0,
//             Math.min(newX, containerRect.width - draggedDivData.width)
//           ),
//           y: Math.max(
//             0,
//             Math.min(newY, containerRect.height - draggedDivData.height)
//           ),
//         });
//       }
//     },
//     [draggedDiv, dragOffset, divs]
//   );

//   // Mouse/Touch end handler
//   const handleDragEnd = useCallback(() => {
//     setDraggedDiv(null);
//     setDragOffset({ x: 0, y: 0 });
//   }, []);

//   // Add event listeners for both mouse and touch
//   React.useEffect(() => {
//     if (draggedDiv) {
//       // Mouse events
//       const handleMouseMove = (e) => handleMove(e);
//       const handleMouseUp = () => handleDragEnd();

//       // Touch events
//       const handleTouchMove = (e) => handleMove(e);
//       const handleTouchEnd = () => handleDragEnd();

//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       document.addEventListener("touchmove", handleTouchMove, {
//         passive: false,
//       });
//       document.addEventListener("touchend", handleTouchEnd);

//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//         document.removeEventListener("touchmove", handleTouchMove);
//         document.removeEventListener("touchend", handleTouchEnd);
//       };
//     }
//   }, [draggedDiv, handleMove, handleDragEnd]);

//   // Download merged image
//   const downloadImage = () => {
//     if (!imageLoaded || !imageRef.current || !containerRef.current) {
//       alert("Please wait for the image to load completely");
//       return;
//     }

//     try {
//       const img = imageRef.current;

//       if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
//         alert("Image not loaded properly. Please try again.");
//         return;
//       }

//       const tempImg = new Image();
//       tempImg.crossOrigin = "anonymous";

//       tempImg.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           if (!ctx) {
//             alert("Canvas not supported in your browser");
//             return;
//           }

//           canvas.width = tempImg.naturalWidth || tempImg.width;
//           canvas.height = tempImg.naturalHeight || tempImg.height;

//           ctx.drawImage(tempImg, 0, 0);

//           const displayWidth = img.offsetWidth || img.clientWidth;
//           const displayHeight = img.offsetHeight || img.clientHeight;
//           const scaleX = canvas.width / displayWidth;
//           const scaleY = canvas.height / displayHeight;

//           divs.forEach((div) => {
//             const scaledX = div.x * scaleX;
//             const scaledY = div.y * scaleY;
//             const scaledWidth = div.width * scaleX;
//             const scaledHeight = div.height * scaleY;
//             const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//             if (div.backgroundColor && div.backgroundColor !== "transparent") {
//               ctx.fillStyle = div.backgroundColor;
//               ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             if (div.borderWidth > 0) {
//               ctx.strokeStyle = div.borderColor;
//               ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//               ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             if (div.text && div.text.trim()) {
//               ctx.fillStyle = div.color;
//               ctx.font = `${scaledFontSize}px Arial, sans-serif`;
//               ctx.textAlign = "center";
//               ctx.textBaseline = "middle";

//               const centerX = scaledX + scaledWidth / 2;
//               const centerY = scaledY + scaledHeight / 2;

//               const lines = div.text.split("\n").filter((line) => line.trim());
//               const lineHeight = scaledFontSize * 1.2;
//               const totalHeight = lines.length * lineHeight;
//               const startY = centerY - totalHeight / 2 + lineHeight / 2;

//               lines.forEach((line, index) => {
//                 ctx.fillText(line.trim(), centerX, startY + index * lineHeight);
//               });
//             }
//           });

//           try {
//             canvas.toBlob(
//               (blob) => {
//                 if (blob) {
//                   const url = URL.createObjectURL(blob);
//                   const link = document.createElement("a");
//                   link.href = url;
//                   link.download = `edited-photo-${Date.now()}.png`;
//                   link.style.display = "none";

//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);

//                   setTimeout(() => URL.revokeObjectURL(url), 100);
//                 } else {
//                   downloadFallback(canvas);
//                 }
//               },
//               "image/png",
//               1.0
//             );
//           } catch (blobError) {
//             console.warn("Blob method failed, using fallback:", blobError);
//             downloadFallback(canvas);
//           }
//         } catch (canvasError) {
//           console.error("Canvas processing error:", canvasError);
//           alert("Error processing image. Please try with a different image.");
//         }
//       };

//       tempImg.onerror = () => {
//         console.warn("Temp image load failed, trying direct method");
//         directDownload();
//       };

//       tempImg.src = img.src;
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Download failed. Please try again.");
//     }
//   };

//   const downloadFallback = (canvas) => {
//     try {
//       const dataURL = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = dataURL;
//       link.download = `edited-photo-${Date.now()}.png`;
//       link.style.display = "none";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Fallback download failed:", error);
//       alert("Download failed. Your browser may not support this feature.");
//     }
//   };

//   const directDownload = () => {
//     try {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = imageRef.current;

//       canvas.width = img.naturalWidth || img.width;
//       canvas.height = img.naturalHeight || img.height;

//       ctx.drawImage(img, 0, 0);

//       const displayWidth = img.offsetWidth || img.clientWidth;
//       const displayHeight = img.offsetHeight || img.clientHeight;
//       const scaleX = canvas.width / displayWidth;
//       const scaleY = canvas.height / displayHeight;

//       divs.forEach((div) => {
//         const scaledX = div.x * scaleX;
//         const scaledY = div.y * scaleY;
//         const scaledWidth = div.width * scaleX;
//         const scaledHeight = div.height * scaleY;
//         const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//         if (div.backgroundColor && div.backgroundColor !== "transparent") {
//           ctx.fillStyle = div.backgroundColor;
//           ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         if (div.borderWidth > 0) {
//           ctx.strokeStyle = div.borderColor;
//           ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//           ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         if (div.text && div.text.trim()) {
//           ctx.fillStyle = div.color;
//           ctx.font = `${scaledFontSize}px Arial, sans-serif`;
//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";

//           const centerX = scaledX + scaledWidth / 2;
//           const centerY = scaledY + scaledHeight / 2;

//           ctx.fillText(div.text, centerX, centerY);
//         }
//       });

//       downloadFallback(canvas);
//     } catch (error) {
//       console.error("Direct download failed:", error);
//       alert(
//         "All download methods failed. Please try with a different browser."
//       );
//     }
//   };

//   const selectedDivData = divs.find((div) => div.id === selectedDiv);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Songs Bombs Maker
//         </h1>

//         {/* Upload Section */}
//         {!image && (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="hidden"
//             />
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//             >
//               Upload Photo
//             </button>
//             <p className="text-gray-500 mt-2">
//               Choose an image to start editing
//             </p>
//           </div>
//         )}

//         {/* Main Editor */}
//         {image && (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Image Canvas */}
//             <div className="lg:col-span-3">
//               <div className="bg-white rounded-lg shadow-md p-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold">Canvas</h2>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={addDiv}
//                       disabled={!imageLoaded}
//                       className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-medium transition-colors"
//                     >
//                       <Plus size={16} />
//                       Add Text
//                     </button>
//                     <button
//                       onClick={downloadImage}
//                       disabled={!imageLoaded}
//                       className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-medium transition-colors"
//                     >
//                       <Download size={16} />
//                       Download
//                     </button>
//                   </div>
//                 </div>

//                 <div
//                   ref={containerRef}
//                   className="relative inline-block border border-gray-200 rounded overflow-hidden"
//                   onClick={(e) => {
//                     if (
//                       e.target === containerRef.current ||
//                       e.target === imageRef.current
//                     ) {
//                       setSelectedDiv(null);
//                       setEditingDiv(null);
//                     }
//                   }}
//                 >
//                   <img
//                     ref={imageRef}
//                     src={image}
//                     alt="Uploaded"
//                     className="max-w-full h-auto block"
//                     onLoad={() => setImageLoaded(true)}
//                     style={{ maxHeight: "70vh" }}
//                   />

//                   {/* Draggable Divs */}
//                   {divs.map((div) => (
//                     <div
//                       key={div.id}
//                       className={`absolute cursor-move select-none touch-none ${
//                         selectedDiv === div.id ? "ring-2 ring-blue-500" : ""
//                       }`}
//                       style={{
//                         left: div.x,
//                         top: div.y,
//                         width: div.width,
//                         height: div.height,
//                         backgroundColor: div.backgroundColor,
//                         color: div.color,
//                         fontSize: div.fontSize,
//                         border: `${div.borderWidth}px solid ${div.borderColor}`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         textAlign: "center",
//                         whiteSpace: "pre-wrap",
//                         wordWrap: "break-word",
//                         padding: "4px",
//                       }}
//                       onMouseDown={(e) => handleDragStart(e, div)}
//                       onTouchStart={(e) => handleTouchStart(e, div)}
//                       onDoubleClick={() => setEditingDiv(div.id)}
//                     >
//                       {editingDiv === div.id ? (
//                         <textarea
//                           value={div.text}
//                           onChange={(e) =>
//                             updateDiv(div.id, { text: e.target.value })
//                           }
//                           onBlur={() => setEditingDiv(null)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter" && e.ctrlKey) {
//                               setEditingDiv(null);
//                             }
//                           }}
//                           autoFocus
//                           className="w-full h-full bg-transparent text-center resize-none outline-none border-none"
//                           style={{ fontSize: div.fontSize, color: div.color }}
//                         />
//                       ) : (
//                         div.text
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Mobile Instructions */}
//                 <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg lg:hidden">
//                   <p className="text-sm text-blue-800">
//                     📱 <strong>Mobile Tips:</strong> Tap and drag to move text
//                     boxes.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Properties Panel */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
//                 <h3 className="text-lg font-semibold mb-4">Elements</h3>

//                 {divs.length > 0 ? (
//                   <div className="space-y-2">
//                     {divs.map((div) => (
//                       <div
//                         key={div.id}
//                         className={`p-3 border rounded cursor-pointer transition-colors ${
//                           selectedDiv === div.id
//                             ? "border-blue-500 bg-blue-50"
//                             : "border-gray-200 hover:bg-gray-50"
//                         }`}
//                         onClick={() => setSelectedDiv(div.id)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm font-medium truncate">
//                             {div.text.substring(0, 20)}
//                             {div.text.length > 20 ? "..." : ""}
//                           </span>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteDiv(div.id);
//                             }}
//                             className="text-red-500 hover:text-red-700 transition-colors ml-2"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Position: {Math.round(div.x)}, {Math.round(div.y)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-gray-500 text-center py-8">
//                     <Move size={32} className="mx-auto mb-2 opacity-50" />
//                     <p>No elements added yet</p>
//                     <p className="text-sm mt-2">Click "Add Text" to start</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PhotoEditor;

// import React, { useState, useRef, useCallback, useEffect } from "react";
// import { Plus, Download, Trash2, Move, Upload } from "lucide-react";
// import { searchTracks } from "../utils/spotify";

// const PhotoEditor = () => {
//   const [image, setImage] = useState(null);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [divs, setDivs] = useState([]);
//   const [selectedDiv, setSelectedDiv] = useState(null);
//   const [editingDiv, setEditingDiv] = useState(null);
//   const [draggedDiv, setDraggedDiv] = useState(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [lastTap, setLastTap] = useState(0);
//   const [searchedSongs, setSearchedSongs] = useState([]);

//   const imageRef = useRef(null);
//   const containerRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!search) return;

//       const results = await searchedSongs(search);
//       setSearchedSongs(results);
//       console.log("Search results:", results);
//     };

//     fetchData();
//   }, [search]);

//   // Handle image upload/replace
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImage(e.target.result);
//         setImageLoaded(false);
//         setDivs([]);
//         setSelectedDiv(null);
//         setEditingDiv(null);
//       };
//       reader.readAsDataURL(file);
//     }
//     // Clear input to allow selecting same file again
//     if (event.target) {
//       event.target.value = "";
//     }
//   };

//   // Trigger file input click
//   const triggerFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""; // Clear first
//       fileInputRef.current.click();
//     }
//   };

//   // Add new div with hardcoded styling and random position
//   const addSongDiv = (song) => {
//     if (!imageLoaded || !containerRef.current) return;

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const maxX = Math.max(0, containerRect.width - 200);
//     const maxY = Math.max(0, containerRect.height - 60);

//     const newDiv = {
//       id: Date.now(),
//       x: Math.random() * maxX,
//       y: Math.random() * maxY,
//       width: 100,
//       height: 60,
//       text: song.name,
//       fontSize: 20,
//       color: "#FFFFFF",
//       backgroundColor: "rgba(255, 255, 255)",
//       borderColor: "#FFD700",
//       borderWidth: 2,
//     };

//     setDivs([...divs, newDiv]);
//     setSelectedDiv(newDiv.id);
//   };

//   // Delete div
//   const deleteDiv = (id) => {
//     setDivs(divs.filter((div) => div.id !== id));
//     if (selectedDiv === id) setSelectedDiv(null);
//     if (editingDiv === id) setEditingDiv(null);
//   };

//   // Update div properties
//   const updateDiv = (id, updates) => {
//     setDivs(divs.map((div) => (div.id === id ? { ...div, ...updates } : div)));
//   };

//   // Get position from mouse or touch event
//   const getEventPosition = (e) => {
//     if (e.touches && e.touches.length > 0) {
//       return { x: e.touches[0].clientX, y: e.touches[0].clientY };
//     }
//     return { x: e.clientX, y: e.clientY };
//   };

//   // Handle start of drag (mouse or touch)
//   const handleDragStart = (e, div) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const divRect = e.currentTarget.getBoundingClientRect();
//     const position = getEventPosition(e);

//     setDraggedDiv(div.id);
//     setSelectedDiv(div.id);
//     setDragOffset({
//       x: position.x - divRect.left,
//       y: position.y - divRect.top,
//     });
//   };

//   // Handle double tap on mobile for editing
//   const handleTouchStart = (e, div) => {
//     const currentTime = Date.now();
//     const tapGap = currentTime - lastTap;

//     if (tapGap < 300 && tapGap > 0) {
//       // Double tap detected
//       e.preventDefault();
//       setEditingDiv(div.id);
//       setSelectedDiv(div.id);
//       setLastTap(0);
//     } else {
//       setLastTap(currentTime);
//       handleDragStart(e, div);
//     }
//   };

//   // Mouse/Touch move handler
//   const handleMove = useCallback(
//     (e) => {
//       if (!draggedDiv || !containerRef.current) return;

//       e.preventDefault();
//       const containerRect = containerRef.current.getBoundingClientRect();
//       const position = getEventPosition(e);
//       const newX = position.x - containerRect.left - dragOffset.x;
//       const newY = position.y - containerRect.top - dragOffset.y;

//       const draggedDivData = divs.find((div) => div.id === draggedDiv);
//       if (draggedDivData) {
//         updateDiv(draggedDiv, {
//           x: Math.max(
//             0,
//             Math.min(newX, containerRect.width - draggedDivData.width)
//           ),
//           y: Math.max(
//             0,
//             Math.min(newY, containerRect.height - draggedDivData.height)
//           ),
//         });
//       }
//     },
//     [draggedDiv, dragOffset, divs]
//   );

//   // Mouse/Touch end handler
//   const handleDragEnd = useCallback(() => {
//     setDraggedDiv(null);
//     setDragOffset({ x: 0, y: 0 });
//   }, []);

//   // Add event listeners for both mouse and touch
//   useEffect(() => {
//     if (draggedDiv) {
//       const handleMouseMove = (e) => handleMove(e);
//       const handleMouseUp = () => handleDragEnd();
//       const handleTouchMove = (e) => handleMove(e);
//       const handleTouchEnd = () => handleDragEnd();

//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       document.addEventListener("touchmove", handleTouchMove, {
//         passive: false,
//       });
//       document.addEventListener("touchend", handleTouchEnd);

//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//         document.removeEventListener("touchmove", handleTouchMove);
//         document.removeEventListener("touchend", handleTouchEnd);
//       };
//     }
//   }, [draggedDiv, handleMove, handleDragEnd]);

//   // Download merged image
//   const downloadImage = () => {
//     if (!imageLoaded || !imageRef.current || !containerRef.current) {
//       alert("Please wait for the image to load completely");
//       return;
//     }

//     try {
//       const img = imageRef.current;

//       if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
//         alert("Image not loaded properly. Please try again.");
//         return;
//       }

//       const tempImg = new Image();
//       tempImg.crossOrigin = "anonymous";

//       tempImg.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           if (!ctx) {
//             alert("Canvas not supported in your browser");
//             return;
//           }

//           canvas.width = tempImg.naturalWidth || tempImg.width;
//           canvas.height = tempImg.naturalHeight || tempImg.height;

//           ctx.drawImage(tempImg, 0, 0);

//           const displayWidth = img.offsetWidth || img.clientWidth;
//           const displayHeight = img.offsetHeight || img.clientHeight;
//           const scaleX = canvas.width / displayWidth;
//           const scaleY = canvas.height / displayHeight;

//           divs.forEach((div) => {
//             const scaledX = div.x * scaleX;
//             const scaledY = div.y * scaleY;
//             const scaledWidth = div.width * scaleX;
//             const scaledHeight = div.height * scaleY;
//             const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//             if (div.backgroundColor && div.backgroundColor !== "transparent") {
//               ctx.fillStyle = div.backgroundColor;
//               ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             if (div.borderWidth > 0) {
//               ctx.strokeStyle = div.borderColor;
//               ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//               ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             if (div.text && div.text.trim()) {
//               ctx.fillStyle = div.color;
//               ctx.font = `${scaledFontSize}px Arial, sans-serif`;
//               ctx.textAlign = "center";
//               ctx.textBaseline = "middle";

//               const centerX = scaledX + scaledWidth / 2;
//               const centerY = scaledY + scaledHeight / 2;

//               const lines = div.text.split("\n").filter((line) => line.trim());
//               const lineHeight = scaledFontSize * 1.2;
//               const totalHeight = lines.length * lineHeight;
//               const startY = centerY - totalHeight / 2 + lineHeight / 2;

//               lines.forEach((line, index) => {
//                 ctx.fillText(line.trim(), centerX, startY + index * lineHeight);
//               });
//             }
//           });

//           try {
//             canvas.toBlob(
//               (blob) => {
//                 if (blob) {
//                   const url = URL.createObjectURL(blob);
//                   const link = document.createElement("a");
//                   link.href = url;
//                   link.download = `edited-photo-${Date.now()}.png`;
//                   link.style.display = "none";

//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);

//                   setTimeout(() => URL.revokeObjectURL(url), 100);
//                 } else {
//                   downloadFallback(canvas);
//                 }
//               },
//               "image/png",
//               1.0
//             );
//           } catch (blobError) {
//             console.warn("Blob method failed, using fallback:", blobError);
//             downloadFallback(canvas);
//           }
//         } catch (canvasError) {
//           console.error("Canvas processing error:", canvasError);
//           alert("Error processing image. Please try with a different image.");
//         }
//       };

//       tempImg.onerror = () => {
//         console.warn("Temp image load failed, trying direct method");
//         directDownload();
//       };

//       tempImg.src = img.src;
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Download failed. Please try again.");
//     }
//   };

//   const downloadFallback = (canvas) => {
//     try {
//       const dataURL = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = dataURL;
//       link.download = `edited-photo-${Date.now()}.png`;
//       link.style.display = "none";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Fallback download failed:", error);
//       alert("Download failed. Your browser may not support this feature.");
//     }
//   };

//   const directDownload = () => {
//     try {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = imageRef.current;

//       canvas.width = img.naturalWidth || img.width;
//       canvas.height = img.naturalHeight || img.height;

//       ctx.drawImage(img, 0, 0);

//       const displayWidth = img.offsetWidth || img.clientWidth;
//       const displayHeight = img.offsetHeight || img.clientHeight;
//       const scaleX = canvas.width / displayWidth;
//       const scaleY = canvas.height / displayHeight;

//       divs.forEach((div) => {
//         const scaledX = div.x * scaleX;
//         const scaledY = div.y * scaleY;
//         const scaledWidth = div.width * scaleX;
//         const scaledHeight = div.height * scaleY;
//         const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//         if (div.backgroundColor && div.backgroundColor !== "transparent") {
//           ctx.fillStyle = div.backgroundColor;
//           ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         if (div.borderWidth > 0) {
//           ctx.strokeStyle = div.borderColor;
//           ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//           ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         if (div.text && div.text.trim()) {
//           ctx.fillStyle = div.color;
//           ctx.font = `${scaledFontSize}px Arial, sans-serif`;
//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";

//           const centerX = scaledX + scaledWidth / 2;
//           const centerY = scaledY + scaledHeight / 2;

//           ctx.fillText(div.text, centerX, centerY);
//         }
//       });

//       downloadFallback(canvas);
//     } catch (error) {
//       console.error("Direct download failed:", error);
//       alert(
//         "All download methods failed. Please try with a different browser."
//       );
//     }
//   };

//   const selectedDivData = divs.find((div) => div.id === selectedDiv);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Songs Merger
//         </h1> */}
//         <input
//           type="text"
//           placeholder="Search for songs..."
//           className="border border-gray-600 rounded-lg px-4 py-2 mb-4 w-full"
//         />

//         {/* Hidden File Input */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           style={{ display: "none" }}
//         />

//         {/* Upload Section */}
//         {!image && (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
//             <button
//               onClick={triggerFileInput}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//             >
//               Upload Photo
//             </button>
//             <p className="text-gray-500 mt-2">
//               Choose an image to start editing
//             </p>
//           </div>
//         )}

//         {/* Main Editor */}
//         {image && (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Image Canvas */}
//             <div className="lg:col-span-3">
//               <div className="bg-white rounded-lg shadow-md p-4">
//                 <div
//                   ref={containerRef}
//                   className="relative inline-block border border-gray-200 rounded overflow-hidden"
//                   onClick={(e) => {
//                     if (
//                       e.target === containerRef.current ||
//                       e.target === imageRef.current
//                     ) {
//                       setSelectedDiv(null);
//                       setEditingDiv(null);
//                     }
//                   }}
//                 >
//                   <img
//                     ref={imageRef}
//                     src={image}
//                     alt="Uploaded"
//                     className="max-w-full h-auto block"
//                     onLoad={() => setImageLoaded(true)}
//                     style={{ maxHeight: "70vh" }}
//                   />

//                   {/* Draggable Divs */}
//                   {divs.map((div) => (
//                     <div
//                       key={div.id}
//                       className={`absolute cursor-move select-none touch-none ${
//                         selectedDiv === div.id ? "ring-2 ring-blue-500" : ""
//                       }`}
//                       style={{
//                         left: div.x,
//                         top: div.y,
//                         width: div.width,
//                         height: div.height,
//                         backgroundColor: div.backgroundColor,
//                         color: div.color,
//                         fontSize: div.fontSize,
//                         border: `${div.borderWidth}px solid ${div.borderColor}`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         textAlign: "center",
//                         whiteSpace: "pre-wrap",
//                         wordWrap: "break-word",
//                         padding: "4px",
//                       }}
//                       onMouseDown={(e) => handleDragStart(e, div)}
//                       onTouchStart={(e) => handleTouchStart(e, div)}
//                       onDoubleClick={() => setEditingDiv(div.id)}
//                     >
//                       {editingDiv === div.id ? (
//                         <textarea
//                           value={div.text}
//                           onChange={(e) =>
//                             updateDiv(div.id, { text: e.target.value })
//                           }
//                           onBlur={() => setEditingDiv(null)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter" && e.ctrlKey) {
//                               setEditingDiv(null);
//                             }
//                           }}
//                           autoFocus
//                           className="w-full h-full bg-transparent text-center resize-none outline-none border-none"
//                           style={{ fontSize: div.fontSize, color: div.color }}
//                         />
//                       ) : (
//                         div.text
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Mobile Instructions */}
//                 <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg lg:hidden">
//                   <p className="text-sm text-blue-800">
//                     Mobile Tips: Tap and drag to move song boxes.
//                   </p>
//                 </div>
//                 <div className="flex gap-2 flex-wrap mt-4">
//                   <button
//                     onClick={triggerFileInput}
//                     className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-medium transition-colors flex-1"
//                   >
//                     <Upload size={16} />
//                     Replace
//                   </button>

//                   <button
//                     onClick={downloadImage}
//                     disabled={!imageLoaded}
//                     className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-medium transition-colors  flex-1"
//                   >
//                     <Download size={16} />
//                     Download
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Properties Panel */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
//                 <h3 className="text-lg font-semibold mb-4">Songs</h3>

//                 {divs.length > 0 ? (
//                   <div className="space-y-2">
//                     {divs.map((div) => (
//                       <div
//                         key={div.id}
//                         className={`p-3 border rounded cursor-pointer transition-colors ${
//                           selectedDiv === div.id
//                             ? "border-blue-500 bg-blue-50"
//                             : "border-gray-200 hover:bg-gray-50"
//                         }`}
//                         onClick={() => setSelectedDiv(div.id)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm font-medium truncate">
//                             {div.text.substring(0, 20)}
//                             {div.text.length > 20 ? "..." : ""}
//                           </span>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteDiv(div.id);
//                             }}
//                             className="text-red-500 hover:text-red-700 transition-colors ml-2"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Position: {Math.round(div.x)}, {Math.round(div.y)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-gray-500 text-center py-8">
//                     <Move size={32} className="mx-auto mb-2 opacity-50" />
//                     <p>No Songs added yet</p>
//                     <p className="text-sm mt-2">
//                       Search for songs and add them to the list.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PhotoEditor;

// import React, { useState, useRef, useCallback, useEffect } from "react";
// import { Plus, Download, Trash2, Move, Upload } from "lucide-react";
// import { searchTracks } from "../utils/spotify";

// const PhotoEditor = () => {
//   const [image, setImage] = useState(null);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [divs, setDivs] = useState([]);
//   const [selectedDiv, setSelectedDiv] = useState(null);
//   const [editingDiv, setEditingDiv] = useState(null);
//   const [draggedDiv, setDraggedDiv] = useState(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [lastTap, setLastTap] = useState(0);
//   const [searchedSongs, setSearchedSongs] = useState([]);

//   const imageRef = useRef(null);
//   const containerRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!search) return;

//       const results = await searchTracks(search);
//       setSearchedSongs(results.tracks.items);
//       console.log("Search results:", results);
//       console.log("Search results:", results.tracks.items);
//       console.log("Search results:", results?.tracks?.items[0]?.name);
//       console.log(
//         "Search results:",
//         results?.tracks?.items[0]?.artists[0]?.name
//       );
//       console.log(
//         "Search results:",
//         results?.tracks?.items[0]?.album?.images?.[0]?.url
//       );
//     };

//     fetchData();
//   }, [search]);

//   // Handle image upload/replace
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImage(e.target.result);
//         setImageLoaded(false);
//         setDivs([]);
//         setSelectedDiv(null);
//         setEditingDiv(null);
//       };
//       reader.readAsDataURL(file);
//     }
//     // Clear input to allow selecting same file again
//     if (event.target) {
//       event.target.value = "";
//     }
//   };

//   // Trigger file input click
//   const triggerFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""; // Clear first
//       fileInputRef.current.click();
//     }
//   };

//   // Add new div with enhanced styling and song data
//   const addSongDiv = (song) => {
//     if (!imageLoaded || !containerRef.current) return;

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const maxX = Math.max(0, containerRect.width - 220); // Updated for new width
//     const maxY = Math.max(0, containerRect.height - 80); // Updated for new height

//     const newDiv = {
//       id: Date.now(),
//       x: Math.random() * maxX,
//       y: Math.random() * maxY,
//       width: 150, // Reduced width since image is smaller
//       height: 60, // Reduced height for more compact design
//       text: song.name,
//       artist: song.artists?.[0]?.name || "Unknown Artist",
//       imageUrl: song.album?.images?.[0]?.url || null,
//       fontSize: 10,
//       color: "#000000",
//       backgroundColor: "rgba(255, 255, 255)", // Slightly more opaque
//       borderColor: "#000000",
//       borderWidth: 1,
//       borderRadius: 4, // Rounded corners
//     };

//     setDivs([...divs, newDiv]);
//     setSelectedDiv(newDiv.id);
//   };

//   // Delete div
//   const deleteDiv = (id) => {
//     setDivs(divs.filter((div) => div.id !== id));
//     if (selectedDiv === id) setSelectedDiv(null);
//     if (editingDiv === id) setEditingDiv(null);
//   };

//   // Update div properties
//   const updateDiv = (id, updates) => {
//     setDivs(divs.map((div) => (div.id === id ? { ...div, ...updates } : div)));
//   };

//   // Get position from mouse or touch event
//   const getEventPosition = (e) => {
//     if (e.touches && e.touches.length > 0) {
//       return { x: e.touches[0].clientX, y: e.touches[0].clientY };
//     }
//     return { x: e.clientX, y: e.clientY };
//   };

//   // Handle start of drag (mouse or touch)
//   const handleDragStart = (e, div) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const divRect = e.currentTarget.getBoundingClientRect();
//     const position = getEventPosition(e);

//     setDraggedDiv(div.id);
//     setSelectedDiv(div.id);
//     setDragOffset({
//       x: position.x - divRect.left,
//       y: position.y - divRect.top,
//     });
//   };

//   // Handle double tap on mobile for editing
//   const handleTouchStart = (e, div) => {
//     const currentTime = Date.now();
//     const tapGap = currentTime - lastTap;

//     if (tapGap < 300 && tapGap > 0) {
//       // Double tap detected
//       e.preventDefault();
//       setEditingDiv(div.id);
//       setSelectedDiv(div.id);
//       setLastTap(0);
//     } else {
//       setLastTap(currentTime);
//       handleDragStart(e, div);
//     }
//   };

//   // Mouse/Touch move handler
//   const handleMove = useCallback(
//     (e) => {
//       if (!draggedDiv || !containerRef.current) return;

//       e.preventDefault();
//       const containerRect = containerRef.current.getBoundingClientRect();
//       const position = getEventPosition(e);
//       const newX = position.x - containerRect.left - dragOffset.x;
//       const newY = position.y - containerRect.top - dragOffset.y;

//       const draggedDivData = divs.find((div) => div.id === draggedDiv);
//       if (draggedDivData) {
//         updateDiv(draggedDiv, {
//           x: Math.max(
//             0,
//             Math.min(newX, containerRect.width - draggedDivData.width)
//           ),
//           y: Math.max(
//             0,
//             Math.min(newY, containerRect.height - draggedDivData.height)
//           ),
//         });
//       }
//     },
//     [draggedDiv, dragOffset, divs]
//   );

//   // Mouse/Touch end handler
//   const handleDragEnd = useCallback(() => {
//     setDraggedDiv(null);
//     setDragOffset({ x: 0, y: 0 });
//   }, []);

//   // Add event listeners for both mouse and touch
//   useEffect(() => {
//     if (draggedDiv) {
//       const handleMouseMove = (e) => handleMove(e);
//       const handleMouseUp = () => handleDragEnd();
//       const handleTouchMove = (e) => handleMove(e);
//       const handleTouchEnd = () => handleDragEnd();

//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       document.addEventListener("touchmove", handleTouchMove, {
//         passive: false,
//       });
//       document.addEventListener("touchend", handleTouchEnd);

//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//         document.removeEventListener("touchmove", handleTouchMove);
//         document.removeEventListener("touchend", handleTouchEnd);
//       };
//     }
//   }, [draggedDiv, handleMove, handleDragEnd]);

//   // Download merged image
//   const downloadImage = () => {
//     if (!imageLoaded || !imageRef.current || !containerRef.current) {
//       alert("Please wait for the image to load completely");
//       return;
//     }

//     try {
//       const img = imageRef.current;

//       if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
//         alert("Image not loaded properly. Please try again.");
//         return;
//       }

//       const tempImg = new Image();
//       tempImg.crossOrigin = "anonymous";

//       tempImg.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           if (!ctx) {
//             alert("Canvas not supported in your browser");
//             return;
//           }

//           canvas.width = tempImg.naturalWidth || tempImg.width;
//           canvas.height = tempImg.naturalHeight || tempImg.height;

//           ctx.drawImage(tempImg, 0, 0);

//           const displayWidth = img.offsetWidth || img.clientWidth;
//           const displayHeight = img.offsetHeight || img.clientHeight;
//           const scaleX = canvas.width / displayWidth;
//           const scaleY = canvas.height / displayHeight;

//           divs.forEach((div) => {
//             const scaledX = div.x * scaleX;
//             const scaledY = div.y * scaleY;
//             const scaledWidth = div.width * scaleX;
//             const scaledHeight = div.height * scaleY;
//             const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//             if (div.backgroundColor && div.backgroundColor !== "transparent") {
//               ctx.fillStyle = div.backgroundColor;
//               ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             if (div.borderWidth > 0) {
//               ctx.strokeStyle = div.borderColor;
//               ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//               ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//             }

//             // Draw album image if available
//             if (div.imageUrl) {
//               try {
//                 const img = new Image();
//                 img.crossOrigin = "anonymous";
//                 img.onload = () => {
//                   const imageSize = 48 * Math.min(scaleX, scaleY); // Smaller image size (48px)
//                   const padding = 8 * Math.min(scaleX, scaleY);
//                   ctx.drawImage(
//                     img,
//                     scaledX + padding,
//                     scaledY + (scaledHeight - imageSize) / 2, // Center vertically
//                     imageSize,
//                     imageSize
//                   );

//                   // Draw text after image loads
//                   drawSongText();
//                 };
//                 img.src = div.imageUrl;
//               } catch (error) {
//                 console.warn("Failed to load album image:", error);
//                 drawSongText();
//               }
//             } else {
//               drawSongText();
//             }

//             function drawSongText() {
//               const padding = 8 * Math.min(scaleX, scaleY);
//               const imageWidth = div.imageUrl
//                 ? 48 * Math.min(scaleX, scaleY)
//                 : 0; // Updated to match smaller image
//               const textStartX =
//                 scaledX +
//                 padding +
//                 imageWidth +
//                 (div.imageUrl ? padding + 4 : 0);
//               const textWidth =
//                 scaledWidth -
//                 padding * 2 -
//                 imageWidth -
//                 (div.imageUrl ? padding : 0);

//               // Draw song name
//               if (div.text && div.text.trim()) {
//                 ctx.fillStyle = div.color;
//                 ctx.font = `bold ${scaledFontSize}px Arial, sans-serif`;
//                 ctx.textAlign = "left";
//                 ctx.textBaseline = "top";

//                 const songY = scaledY + padding + scaledHeight * 0.25;
//                 ctx.fillText(div.text, textStartX, songY);
//               }

//               // Draw artist name
//               if (div.artist && div.artist.trim()) {
//                 ctx.fillStyle = div.color;
//                 ctx.font = `${scaledFontSize - 2}px Arial, sans-serif`;
//                 ctx.textAlign = "left";
//                 ctx.textBaseline = "top";

//                 const artistY = scaledY + padding + scaledHeight * 0.65;
//                 ctx.fillText(div.artist, textStartX, artistY);
//               }
//             }
//           });

//           try {
//             canvas.toBlob(
//               (blob) => {
//                 if (blob) {
//                   const url = URL.createObjectURL(blob);
//                   const link = document.createElement("a");
//                   link.href = url;
//                   link.download = `edited-photo-${Date.now()}.png`;
//                   link.style.display = "none";

//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);

//                   setTimeout(() => URL.revokeObjectURL(url), 100);
//                 } else {
//                   downloadFallback(canvas);
//                 }
//               },
//               "image/png",
//               1.0
//             );
//           } catch (blobError) {
//             console.warn("Blob method failed, using fallback:", blobError);
//             downloadFallback(canvas);
//           }
//         } catch (canvasError) {
//           console.error("Canvas processing error:", canvasError);
//           alert("Error processing image. Please try with a different image.");
//         }
//       };

//       tempImg.onerror = () => {
//         console.warn("Temp image load failed, trying direct method");
//         directDownload();
//       };

//       tempImg.src = img.src;
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Download failed. Please try again.");
//     }
//   };

//   const downloadFallback = (canvas) => {
//     try {
//       const dataURL = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = dataURL;
//       link.download = `edited-photo-${Date.now()}.png`;
//       link.style.display = "none";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Fallback download failed:", error);
//       alert("Download failed. Your browser may not support this feature.");
//     }
//   };

//   const directDownload = () => {
//     try {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = imageRef.current;

//       canvas.width = img.naturalWidth || img.width;
//       canvas.height = img.naturalHeight || img.height;

//       ctx.drawImage(img, 0, 0);

//       const displayWidth = img.offsetWidth || img.clientWidth;
//       const displayHeight = img.offsetHeight || img.clientHeight;
//       const scaleX = canvas.width / displayWidth;
//       const scaleY = canvas.height / displayHeight;

//       divs.forEach((div) => {
//         const scaledX = div.x * scaleX;
//         const scaledY = div.y * scaleY;
//         const scaledWidth = div.width * scaleX;
//         const scaledHeight = div.height * scaleY;
//         const scaledFontSize = div.fontSize * Math.min(scaleX, scaleY);

//         if (div.backgroundColor && div.backgroundColor !== "transparent") {
//           ctx.fillStyle = div.backgroundColor;
//           ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         if (div.borderWidth > 0) {
//           ctx.strokeStyle = div.borderColor;
//           ctx.lineWidth = div.borderWidth * Math.min(scaleX, scaleY);
//           ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
//         }

//         // Draw album image if available
//         if (div.imageUrl) {
//           const img = new Image();
//           img.crossOrigin = "anonymous";
//           img.onload = () => {
//             const imageSize = 48 * Math.min(scaleX, scaleY);
//             const padding = 8 * Math.min(scaleX, scaleY);
//             ctx.drawImage(
//               img,
//               scaledX + padding,
//               scaledY + (scaledHeight - imageSize) / 2,
//               imageSize,
//               imageSize
//             );
//           };
//           img.src = div.imageUrl;
//         }

//         // Draw song text
//         const padding = 8 * Math.min(scaleX, scaleY);
//         const imageWidth = div.imageUrl ? 48 * Math.min(scaleX, scaleY) : 0;
//         const textStartX =
//           scaledX + padding + imageWidth + (div.imageUrl ? padding + 4 : 0);

//         // Draw song name
//         if (div.text && div.text.trim()) {
//           ctx.fillStyle = div.color;
//           ctx.font = `bold ${scaledFontSize}px Arial, sans-serif`;
//           ctx.textAlign = "left";
//           ctx.textBaseline = "top";

//           const songY = scaledY + padding + scaledHeight * 0.25;
//           ctx.fillText(div.text, textStartX, songY);
//         }

//         // Draw artist name
//         if (div.artist && div.artist.trim()) {
//           ctx.fillStyle = div.color;
//           ctx.font = `${scaledFontSize - 2}px Arial, sans-serif`;
//           ctx.textAlign = "left";
//           ctx.textBaseline = "top";

//           const artistY = scaledY + padding + scaledHeight * 0.65;
//           ctx.fillText(div.artist, textStartX, artistY);
//         }
//       });

//       downloadFallback(canvas);
//     } catch (error) {
//       console.error("Direct download failed:", error);
//       alert(
//         "All download methods failed. Please try with a different browser."
//       );
//     }
//   };

//   const selectedDivData = divs.find((div) => div.id === selectedDiv);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         <input
//           type="text"
//           placeholder="Search for songs..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border border-gray-600 rounded-lg px-4 py-2 mb-4 w-full"
//         />

//         {/* Search Results */}
//         {searchedSongs.length > 0 && search && (
//           <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//             <h3 className="text-lg font-semibold mb-3">Search Results</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//               {searchedSongs.map((song, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
//                   onClick={() => {
//                     addSongDiv(song);
//                     setSearch("");
//                   }}
//                 >
//                   {song.album?.images?.[0]?.url && (
//                     <img
//                       src={song.album.images[0].url}
//                       alt="Album cover"
//                       className="w-10 h-10 rounded mr-3"
//                     />
//                   )}
//                   <div className="flex-1 overflow-hidden">
//                     <div className="text-sm font-medium truncate">
//                       {song.name}
//                     </div>
//                     <div className="text-xs text-gray-500 truncate">
//                       {song.artists?.[0]?.name || "Unknown Artist"}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Hidden File Input */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           style={{ display: "none" }}
//         />

//         {/* Upload Section */}
//         {!image && (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
//             <button
//               onClick={triggerFileInput}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//             >
//               Upload Photo
//             </button>
//             <p className="text-gray-500 mt-2">
//               Choose an image to start editing
//             </p>
//           </div>
//         )}

//         {/* Main Editor */}
//         {image && (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Image Canvas */}
//             <div className="lg:col-span-3">
//               <div className="bg-white rounded-lg shadow-md p-4">
//                 <div
//                   ref={containerRef}
//                   className="relative inline-block border border-gray-200 rounded overflow-hidden"
//                   onClick={(e) => {
//                     if (
//                       e.target === containerRef.current ||
//                       e.target === imageRef.current
//                     ) {
//                       setSelectedDiv(null);
//                       setEditingDiv(null);
//                     }
//                   }}
//                 >
//                   <img
//                     ref={imageRef}
//                     src={image}
//                     alt="Uploaded"
//                     className="max-w-full h-auto block"
//                     onLoad={() => setImageLoaded(true)}
//                     style={{ maxHeight: "70vh" }}
//                   />

//                   {/* Draggable Divs */}
//                   {divs.map((div) => (
//                     <div
//                       key={div.id}
//                       className={`absolute cursor-move select-none touch-none ${
//                         selectedDiv === div.id ? "ring-2 ring-blue-500" : ""
//                       }`}
//                       style={{
//                         left: div.x,
//                         top: div.y,
//                         width: div.width,
//                         height: div.height,
//                         backgroundColor: div.backgroundColor,
//                         color: div.color,
//                         fontSize: div.fontSize,
//                         border: `${div.borderWidth}px solid ${div.borderColor}`,
//                         borderRadius: "8px",
//                         overflow: "hidden",
//                         padding: "8px",
//                       }}
//                       onMouseDown={(e) => handleDragStart(e, div)}
//                       onTouchStart={(e) => handleTouchStart(e, div)}
//                       onDoubleClick={() => setEditingDiv(div.id)}
//                     >
//                       {editingDiv === div.id ? (
//                         <div className="w-full h-full flex flex-col">
//                           <textarea
//                             value={div.text}
//                             onChange={(e) =>
//                               updateDiv(div.id, { text: e.target.value })
//                             }
//                             onBlur={() => setEditingDiv(null)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" && e.ctrlKey) {
//                                 setEditingDiv(null);
//                               }
//                             }}
//                             autoFocus
//                             className="flex-1 bg-transparent text-white resize-none outline-none border-none text-sm"
//                             style={{ fontSize: div.fontSize, color: div.color }}
//                             placeholder="Song name"
//                           />
//                           <input
//                             value={div.artist}
//                             onChange={(e) =>
//                               updateDiv(div.id, { artist: e.target.value })
//                             }
//                             className="bg-transparent text-white outline-none border-none text-xs mt-1"
//                             style={{
//                               fontSize: div.fontSize - 2,
//                               color: div.color,
//                             }}
//                             placeholder="Artist name"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-full h-full flex items-center p-0">
//                           {/* Song Image */}
//                           {div.imageUrl && (
//                             <div className="w-12 h-12 mr-2 flex-shrink-0">
//                               <img
//                                 src={div.imageUrl}
//                                 alt="Album cover"
//                                 className="w-full h-full object-cover rounded-lg"
//                                 onError={(e) => {
//                                   e.target.style.display = "none";
//                                 }}
//                               />
//                             </div>
//                           )}

//                           {/* Song Info */}
//                           <div className="flex-1 flex flex-col justify-center overflow-hidden">
//                             <div
//                               className="font-semibold text-sm truncate leading-tight"
//                               style={{
//                                 fontSize: div.fontSize,
//                                 color: div.color,
//                               }}
//                             >
//                               {div.text}
//                             </div>
//                             <div
//                               className="text-xs opacity-80 truncate mt-0.5"
//                               style={{
//                                 fontSize: div.fontSize - 2,
//                                 color: div.color,
//                               }}
//                             >
//                               {div.artist}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Mobile Instructions */}
//                 <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg lg:hidden">
//                   <p className="text-sm text-blue-800">
//                     Mobile Tips: Tap and drag to move song boxes.
//                   </p>
//                 </div>
//                 <div className="flex gap-2 flex-wrap mt-4">
//                   <button
//                     onClick={triggerFileInput}
//                     className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-medium transition-colors flex-1"
//                   >
//                     <Upload size={16} />
//                     Replace
//                   </button>

//                   <button
//                     onClick={downloadImage}
//                     disabled={!imageLoaded}
//                     className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-medium transition-colors  flex-1"
//                   >
//                     <Download size={16} />
//                     Download
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Properties Panel */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
//                 <h3 className="text-lg font-semibold mb-4">Songs</h3>

//                 {divs.length > 0 ? (
//                   <div className="space-y-2">
//                     {divs.map((div) => (
//                       <div
//                         key={div.id}
//                         className={`p-3 border rounded cursor-pointer transition-colors ${
//                           selectedDiv === div.id
//                             ? "border-blue-500 bg-blue-50"
//                             : "border-gray-200 hover:bg-gray-50"
//                         }`}
//                         onClick={() => setSelectedDiv(div.id)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center flex-1 overflow-hidden">
//                             {div.imageUrl && (
//                               <img
//                                 src={div.imageUrl}
//                                 alt="Album cover"
//                                 className="w-8 h-8 rounded mr-2 flex-shrink-0"
//                               />
//                             )}
//                             <div className="flex-1 overflow-hidden">
//                               <div className="text-sm font-medium truncate">
//                                 {div.text}
//                               </div>
//                               <div className="text-xs text-gray-500 truncate">
//                                 {div.artist}
//                               </div>
//                             </div>
//                           </div>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteDiv(div.id);
//                             }}
//                             className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Position: {Math.round(div.x)}, {Math.round(div.y)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-gray-500 text-center py-8">
//                     <Move size={32} className="mx-auto mb-2 opacity-50" />
//                     <p>No Songs added yet</p>
//                     <p className="text-sm mt-2">
//                       Search for songs and add them to the list.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PhotoEditor;

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
      width: !isMobile ? 200 : 130,
      height: !isMobile ? 70 : 50,
      text: song.name,
      artist: song.artists?.[0]?.name || "Unknown Artist",
      imageUrl: song.album?.images?.[0]?.url || null,
    };

    setDivs([...divs, newDiv]);
    setSelectedDiv(newDiv.id);
    setSearch(""); // Clear search after adding
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Song Photo Editor
        </h1>

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
              {searchedSongs.slice(0, 6).map((song, index) => (
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
              <div className="bg-white rounded-lg shadow-md p-4">
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
                      className={`absolute cursor-move select-none touch-none bg-white bg-opacity-95 border border-black rounded-sm shadow-lg ${
                        selectedDiv === div.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      style={{
                        left: div.x,
                        top: div.y,
                        width: div.width,
                        height: div.height,
                        padding: "8px",
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
                            <div className="w-9 h-auto mr-3 flex-shrink-0">
                              <img
                                src={div.imageUrl}
                                alt="Album cover"
                                className="w-full h-full object-cover rounded-sm"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-center overflow-hidden">
                            <div className="font-semibold text-[0.6rem] md:text-sm text-black truncate leading-tight">
                              {div.text}
                            </div>
                            <div className="text-[0.5rem] text-black opacity-70 truncate mt-0.5">
                              {div.artist}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex gap-2 flex-wrap mt-4">
                  <button
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center"
                  >
                    <Upload size={16} />
                    Replace Image
                  </button>

                  <button
                    onClick={downloadImage}
                    disabled={!imageLoaded}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>

                {/* Mobile Instructions */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tips:</strong> Search and click songs to add them.
                    Drag to move, double-click to edit text.
                  </p>
                </div>
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
                              className="w-8 h-8 rounded mr-3 flex-shrink-0 object-cover"
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
