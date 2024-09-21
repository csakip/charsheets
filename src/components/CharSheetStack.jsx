import { Responsive } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import LabelValues from "./cards/LabelValues";
import { Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

export default function CharSheetStack({ items }) {
  const [width, setWidth] = useState(800);
  const layoutContainerRef = useRef(null);

  useEffect(() => {
    if (!layoutContainerRef.current) return;

    function setCalculatedWidth() {
      if (!layoutContainerRef.current) return;
      setWidth(layoutContainerRef.current.offsetWidth);
    }

    window.addEventListener("resize", setCalculatedWidth);

    return () => {
      window.removeEventListener("resize", setCalculatedWidth);
    };
  }, []);

  return (
    <div ref={layoutContainerRef}>
      <Responsive
        width={width}
        className='layout'
        rowHeight={36}
        compactType={null}
        preventCollision={true}
        margin={[0, 0]}
        cols={{ lg: 24, md: 12, sm: 6, xs: 4, xxs: 2 }}>
        {items.map((item) => (
          <div
            className='cs-item border rounded-0 overflow-hidden p-1'
            key={item.id}
            data-grid={item.layout}>
            {item.type === "Label" && <div className='w-100 h-100 cs-text'>{item.label}</div>}
            {item.type === "LabelValue" && (
              <LabelValues rows={[{ label: item.label, value: item.value }]} />
            )}
            {item.type === "TextArea" && (
              <Form.Control
                as='textarea'
                className='w-100 h-100 textarea'
                value={item.value}
                spellCheck='false'
              />
            )}
          </div>
        ))}
      </Responsive>
    </div>
  );
}
