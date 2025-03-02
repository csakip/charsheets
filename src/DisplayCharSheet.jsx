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
          id: "dadsadw3ff",
          size: 1,
          borders: { top: 2, left: 2, right: 2, bottom: 2 },
        },
        { type: "content", id: "dwqddcxc", size: 2 },
        { type: "content", id: "kdj732fd7", size: 3 },
        {
          type: "column",
          cells: [
            { type: "content", id: "3g34g3g21", size: 1 },
            { type: "content", id: "dfg34t", size: 1 },
          ],
        },
      ],
    },
    { type: "content", id: "y65hyfhfgh", size: 3 },
    { type: "content", id: "asdsadw", size: 3 },
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
      type: "labelvalue",
      l: "dadsadw3ff",
      labels: [
        "Item 1",
        "Item 2",
        "Item 3",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      values: ["3K", null, "5K"],
    },
    {
      type: "label",
      l: "kdj732fd7",
      label: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      type: "markdown",
      l: "3g34g3g21",
      value: "2Lorem ipsum dolor sit amet consecteas dsa dsa dsa dsa ds dtur",
    },
    {
      type: "textarea",
      l: "dfg34t",
      value: "3Lorem ipsum dolor sit amet consectetur",
    },
    {
      type: "lLabel",
      l: "y65hyfhfgh",
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
