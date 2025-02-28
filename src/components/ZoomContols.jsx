import { Button, Form } from "react-bootstrap";
import { Arrows, ArrowsVertical, ZoomIn, ZoomOut } from "react-bootstrap-icons";

export default function ZoomContols({ handleZoom, scale, zoomToFullWidth, zoomToFullHeight }) {
  return (
    <div className='d-flex align-items-center gap-1'>
      <Button variant='' className='icon-button' onClick={zoomToFullWidth}>
        <Arrows />
      </Button>
      <Button variant='' className='icon-button' onClick={zoomToFullHeight}>
        <ArrowsVertical />
      </Button>
      <Button variant='' className='icon-button' onClick={() => handleZoom(scale - 0.125)}>
        <ZoomOut />
      </Button>
      <Form.Range
        value={scale}
        onChange={(e) => handleZoom(e.target.value)}
        variant='secondary'
        min={0.5}
        max={1.5}
        step={0.125}
        style={{ width: "150px" }}
      />
      <Button variant='' className='icon-button' onClick={() => handleZoom(scale + 0.125)}>
        <ZoomIn />
      </Button>
    </div>
  );
}
