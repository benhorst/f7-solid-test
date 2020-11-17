import Head from "next/head";
import { Container, Segment } from "semantic-ui-react";

const Home = () => {
  return (
    <div className="page">
      <Head>
        <title>Solid Test Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="vertical-fill-box">
        <main className="flex-grow">
          <Segment attached="bottom">Test of some SOLID SDK</Segment>
          <br />

          <Segment>
            Right now /profile is the only page that really works.{" "}
            <a href="/profile">try it.</a>
          </Segment>
        </main>

        <footer>
          <Segment attached="top">footer. cool.</Segment>
        </footer>
      </Container>
    </div>
  );
};

export default Home;
