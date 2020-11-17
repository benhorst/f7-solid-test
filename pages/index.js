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
          <Segment attached="bottom">Header</Segment>
          <br />

          <Segment>Some placeholder.</Segment>
        </main>

        <footer>
          <Segment attached="top">footer.</Segment>
        </footer>
      </Container>
    </div>
  );
};

export default Home;
