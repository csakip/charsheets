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

  const isDraggingX = useRef(false);
  const isDraggingY = useRef(false);

  const scrollStartX = useRef(0);
  const scrollStartY = useRef(0);
  const scrollInitialContentPositionY = useRef(0);
  const scrollInitialContentPositionX = useRef(0);

  useEffect(() => {
    const noClickScroll = (e) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("mousedown", noClickScroll, { passive: false });
    window.addEventListener("resize", updateScrollbars);

    const handleGlobalMouseMove = (e) => {
      handleScrollbarMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleScrollbarMouseUp();
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    updateScrollbars();

    return () => {
      window.removeEventListener("mousedown", handleWheel);
      window.removeEventListener("resize", updateScrollbars);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
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
      const viewerRect = viewer.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      // Y axis
      if (contentRect.height > viewerRect.height) {
        const scrollTopRatio = (-1 * (contentRect.top - viewerRect.top)) / contentRect.height;
        const scrollHeightRatio = (viewerRect.height - 32) / contentRect.height;

        scrollbarY.current.style.top = `${scrollTopRatio * 100}%`;
        scrollbarY.current.style.height = `${Math.max(0.02, scrollHeightRatio) * 100}%`;
      } else {
        const thumbTop = (contentRect.top - viewerRect.top) / viewerRect.height;
        const thumbHeight = contentRect.height / viewerRect.height;

        scrollbarY.current.style.top = `${thumbTop * 100}%`;
        scrollbarY.current.style.height = `${thumbHeight * 100}%`;
      }

      // X axis
      if (contentRect.width > viewerRect.width) {
        const scrollLeftRatio = (-1 * (contentRect.left - viewerRect.left)) / contentRect.width;
        const scrollWidthRatio = viewerRect.width / contentRect.width;

        scrollbarX.current.style.left = `${scrollLeftRatio * 100}%`;
        scrollbarX.current.style.width = `${Math.max(0.02, scrollWidthRatio) * 100}%`;
        scrollbarX.current.style.opacity = 0.5;
      } else {
        scrollbarX.current.style.opacity = 0;

        // const thumbLeft = (contentRect.left - viewerRect.left) / viewerRect.width;
        // const thumbWidth = contentRect.width / viewerRect.width;

        // scrollbarX.current.style.left = `${thumbLeft * 100}%`;
        // scrollbarX.current.style.width = `${thumbWidth * 100}%`;
      }
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

  function zoomToFullWidth() {
    if (!viewerRef.current || !contentRef.current) return;
    const viewerRect = viewerRef.current.getBoundingClientRect();
    const originalContentWidth = contentRef.current.offsetWidth;

    // Calculate scale but cap at 1.5
    let scale = viewerRect.width / originalContentWidth;
    scale = Math.min(scale, 1.5);

    // Calculate the centered position on X-axis
    const newWidth = originalContentWidth * scale;
    const centeredX = (viewerRect.width - newWidth) / 2;

    // Apply transform directly to prevent flickering
    contentRef.current.style.transform = `translate(${centeredX}px, ${position.y}px) scale(${scale})`;

    // Update state after the transform is applied
    requestAnimationFrame(() => {
      setScale(scale);
      setConstrainedPosition({
        x: centeredX,
        y: position.y,
      });
    });
  }

  function zoomToFullHeight() {
    if (!viewerRef.current || !contentRef.current) return;

    const viewerRect = viewerRef.current.getBoundingClientRect();
    // Use the unscaled height
    const originalContentHeight = contentRef.current.offsetHeight;
    const scale = viewerRect.height / originalContentHeight;

    handleZoom(scale);

    requestAnimationFrame(() => {
      const newContentRect = contentRef.current.getBoundingClientRect();
      setConstrainedPosition({
        x: (viewerRect.width - newContentRect.width) / 2,
        y: 0,
      });
    });
  }

  // Handle zoom with cursor-based scaling
  const handleWheel = (e) => {
    const closestLayoutBox = e.target.closest(".layout-box");
    const hasVerticalScroll =
      closestLayoutBox && closestLayoutBox.scrollHeight > closestLayoutBox.clientHeight;
    const isAtBottom =
      closestLayoutBox &&
      closestLayoutBox.scrollHeight - closestLayoutBox.scrollTop <=
        closestLayoutBox.clientHeight + 1;
    const isAtTop = closestLayoutBox && closestLayoutBox.scrollTop === 0;
    const isInEditor =
      e.target.closest(".tiptap") ||
      (hasVerticalScroll && !((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)));
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
    setStart({ x: e.clientX, y: e.clientY });
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !viewerRef.current || !contentRef.current) return;

    // Calculate movement delta since last position
    const deltaX = e.clientX - start.x;
    const deltaY = e.clientY - start.y;

    // Update start position for next movement
    setStart({ x: e.clientX, y: e.clientY });

    // Get current boundaries
    const viewerRect = viewerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    // Calculate new position
    let newX = position.x + deltaX;
    let newY = position.y + deltaY;

    // Apply constraints
    // X-axis constraints
    if (contentRect.width <= viewerRect.width) {
      // Content is smaller than viewer on X axis - keep within bounds
      newX = Math.min(Math.max(newX, 0), viewerRect.width - contentRect.width);
    } else {
      // Content is larger - prevent scrolling past edges
      newX = Math.min(newX, 0);
      newX = Math.max(newX, viewerRect.width - contentRect.width);
    }

    // Y-axis constraints
    if (contentRect.height <= viewerRect.height) {
      // Content is smaller than viewer on Y axis - keep within bounds
      newY = Math.min(Math.max(newY, 0), viewerRect.height - contentRect.height);
    } else {
      // Content is larger - prevent scrolling past edges
      newY = Math.min(newY, 0);
      newY = Math.max(newY, viewerRect.height - contentRect.height);
    }

    // Update position
    setPosition({ x: newX, y: newY });
    updateScrollbars();
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
    console.log(newScale);
    // Clamp the scale value first
    const clampedNewScale = Math.max(0.5, Math.min(1.5, newScale));

    // If scale didn't actually change (hit min/max), don't move content
    if (clampedNewScale === scale) {
      return;
    }

    const rect = document.getElementById("content").getBoundingClientRect();
    const offsetX = rect.width / 2;
    const offsetY = rect.height / 2;

    // Calculate position adjustments based on the actual scale change
    const newX = position.x + offsetX * (scale - clampedNewScale);
    const newY = position.y + offsetY * (scale - clampedNewScale);

    // Apply the new position with constraints
    setConstrainedPosition({ x: newX, y: newY });

    // Update the scale
    setScale(clampedNewScale);
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

  //-----------------------------------------------------------------------------------------------

  const handleScrollbarXMouseDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    isDraggingX.current = true;
    scrollStartX.current = e.clientX;
    scrollInitialContentPositionX.current = position.x;
    document.body.style.userSelect = "none";
  };

  const handleScrollbarYMouseDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    isDraggingY.current = true;
    scrollStartY.current = e.clientY;
    scrollInitialContentPositionY.current = position.y;
    document.body.style.userSelect = "none";
  };

  const handleScrollbarMouseMove = (e) => {
    if (isDraggingX.current) {
      const deltaX = e.clientX - scrollStartX.current;
      if (!viewerRef.current || !contentRef.current) return;

      const viewerRect = viewerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      let newX;
      if (contentRect.width > viewerRect.width) {
        const deltaXPercent = deltaX / viewerRef.current.clientWidth;
        const moveAmount = contentRect.width * deltaXPercent;
        newX = scrollInitialContentPositionX.current - moveAmount;
        newX = Math.min(newX, 0);
        newX = Math.max(newX, viewerRect.width - contentRect.width);
      } else {
        return;
        // newX = scrollInitialContentPositionX.current + deltaX;
        // newX = Math.max(newX, 0);
        // newX = Math.min(newX, viewerRect.width - contentRect.width);
      }
      setPosition((prev) => ({ ...prev, x: newX }));
      updateScrollbars();
    }

    if (isDraggingY.current) {
      const deltaY = e.clientY - scrollStartY.current;
      if (!viewerRef.current || !contentRef.current) return;

      const viewerRect = viewerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      let newY;
      if (contentRect.height > viewerRect.height) {
        const deltaYPercent = deltaY / viewerRef.current.clientHeight;
        const moveAmount = contentRect.height * deltaYPercent;
        newY = scrollInitialContentPositionY.current - moveAmount;
        newY = Math.min(newY, 0);
        newY = Math.max(newY, viewerRect.height - contentRect.height);
      } else {
        newY = scrollInitialContentPositionY.current + deltaY;
        newY = Math.max(newY, 0);
        newY = Math.min(newY, viewerRect.height - contentRect.height);
      }
      setPosition((prev) => ({ ...prev, y: newY }));
      updateScrollbars();
    }
  };

  const handleScrollbarMouseUp = () => {
    isDraggingX.current = false;
    isDraggingY.current = false;
    document.body.style.userSelect = "";
  };

  function setConstrainedPosition(newPosition) {
    if (typeof newPosition === "function") {
      newPosition = newPosition(position);
    }

    if (!viewerRef.current || !contentRef.current) return;

    const viewerRect = viewerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    let x = newPosition.x;
    let y = newPosition.y;

    // Case 1: Content is smaller than viewer on X axis
    if (contentRect.width <= viewerRect.width) {
      // Keep content within viewer bounds
      x = Math.min(Math.max(x, 0), viewerRect.width - contentRect.width);
    } else {
      // Case 2: Content is larger than viewer on X axis
      // Prevent scrolling past content edges
      x = Math.min(x, 0); // Left edge constraint
      x = Math.max(x, viewerRect.width - contentRect.width); // Right edge constraint
    }

    // Case 1: Content is smaller than viewer on Y axis
    if (contentRect.height <= viewerRect.height) {
      // Keep content within viewer bounds
      y = Math.min(Math.max(y, 0), viewerRect.height - contentRect.height);
    } else {
      // Case 2: Content is larger than viewer on Y axis
      // Prevent scrolling past content edges
      y = Math.min(y, 0); // Top edge constraint
      y = Math.max(y, viewerRect.height - contentRect.height); // Bottom edge constraint
    }

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
        <div
          className='scrollbar-y'
          ref={scrollbarY}
          onMouseDown={handleScrollbarYMouseDown}
          draggable={false}></div>
        <div
          className='scrollbar-x'
          ref={scrollbarX}
          onMouseDown={handleScrollbarXMouseDown}
          draggable={false}></div>
        <div className='scrollbar-corner'>
          <Button className='icon-button d-block' variant='' size='sm' onClick={resetZoom}>
            <Dice1 />
          </Button>
        </div>
      </div>
      <div className='d-flex'>
        <div className='ms-auto'>
          <ZoomContols
            handleZoom={handleZoom}
            zoomToFullWidth={zoomToFullWidth}
            zoomToFullHeight={zoomToFullHeight}
            scale={scale}
          />
        </div>
      </div>
    </>
  );
}
