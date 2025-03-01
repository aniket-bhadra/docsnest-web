import React, { useCallback, useEffect, useState, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { UserContext } from "./context/UserContext";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [isOtherUserJoined, setIsOtherUserJoined] = useState(false);
  const [allJoinedUser, setAllJoinedUser] = useState([]);
  const [newJoinedUser, setNewJoinedUser] = useState();
  const [currentDocument, setCurrentDocument] = useState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isOtherUserJoined) {
      const timer = setTimeout(() => setIsOtherUserJoined(false), 5000);
      return () => clearTimeout(timer); // Cleanup in case `userJoined` changes before timeout finishes
    }
  }, [isOtherUserJoined]);

  useEffect(() => {
    if (!socket || !quill) return;
    //since in this case we've to listen this event once,this is why here `once` used,this will automatically cleanup the event after it gets listened to once
    socket.once("load-document", (document) => {
      quill.setContents(document.data);
      setCurrentDocument(document);
      quill.enable();
    });
    socket.on("user-joined", (user) => {
      setIsOtherUserJoined(true);
      setNewJoinedUser(user);
      setAllJoinedUser((existingUsers) => [user, ...existingUsers]);
    });
    socket.emit("get-document", {
      documentId,
      userId: user._id,
      user,
    });
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      //we only ever want to track the changes that user makes, not through api
      if (source !== "user") return;

      //delta--is just the thing that is changing,its not the whole doucment its just a small subset of what is changing in the doucment
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    //with each socket, quill changes this clears the prevuos listenr and then add new listenr to avoid any unexpected eorr or multple same event lsitner attached
    return () => {
      //remove this event listener if we no longer need it
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta) => {
      //on our code it actually make it actually do those changes, basically updating our document to have the changes that are being passed  from our other client
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      //remove this event listener if we no longer need it
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    q.disable();
    q.setText("Loading....");
    setQuill(q);
  }, []);

  // Helper function to render user avatar - now using profile picture if available
  const renderUserAvatar = (userData, isOwner = false) => {
    return (
      <div
        className={`avatar ${isOwner ? "owner-avatar" : ""}`}
        key={userData._id}
      >
        {userData.pic ? (
          <img
            src={userData.pic}
            alt={userData.name}
            className="avatar-image"
          />
        ) : (
          <span>{userData.name.slice(0, 2)}</span>
        )}
        {isOwner && <span className="owner-badge">Owner</span>}
      </div>
    );
  };

  return (
    <div className="google-docs-container">
      <div className="header">
        <div className="document-info">
          <div className="document-name">
            {currentDocument?.title || "Untitled document"}
          </div>
          <div className="document-status">
            <span className="save-status">Saved</span>
          </div>
        </div>

        <div className="collaborators">
          {currentDocument?.owner &&
            renderUserAvatar(currentDocument.owner, true)}

          {allJoinedUser
            .filter(
              (collaborator) =>
                !currentDocument?.owner ||
                collaborator._id !== currentDocument.owner._id
            )
            .map((collaborator) => renderUserAvatar(collaborator))}
        </div>
      </div>

      {isOtherUserJoined && (
        <div className="notification-banner">
          <div className="joined-user-notification">
            {newJoinedUser.pic ? (
              <img
                src={newJoinedUser.pic}
                alt=""
                className="notification-avatar"
              />
            ) : (
              <span className="notification-initial">
                {newJoinedUser.name.slice(0, 1)}
              </span>
            )}
            <span>{newJoinedUser.name} joined the document</span>
          </div>
        </div>
      )}

      <div className="editor-container" ref={wrapperRef}></div>
    </div>
  );
};

export default TextEditor;
