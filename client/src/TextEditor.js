import React, { useCallback, useEffect, useState, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { UserContext } from "./context/UserContext";

// Constants
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
  // Get document ID from URL parameters
  const { id: documentId } = useParams();

  // Get current user from context
  const { user } = useContext(UserContext);

  // State variables
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [allJoinedUsers, setAllJoinedUsers] = useState([]);
  const [newJoinedUser, setNewJoinedUser] = useState(null);
  const [showJoinNotification, setShowJoinNotification] = useState(false);

  // Step 1: Connect to socket server when component mounts
  useEffect(() => {
    // Create socket connection
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Clean up socket connection when component unmounts
    return () => newSocket.disconnect();
  }, []);

  // Step 2: Set up Quill editor with a callback ref
  const editorRef = useCallback((container) => {
    if (!container) return;

    // Clear container and create editor
    container.innerHTML = "";
    const editor = document.createElement("div");
    container.append(editor);

    // Initialize Quill editor
    const quillEditor = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    // Disable editor until document loads
    quillEditor.disable();
    quillEditor.setText("Loading....");

    // Save editor instance to state
    setQuill(quillEditor);
  }, []);

  // Step 3: Load document and handle user joins
  useEffect(() => {
    if (!socket || !quill) return;

    // Handle document load
    socket.once("load-document", (document) => {
      quill.setContents(document.data);
      setCurrentDocument(document);
      quill.enable();
    });

    // Handle when other users join
    socket.on("user-joined", (user) => {
      setShowJoinNotification(true);
      setNewJoinedUser(user);
      setAllJoinedUsers((existing) =>
        existing.some((u) => u._id === user._id)
          ? existing
          : [user, ...existing]
      );

      // Hide notification after 5 seconds
      setTimeout(() => setShowJoinNotification(false), 5000);
    });

    // Request document data from server
    socket.emit("get-document", {
      documentId,
      userId: user._id,
      user,
    });

    // Cleanup event listeners on unmount
    return () => {
      socket.off("user-joined");
    };
  }, [socket, quill, documentId, user]);

  // Step 4: Save document at regular intervals
  useEffect(() => {
    if (!socket || !quill) return;

    // Set up automatic saving
    const saveInterval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    // Clean up interval on unmount
    return () => clearInterval(saveInterval);
  }, [socket, quill]);

  // Step 5: Send changes when user edits document
  useEffect(() => {
    if (!socket || !quill) return;

    // Function to handle text changes
    const handleTextChange = (delta, oldDelta, source) => {
      // Only send changes made by the user (not programmatic changes)
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    // Listen for text changes
    quill.on("text-change", handleTextChange);

    // Clean up listener on unmount
    return () => quill.off("text-change", handleTextChange);
  }, [socket, quill]);

  // Step 6: Receive changes from other users
  useEffect(() => {
    if (!socket || !quill) return;

    // Function to handle incoming changes
    const handleIncomingChanges = (delta) => {
      quill.updateContents(delta);
    };

    // Listen for changes from server
    socket.on("receive-changes", handleIncomingChanges);

    // Clean up listener on unmount
    return () => socket.off("receive-changes", handleIncomingChanges);
  }, [socket, quill]);

  return (
    <div className="google-docs-container">
      {/* Document header */}
      <div className="header">
        <div className="document-info">
          <div className="document-name">
            {currentDocument?.title || "Untitled document"}
          </div>
          <div className="document-status">
            <span className="save-status">Saved</span>

            <button
              className="share-button modal-you"
              onClick={() =>
                (document.getElementById("shareModal").style.display = "flex")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Simple collaborators display */}
        <div className="collaborators">
          {/* Show document owner */}
          {currentDocument?.owner && (
            <div
              className="avatar owner-avatar"
              key={currentDocument.owner._id}
            >
              {currentDocument.owner.pic ? (
                <img
                  src={currentDocument.owner.pic}
                  alt={currentDocument.owner.name}
                  className="avatar-image"
                />
              ) : (
                <span>{currentDocument.owner.name.slice(0, 2)}</span>
              )}
              {currentDocument?.owner._id === user._id ? (
                <span className="owner-badge">Owner:You</span>
              ) : (
                <span className="owner-badge">
                  {`Owner: ${currentDocument?.owner?.name
                    .slice(0, 2)
                    .toUpperCase()}`}
                </span>
              )}
            </div>
          )}

          {/* Show other users */}
          {allJoinedUsers.map((collaborator) => {
            // Skip if this user is the owner (to avoid duplicates)
            if (
              currentDocument?.owner &&
              collaborator._id === currentDocument.owner._id
            ) {
              return null;
            }

            return (
              <div className="avatar" key={collaborator._id}>
                {collaborator.pic ? (
                  <img
                    src={collaborator.pic}
                    alt={collaborator.name}
                    className="avatar-image"
                  />
                ) : (
                  <span>{collaborator.name.slice(0, 2)}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple notification when users join */}
      {showJoinNotification && newJoinedUser && (
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
                {newJoinedUser.name.charAt(0)}
              </span>
            )}
            <span>{newJoinedUser.name} joined the document</span>
          </div>
        </div>
      )}

      {/* Quill editor container */}
      <div className="editor-container" ref={editorRef}></div>

      <div id="shareModal" className="modal-you modal-overlay">
        <div className="modal-you modal-content">
          <div className="modal-you modal-header">
            <h3>Share document</h3>
            <button
              className="modal-you close-button"
              onClick={() =>
                (document.getElementById("shareModal").style.display = "none")
              }
            >
              &times;
            </button>
          </div>
          <div className="modal-you modal-body">
            <p>
              To collaborate in real-time with others, share this link with them and ask them to paste it into their browser's search bar. If they are already logged in, they will be automatically redirected to your shared document. If not, they will be prompted to log in first, after which they will be redirected. Once they access the document, you will be able to see all changes made by them or any other collaborators in real time.
            </p>
            <div className="modal-you share-link-container">
              <input
                type="text"
                className="modal-you share-link"
                value={window.location.href}
                readOnly
              />
              <button
                className="modal-you copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
