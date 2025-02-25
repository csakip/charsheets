import { Col, Container, Form, Row } from "react-bootstrap";

export default function LabelValues({ rows }) {
  return rows.map((row, idx) => (
    <Container key={idx} className='flex-1 gap-0'>
      <Row>
        <Col xs={6}>{row.label}</Col>
        <Col xs={6}>
          <Form.Control className='text-center' defaultValue={row.value} />
        </Col>
      </Row>
    </Container>
  ));
}
