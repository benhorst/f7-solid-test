import { useState } from "react";
import { Segment, Button, Input, Header, Divider } from "semantic-ui-react";
import {
  getSolidDataset,
  getThing,
  setThing,
  getStringNoLocale,
  setStringNoLocale,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { VCARD } from "@inrupt/vocab-common-rdf";

import {
  LoginBlocker,
  LoginProvider,
  useLoginContext,
} from "../hooks/useLogin";

const Profile = ({ loggedIn, profile }) => {
  const { session } = useLoginContext();
  const { webId, isLoggedIn } = session?.info || {};

  const [webIdInput, setWebIdInput] = useState("");
  const [formattedName, setFormattedName] = useState("");

  const [nameInput, setNameInput] = useState("");

  const goGetProfile = async () => {
    setFormattedName("loading...");

    try {
      new URL(webIdInput);
    } catch (_) {
      setFormattedName("failed url");
      console.log(_);
      return false;
    }
    const myDataset = await getSolidDataset(webIdInput, {
      fetch: session.fetch,
    });

    const profile = getThing(myDataset, webIdInput);

    setFormattedName(getStringNoLocale(profile, VCARD.fn));
  };

  const saveName = async () => {
    // To write to a profile, you must be authenticated. That is the role of the fetch
    // parameter in the following call.
    let myProfileDataset = await getSolidDataset(webID, {
      fetch: session.fetch,
    });

    let profile = getThing(myProfileDataset, webID);

    // Using the name provided in text field, update the name in your profile.
    // VCARD.fn object is a convenience object that includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
    // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of VCARD.fn.
    profile = setStringNoLocale(profile, VCARD.fn, nameInput);

    // Write back the profile to the dataset.
    myProfileDataset = setThing(myProfileDataset, profile);

    // Write back the dataset to your Pod.
    await saveSolidDatasetAt(webID, myProfileDataset, {
      fetch: session.fetch,
    });
    // TODO: this sample code just kinda assumes success.
  };

  return (
    <Segment as="section" id="profile">
      <Header>
        {webId || "logging in..."} : {isLoggedIn + ""}
      </Header>
      <LoginBlocker />
      <label id="readlabel" for="webID">
        Read back name (anyone's!) from their WebID:
      </label>
      <br />
      <Input
        type="url"
        id="webID"
        name="webID"
        size="50"
        value={webIdInput}
        onChange={(ev) => setWebIdInput(ev.target.value)}
        placeholder="enter a webID as a full url"
        actionPosition="right"
      />
      <Button attached="right" onClick={goGetProfile}>
        Read Profile
      </Button>
      <Divider />
      <dl className="display">
        <dt>Formatted Name (FN) read from Pod:</dt>
        <strong>
          <span id="labelFN">{formattedName || "<no name provided>"}</span>
        </strong>
      </dl>
      <Divider />
      Set a new name for yourself (failing right now): <br />
      <Input
        type="text"
        value={nameInput}
        onChange={(ev) => setNameInput(ev.target.value)}
        actionPosition="right"
      />
      <Button attached="right" onClick={saveName}>
        Save
      </Button>
    </Segment>
  );
};

export const getServerSidePros = () => {
  return {
    props: {
      loggedIn: false,
      profile: null,
    },
  };
};

const ProfilePage = () => (
  <LoginProvider>
    <Profile />
  </LoginProvider>
);
export default ProfilePage;
