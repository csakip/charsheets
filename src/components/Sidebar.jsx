import { Col, ListGroup, Row } from "react-bootstrap";
import { signOut } from "../supabaseClient";

export default function Sidebar() {
  return (
    <Row>
      <Col>
        <h3>CharSheets</h3>
        <ListGroup>
          <ListGroup.Item action onClick={signOut}>
            Logout
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
}
