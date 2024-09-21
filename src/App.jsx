import LoginForm from "./components/LoginForm";
import DisplayCharSheet from "./DisplayCharSheet";
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return !session ? (
    <Container>
      <Row>
        <Col lg={{ span: 4, offset: 4 }} className='mt-5'>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  ) : (
    <DisplayCharSheet />
  );
}

export default App;
