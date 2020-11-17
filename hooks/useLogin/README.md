# Typical Usage

```

const ChildComponent = () => {
  const { session } = useLoginContext();
  const { webId, isLoggedIn } = session?.info || {};

  return (/* componentry */);
}

const ParentComponent = () => {

  return (
    <LoginProvider>
      <ChildComponent />
    </LoginProvider>
  )
}
```

Then you can note the user's webId as an identifier.
You can use isLogged in to understand if you have an authenticated context.

This hook+context will autologin, that is, generate a session for your single page app. It will also clear the params out of the url after it is done.

# No auto-login

If you'd like to disable auto-login and do it yourself, you can supply that option to the Provider.

```
const ChildComponent = () => {
  const { session, doLogin } = useLoginContext();
  const { webId, isLoggedIn } = session?.info || {};

  return (
    <>
    ...
      <Button onClick={doLogin}>Log me in</Button>
    </>
  );
}

const ParentComponent = () => {

  return (
    <LoginProvider options={{ autoLogin: false }}>
      <ChildComponent />
    </LoginProvider>
  )
}
```

the button will trigger the initial flow. the user will remain logged out until that `doLogin` function is called.

# All Provider Options

```
  autoLogin = true,
  idProvider = "https://inrupt.net",
  clientName = "inrupt-test-app",
```

you can override these options by passing them as a property to the provider. Please do not change them at runtime in a dynamic fashion.

# Session listeners

If you really must, you may subscribe to `session.onLogin` and `session.onLogout` per the docs https://github.com/inrupt/solid-client-authn-js
