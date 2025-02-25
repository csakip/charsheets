import { useState } from "react";
import CharSheetView from "./components/CharSheetView";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
// import { supabase } from "./supabaseClient";
// import { useSimpleDialog } from "./components/SimpleDialog";

const layout = {
  type: "column",
  cells: [
    {
      type: "row",
      cells: [
        {
          type: "content",
          id: "9287398274987329847983274987",
          size: 1,
          borders: { top: 2, left: 2, right: 2, bottom: 2 },
        },
        { type: "content", id: "kdj78ad8768ad87sa7", size: 2 },
        { type: "content", id: "kdj732fd7", size: 3 },
        {
          type: "column",
          cells: [
            { type: "content", id: "321", size: 1 },
            { type: "content", id: "434321", size: 1 },
          ],
        },
      ],
    },
    { type: "content", id: "kdj78ad8768ad87sa7", size: 3 },
    { type: "content", id: "kdj78ad8768ad87sa7", size: 3 },
  ],
};

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

  const [items] = useState([
    {
      type: "LabelValue",
      id: "9287398274987329847983274987",
      label: "Item 1",
      value: "3K",
    },
    {
      type: "Label",
      id: "kdj78ad8768ad87sa7",
      label: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      type: "Markdown",
      id: "kdj732fd7",
      value: "2Lorem ipsum dolor sit amet consecteas dsa dsa dsa dsa ds dtur",
    },
    {
      type: "Textarea",
      id: "321",
      value: "3Lorem ipsum dolor sit amet consectetur",
    },
    {
      type: "Label",
      id: "434321",
      label: "4Lorem ipsum dolor sit amet consectetur",
    },
  ]);

  return (
    <Container fluid className='cs py-0 d-flex pb-0 pe-0 ps-0'>
      <Row className='d-flex flex-row flex-1'>
        <Col xs='auto' className='pe-0'>
          <Sidebar />
        </Col>
        <Col className='d-flex flex-column'>
          <Row className='flex-1'>
            <Col className='d-flex flex-1 flex-column ps-0'>
              <CharSheetView layout={layout} items={items} />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <SimpleDialog /> */}
    </Container>
  );
}
