import { useEffect, useState } from "react";
import CharSheetView from "./components/CharSheetView";
import { Button, Col, Container, Row } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
// import { supabase } from "./supabaseClient";
// import { useSimpleDialog } from "./components/SimpleDialog";

export default function DisplayCharSheet() {
  // const [sheets, setSheets] = useState([]);
  // const { openModal, closeModal, SimpleDialog } = useSimpleDialog();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data, error } = await supabase.from("character_sheets").select("*");
  //     if (error) console.error("Error fetching sheets:", error);
  //     else setSheets(data);
  //   };
  //   fetchData();
  // }, []);

  const defaultLayout = {
    x: 0,
    y: 0,
    w: 2,
    h: 2,
  };
  const [items, setItems] = useState([
    {
      type: "LabelValue",
      id: "item-1",
      label: "Item 1",
      value: "3K",
      layout: defaultLayout,
      borders: { top: "3", left: "3" },
    },
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
    <Container fluid className='cs py-3 d-flex pb-0'>
      <Row className='d-flex flex-row flex-fill'>
        <Col xs='auto' className='pe-0'>
          <Sidebar />
        </Col>
        <Col className='d-flex flex-column'>
          <Row>
            <Col>
              <Button onClick={addItem}>Add new widget</Button>
            </Col>
          </Row>
          <Row className='flex-fill'>
            <Col className='d-flex flex-fill flex-column'>
              <CharSheetView items={items} />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <SimpleDialog /> */}
    </Container>
  );
}
