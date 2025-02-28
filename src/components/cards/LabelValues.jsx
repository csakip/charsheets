import { Col, Container, Form, Row } from "react-bootstrap";

export default function LabelValues({ item }) {
  return (
    <Container className='d-flex gap-1 flex-column'>
      {item.labels.map((label, idx) => (
        <Row key={idx}>
          <Col xs={8}>{label}</Col>
          <Col xs={4}>
            <Form.Control className='text-center' defaultValue={item.values[idx] ?? ""} />
          </Col>
        </Row>
      ))}
    </Container>
  );
}
