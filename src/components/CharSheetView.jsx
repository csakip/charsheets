import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import ZoomContols from "./ZoomContols";

export default function CharSheetView() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const viewerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const noClickScroll = (e) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("mousedown", noClickScroll, { passive: false });

    return () => {
      window.removeEventListener("mousedown", handleWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle zoom with cursor-based scaling
  const handleWheel = (e) => {
    if (e.shiftKey) {
      e.preventDefault();
      const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1;

      const rect = e.currentTarget.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const newScale = Math.max(0.5, Math.min(2, scale * zoomAmount));

      // Adjust position to keep the content centered under the cursor
      setPosition((prev) => ({
        x: cursorX - ((cursorX - prev.x) * newScale) / scale,
        y: cursorY - ((cursorY - prev.y) * newScale) / scale,
      }));

      setScale(newScale);
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
    setPosition({ x: e.clientX - start.x, y: e.clientY - start.y });
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

    setPosition({ x: newX, y: newY });
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  // function layoutChanged(layout) {
  //   useCSStore.getState().storeLayout(layout);
  // }

  return (
    <>
      <div
        id='viewer'
        ref={viewerRef}
        className='d-flex flex-fill mt-1 position-relative'
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}>
        <div
          id='content'
          ref={contentRef}
          data-bs-theme='light'
          className='bg-light'
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}>
          <h1>Drag and Zoom Me!</h1>
          <p>This content can be moved and zoomed.</p>
          <Form>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Label>Email address</Form.Label>
              <Form.Control type='email' placeholder='name@example.com' />
            </Form.Group>
            <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as='textarea' rows={3} />
            </Form.Group>
          </Form>
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
