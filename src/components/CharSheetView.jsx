import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import ZoomContols from "./ZoomContols";
import { Dice1 } from "react-bootstrap-icons";
import Layout from "./Layout";

// const PAGE_MARGINS = 50;

export default function CharSheetView({ layout, items }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const viewerRef = useRef(null);
  const contentRef = useRef(null);
  const scrollbarX = useRef(null);
  const scrollbarY = useRef(null);

  useEffect(() => {
    const noClickScroll = (e) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("mousedown", noClickScroll, { passive: false });
    window.addEventListener("resize", updateScrollbars);

    updateScrollbars();

    return () => {
      window.removeEventListener("mousedown", handleWheel);
      window.removeEventListener("resize", updateScrollbars);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Center content
  useEffect(() => {
    resetZoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScrollbars = () => {
    setTimeout(() => {
      if (!viewerRef.current || !contentRef.current) return;

      const viewer = viewerRef.current;
      const content = contentRef.current;

      // Get bounding rectangles
      const viewerRect = viewer.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      const scrollTopRatio = (-1 * (contentRect.top - viewerRect.top)) / contentRect.height;
      const scrollHeightRatio = (viewerRect.height - 32) / contentRect.height;

      scrollbarY.current.style.top = `${scrollTopRatio * 100}%`;
      scrollbarY.current.style.height = `${Math.max(0.02, scrollHeightRatio) * 100}%`;
      scrollbarY.current.style.opacity =
        contentRect.height > viewerRect.height ||
        (scrollTopRatio > 0 && scrollHeightRatio > 1) ||
        (scrollTopRatio + scrollHeightRatio < 1 && scrollHeightRatio > 1)
          ? 0.5
          : 0;

      const scrollLeftRatio = (-1 * (contentRect.left - viewerRect.left)) / contentRect.width;
      const scrollWidthRatio = viewerRect.width / contentRect.width;

      scrollbarX.current.style.left = `${scrollLeftRatio * 100}%`;
      scrollbarX.current.style.width = `${Math.max(0.02, scrollWidthRatio) * 100}%`;
      scrollbarX.current.style.opacity =
        contentRect.width > viewerRect.width ||
        (scrollLeftRatio > 0 && scrollWidthRatio > 1) ||
        (scrollLeftRatio + scrollWidthRatio < 1 && scrollWidthRatio > 1)
          ? 0.5
          : 0;
    }, 0);
  };

  function resetZoom() {
    if (!viewerRef.current || !contentRef.current) return;
    handleZoom(1);
    setTimeout(() => {
      const viewerRect = viewerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      setConstrainedPosition({ x: (viewerRect.width - contentRect.width) / 2, y: 0 });
    }, 0);
  }

  // Handle zoom with cursor-based scaling
  const handleWheel = (e) => {
    const isInEditor = e.target.closest(".tiptap");
    if (isInEditor) return;

    if (e.shiftKey) {
      e.preventDefault();
      const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1;

      const rect = e.currentTarget.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const newScale = Math.max(0.5, Math.min(2, scale * zoomAmount));

      // Adjust position to keep the content centered under the cursor
      setConstrainedPosition((prev) => ({
        x: cursorX - ((cursorX - prev.x) * newScale) / scale,
        y: cursorY - ((cursorY - prev.y) * newScale) / scale,
      }));

      setScale(newScale);
      //      updateScrollbars();
    } else {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -1 : 1;
      setConstrainedPosition((prev) => ({ x: prev.x, y: position.y + direction * 50 }));
    }
  };

  // Handle drag start
  const handleMouseDown = (e) => {
    if (e.buttons !== 4) return;
    viewerRef.current.style.cursor = "grabbing";
    setIsDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    document.body.style.userSelect = "none"; // Disable text selection
  };

  // Handle dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setConstrainedPosition({ x: e.clientX - start.x, y: e.clientY - start.y });
    //updateScrollbars();
  };

  // Handle drag end
  const handleMouseUp = () => {
    viewerRef.current.style.cursor = "default";
    setIsDragging(false);
    document.body.style.userSelect = "";
  };

  const handleMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    viewerRef.current.style.cursor = "default";
  };

  // Resume dragging on mouse enter if button is still pressed
  const handleMouseEnter = (e) => {
    if (e.buttons !== 4) return;
    setIsDragging(true);
    viewerRef.current.style.cursor = "grabbing";
  };

  // Handle zoom with slider or buttons
  const handleZoom = (newScale) => {
    const rect = document.getElementById("content").getBoundingClientRect();
    const offsetX = rect.width / 2;
    const offsetY = rect.height / 2;

    // Calculate new position to keep the center fixed
    const newX = position.x + offsetX * (scale - newScale);
    const newY = position.y + offsetY * (scale - newScale);

    setConstrainedPosition({ x: newX, y: newY });
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  function handleKeyDown(e) {
    if (document.activeElement.id !== "viewer") return;
    let xMove = 0;
    let yMove = 0;
    switch (e.key) {
      case "ArrowLeft":
        xMove = 50;
        break;
      case "ArrowRight":
        xMove = -50;
        break;
      case "ArrowUp":
        yMove = 50;
        break;
      case "ArrowDown":
        yMove = -50;
        break;
      case "PageUp":
        yMove = 400;
        break;
      case "PageDown":
        yMove = -400;
        break;
    }
    if (xMove !== 0 || yMove !== 0) {
      e.preventDefault();
      setConstrainedPosition({ x: position.x + xMove, y: position.y + yMove });
    }
  }

  // function layoutChanged(layout) {
  //   useCSStore.getState().storeLayout(layout);
  // }

  function setConstrainedPosition(newPosition) {
    //TODO: constrain within page + PAGE_MARGINS
    // if newPosition is a function
    if (typeof newPosition === "function") {
      newPosition = newPosition(position);
    }
    console.log(newPosition);
    const x = Math.max(newPosition.x, 0);
    const y = Math.min(newPosition.y, 0);
    setPosition({ x, y });
  }

  updateScrollbars();

  return (
    <>
      <div
        id='viewer'
        ref={viewerRef}
        tabIndex={0}
        className='d-flex flex-1 position-relative'
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onKeyDown={handleKeyDown}>
        <div
          id='content'
          ref={contentRef}
          data-bs-theme='light'
          className='bg-light d-flex'
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}>
          <Layout cell={layout} items={items} />
        </div>
        <div className='scrollbar-y' ref={scrollbarY}></div>
        <div className='scrollbar-x' ref={scrollbarX}></div>
        <div className='scrollbar-corner'>
          <Button className='icon-button d-block' variant='' size='sm' onClick={resetZoom}>
            <Dice1 />
          </Button>
        </div>
      </div>
      <div className='d-flex'>
        <div className='ms-auto'>
          <ZoomContols handleZoom={handleZoom} scale={scale} />
        </div>
      </div>
    </>
  );
}
