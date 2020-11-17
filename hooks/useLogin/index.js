import React, { useState, useEffect, useRef, useContext } from "react";
import { Session } from "@inrupt/solid-client-authn-browser";

import { Loader, Modal, Header, Icon, Container } from "semantic-ui-react";

// If your Pod is *not* on `inrupt.net`, change this to your identity provider.
const IDENTITY_PROVIDER = "https://inrupt.net";
const doLogin = async (session, clientName, oidcIssuer) => {
  if (
    !session.info.isLoggedIn &&
    !new URL(window.location.href).searchParams.get("code")
  ) {
    await session.login({
      oidcIssuer,
      clientName,
      redirectUrl: window.location.href,
    });
  }
};

// generally, you'll want to autologin so that your page is usable.
// wait for 'isLoggedIn' to be true.
const useLogin = ({
  autoLogin = true,
  idProvider = IDENTITY_PROVIDER,
  clientName = "inrupt-test-app",
} = {}) => {
  // new session ref to kick things off. hopefully one day this uses the refresh token.
  const sessionRef = useRef(new Session());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const sess = sessionRef.current;

  useEffect(async () => {
    if (autoLogin) {
      await doLogin(sess, clientName, idProvider);
      setIsLoggedIn(sess.info.isLoggedIn);
    }
    await sess.handleIncomingRedirect(window.location.href);
    setIsLoggedIn(sess.info.isLoggedIn);
    if (sess.info.isLoggedIn) {
      // parse url and fix the params.
      const { pathname, search } = window.location;
      const params = new URLSearchParams(search);
      params.delete("state");
      params.delete("code");

      console.log(pathname + "?" + params.toString());
      history.replaceState(null, null, pathname + "?" + params.toString());
    }
  }, [autoLogin]);

  return {
    doLogin: () => doLogin(sess, clientName, idProvider),
    isLoggedIn,
    session: sess,
  };
};

const LoginContext = React.createContext({});
export const useLoginContext = () => useContext(LoginContext);

export const LoginProvider = ({ children, options }) => {
  const ctx = useLogin(options);
  return <LoginContext.Provider value={ctx}>{children}</LoginContext.Provider>;
};

export const LoginBlocker = () => {
  const { isLoggedIn } = useLoginContext();
  return (
    <Modal basic open={!isLoggedIn} size="small">
      <Container textAlign="center">
        <Loader inline>
          <Icon name="lock" />
        </Loader>
        <Header style={{ color: "white" }}>Logging in...</Header>
      </Container>
    </Modal>
  );
};
