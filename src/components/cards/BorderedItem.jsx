import { Button } from "react-bootstrap";
import { ArrowBarRight } from "react-bootstrap-icons";

export default function BorderedItem({ item, children, className = "", ...props }) {
  const borders = item.borders || {};
  const styles = [];
  borders.top && (styles.borderTopWidth = `${borders.top}px`);
  borders.left && (styles.borderLeftWidth = `${borders.left}px`);
  borders.right && (styles.borderRightWidth = `${borders.right}px`);
  borders.bottom && (styles.borderBottomWidth = `${borders.bottom}px`);

  return (
    <div
      {...props}
      className={`d-flex flex-1 align-items-stretch ${className} overflow-auto small-scrollbars layout-box position-relative`}
      style={styles}>
      <Button
        className='position-absolute layout-button'
        style={{ top: "50%", right: 0, transform: "translateY(-50%)", width: 20, height: 30 }}
        size='sm'
        onClick={item.onRemove}>
        <ArrowBarRight />
      </Button>
      {children}
    </div>
  );
}
