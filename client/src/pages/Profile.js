import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);
  return (
    <div>
      welcome {user?.name}
      <Link to={`/documents/${uuidV4()}`}>create an blank document</Link>
    </div>
  );
};

export default Profile;
