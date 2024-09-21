import { Col, Form, Row } from "react-bootstrap";

export default function LabelValues({ rows }) {
  return rows.map((row, idx) => (
    <Row key={idx}>
      <Col xs={6}>{row.label}</Col>
      <Col xs={6}>
        <Form.Control className='text-center' defaultValue={row.value} />
      </Col>
    </Row>
  ));
}
