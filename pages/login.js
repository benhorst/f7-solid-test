import { useState, useEffect, useRef } from "react";
import { Segment, Form, Button, Checkbox, Label } from "semantic-ui-react";

import { Session } from "@inrupt/solid-client-authn-browser";

import { VCARD } from "@inrupt/vocab-common-rdf";

// If your Pod is *not* on `inrupt.net`, change this to your identity provider.
const IDENTITY_PROVIDER = "https://inrupt.net";

const Login = ({ loggedIn, profile }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sessionRef = useRef(new Session());

  useEffect(async () => {
    const session = sessionRef.current;
    window.session = session;
    console.log("login effect", sessionRef.current);
    setIsLoggedIn(session.info.isLoggedIn);
    // a noop if already logged in
    await session.handleIncomingRedirect(window.location.href);

    console.log("after session incoming redirect effect", sessionRef.current);
    setIsLoggedIn(session.info.isLoggedIn);
    return null;
  }, []);

  const doLogin = async () => {
    if (
      !isLoggedIn &&
      !new URL(window.location.href).searchParams.get("code")
    ) {
      await sessionRef.current.login({
        oidcIssuer: "https://inrupt.net",
        clientName: "inrupt-test-app",
        redirectUrl: window.location.href,
      });
      console.log("after session login await effect", sessionRef.current);
      setIsLoggedIn(sessionRef.current.info.isLoggedIn);
      if (isLoggedIn) {
        // redirect?
      }
    }
  };

  return (
    <Segment as="section" id="login">
      <Form onSubmit={doLogin}>
        <Form.Field>
          <label>identity provider: </label>
          <Label>{IDENTITY_PROVIDER}</Label>
        </Form.Field>

        <Form.Field>
          <label>webid:</label>
          <Label>{sessionRef.current.info?.webId}</Label>
          <code>{JSON.stringify(sessionRef.current.info, null, 2)}</code>
        </Form.Field>
        <Button disabled={isLoggedIn} type="submit">
          Login
        </Button>
        <Button
          disabled={!isLoggedIn}
          onClick={() => sessionRef.current.logout()}
        >
          Log Out
        </Button>
      </Form>
    </Segment>
  );
};

// server-side is disabled with this sdk
export const getServerSidePros = () => {
  return {
    props: {
      loggedIn: false,
      profile: null,
    },
  };
};

export default Login;
