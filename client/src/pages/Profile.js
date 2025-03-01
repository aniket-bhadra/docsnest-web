import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const Profile = () => {
  return (
    <div>
      Profile
      <Link to={`/documents/${uuidV4()}`}>create an blank document</Link>
    </div>
  );
};

export default Profile;
