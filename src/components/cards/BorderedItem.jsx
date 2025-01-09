import { forwardRef } from "react";

export default forwardRef(function BorderedItem({ item, className, children, ...props }, ref) {
  const borderWidth = 2;
  const margins = `m-1`;
  const borders = item.borders || {};
  const borderTop = borders.top ? `border-top border-top-${borderWidth}` : "";
  const borderBottom = borders.bottom ? `border-bottom border-${borderWidth}` : "";
  const borderLeft = borders.left ? `border-start border-${borderWidth}` : "";
  const borderRight = borders.right ? `border-end border-${borderWidth}` : "";
  const borderColor = item.borderColor || "border-color";

  // const borderBottom = `border-bottom border-${borderWidth}`;
  // const borderLeft = `border-start border-${borderWidth}`;
  // const borderRight = `border-end border-${borderWidth}`;

  const cssClasses = [
    className || "",
    borderTop,
    borderBottom,
    borderLeft,
    borderRight,
    borderColor,
  ].join(" ");

  return (
    <div ref={ref} {...props} className={`d-flex overflow-hidden`}>
      <div className={`d-flex flex-grow-1 ${cssClasses} ${margins}`}>
        <div className={`p-1 flex-grow-1`}>{children}</div>
      </div>
    </div>
  );
});
