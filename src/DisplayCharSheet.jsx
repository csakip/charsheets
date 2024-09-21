import { useEffect, useState } from "react";
import CharSheetStack from "./components/CharSheetStack";
import { Button, Col, Container, Row } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import { supabase } from "./supabaseClient";

export default function DisplayCharSheet() {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("character_sheets").select("*");
      if (error) console.error("Error fetching sheets:", error);
      else setSheets(data);
    };
    fetchData();
  }, []);

  const defaultLayout = {
    x: 0,
    y: 0,
    w: 2,
    h: 2,
  };
  const [items, setItems] = useState([
    { type: "LabelValue", id: "item-1", label: "Item 1", value: "3K", layout: defaultLayout },
    {
      type: "Label",
      id: "item-2",
      label: "Lorem ipsum dolor sit amet consectetur",
      layout: defaultLayout,
    },
  ]);

  function addItem() {
    setItems([
      ...items,
      {
        id: `item-${items.length + 1}`,
        label: "Item " + (items.length + 1),
        layout: defaultLayout,
        type: "TextArea",
      },
    ]);
  }

  return (
    <Container fluid className='cs py-3'>
      <Row>
        <Col xs={2}>
          <Sidebar />
        </Col>
        <Col>
          <Row>
            <Col>
              <Button onClick={addItem}>Add new widget</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {sheets?.forEach((sheet) => (
                <div>{sheet.name}</div>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <CharSheetStack items={items} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
