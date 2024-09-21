import { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { forgotPassword, signIn, signUp } from "../supabaseClient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setInputPassword] = useState("");

  const [errorText, setErrorText] = useState();
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState("login");

  const handleSubmit = async (event) => {
    setErrorText(undefined);
    event.preventDefault();
    setLoading(true);
    await delay(500);

    try {
      switch (formMode) {
        case "login":
          await signIn(email, password);
          break;
        case "signup":
          await signUp(email, password);
          break;
        case "forgot":
          await forgotPassword(email);
          break;
        default:
      }
    } catch (error) {
      console.error(error);
      if (error.name === "AuthApiError") {
        setErrorText("Hibás email vagy jelszó.");
      } else {
        setErrorText(error.message);
      }
    }
    setLoading(false);
  };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const titleText = {
    login: "Bejelentkezés",
    signup: "Regisztráció",
    forgot: "Jelszó visszaállítása",
  };

  const buttonText = {
    login: "Bejelentkezés",
    signup: "Regisztráció",
    forgot: "Jelszó visszaállítása",
  };

  function changeMode(mode) {
    setErrorText(undefined);
    setFormMode(mode);
  }

  return (
    <Form
      className='shadow p-4 rounded'
      style={{ backgroundColor: "var(--bs-secondary-bg)" }}
      onSubmit={handleSubmit}>
      <div className='h4 mb-4 text-center'>{titleText[formMode]}</div>
      {errorText && (
        <Alert
          className='mb-2'
          variant='danger'
          onClose={() => setErrorText(undefined)}
          dismissible>
          {errorText}
        </Alert>
      )}
      <InputGroup className='mb-2'>
        <InputGroup.Text className='w-25'>Email</InputGroup.Text>
        <Form.Control
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </InputGroup>
      {["login", "signup"].includes(formMode) && (
        <InputGroup className='mb-2'>
          <InputGroup.Text className='w-25'>Jelszó</InputGroup.Text>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </InputGroup>
      )}
      <Button className='w-100' variant='primary' type='submit' disabled={loading}>
        {buttonText[formMode]}
      </Button>
      <div className='d-flex justify-content-between flex-row'>
        {formMode === "login" && (
          <Button className='text-muted px-0' variant='link' onClick={() => changeMode("signup")}>
            Regisztráció
          </Button>
        )}
        {formMode === "login" && (
          <Button className='text-muted px-0' variant='link' onClick={() => changeMode("forgot")}>
            Elfelejtett jelszó?
          </Button>
        )}
        {["signup", "forgot"].includes(formMode) && (
          <Button className='text-muted px-0' variant='link' onClick={() => changeMode("login")}>
            Vissza
          </Button>
        )}
      </div>
    </Form>
  );
}
