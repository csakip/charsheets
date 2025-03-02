import { Form } from "react-bootstrap";
import BorderedItem from "./cards/BorderedItem";
import LabelValues from "./cards/LabelValues";
import RichText from "./cards/RichText";

export default function Layout({ cell, items }) {
  switch (cell.type) {
    case "row":
      return (
        <BorderedItem item={cell} className='flex-row'>
          {cell.cells?.map((childCell, idx) => (
            <Layout key={idx} cell={childCell} items={items} />
          ))}
        </BorderedItem>
      );
    case "column":
      return (
        <BorderedItem item={cell} className='flex-column'>
          {cell.cells?.map((childCell, idx) => (
            <Layout key={idx} cell={childCell} items={items} />
          ))}
        </BorderedItem>
      );
    case "content": {
      const contentItem = items.find((item) => item.l === cell.id) ?? { type: "placeholder" };

      return (
        <BorderedItem
          key={cell.id}
          item={contentItem}
          className={`content-box ${contentItem.type === "markdown" ? "rich-text" : ""} m-1`}>
          {contentItem.type === "label" && (
            <div className='cs-text h-100 w-100'>{contentItem.label}</div>
          )}
          {contentItem.type === "labelvalue" && <LabelValues item={contentItem} />}
          {contentItem.type === "textarea" && (
            <Form.Control
              as='textarea'
              className='w-100 h-100 textarea'
              value={contentItem.value}
              spellCheck='false'
              onChange={(e) => {
                contentItem.value = e.target.value;
              }}
            />
          )}
          {contentItem.type === "markdown" && <RichText content={contentItem.value} />}
          {contentItem.type === "placeholder" && <div className='flex-1 placeholder-box'></div>}
        </BorderedItem>
      );
    }
  }

  return <></>;
}
