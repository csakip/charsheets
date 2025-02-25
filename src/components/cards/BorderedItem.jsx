import { forwardRef } from "react";

export default forwardRef(function BorderedItem({ item, children, className = "", ...props }, ref) {
  const borders = item.borders || {};
  const styles = [];
  borders.top && (styles.borderTopWidth = `${borders.top}px`);
  borders.left && (styles.borderLeftWidth = `${borders.left}px`);
  borders.right && (styles.borderRightWidth = `${borders.right}px`);
  borders.bottom && (styles.borderBottomWidth = `${borders.bottom}px`);

  return (
    <div
      ref={ref}
      {...props}
      className={`d-flex flex-1 align-items-stretch ${className} overflow-auto small-scrollbars`}
      style={styles}>
      {children}
    </div>
  );
});
