import { Button, Form } from "react-bootstrap";
import { PlusSquare, DashSquare } from "react-bootstrap-icons";

export default function ZoomContols({ handleZoom, scale }) {
  return (
    <div className='d-flex align-items-end gap-1'>
      <Button variant='' className='p-0' onClick={() => handleZoom(scale - 0.125)}>
        <DashSquare />
      </Button>
      <Form.Range
        value={scale}
        onChange={(e) => handleZoom(e.target.value)}
        variant='secondary'
        min={0.5}
        max={2}
        step={0.125}
        style={{ width: "150px" }}
      />
      <Button variant='' className='p-0' onClick={() => handleZoom(scale + 0.125)}>
        <PlusSquare />
      </Button>
    </div>
  );
}
