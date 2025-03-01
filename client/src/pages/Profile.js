import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [allDocuments, setAllDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3001/fetchAllDocuments/all",
          { userId: user._id }
        );
        setAllDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  // Format date to human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#f9f9f9",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* User Profile Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            overflow: "hidden",
            marginRight: "24px",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#666",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          {user.pic ? (
            <img
              src={user.pic}
              alt={user.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Welcome, {user.name}!
          </h1>
          <p
            style={{
              margin: "0",
              color: "#666",
              fontSize: "14px",
            }}
          >
            {user.email}
          </p>
        </div>
      </div>

      {/* Create New Document Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: "0",
            fontSize: "20px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          My Documents
        </h2>
        <Link
          to={`/documents/${uuidV4()}`}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "10px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            style={{ marginRight: "8px", width: "16px", height: "16px" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          Create New Document
        </Link>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px",
            color: "#666",
          }}
        >
          Loading your documents...
        </div>
      ) : allDocuments.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {allDocuments.map((document) => (
            <Link
              key={document?._id}
              to={`/documents/${document?._id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  height: "160px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid #eee",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 2px 5px rgba(0,0,0,0.05)";
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <svg
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "10px",
                        color: "#4f46e5",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3
                      style={{
                        margin: "0",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#333",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {document?.title ? document.title : "Untitled Document"}
                    </h3>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    style={{
                      width: "14px",
                      height: "14px",
                      marginRight: "6px",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Last edited {formatDate(document?.updatedAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "40px",
            textAlign: "center",
            color: "#666",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <svg
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 16px",
              color: "#ddd",
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 style={{ marginBottom: "8px", fontWeight: "500" }}>
            No documents yet
          </h3>
          <p style={{ marginBottom: "24px" }}>
            Create your first document to get started
          </p>
          <Link
            to={`/documents/${uuidV4()}`}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "500",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <svg
              style={{ marginRight: "8px", width: "16px", height: "16px" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Create New Document
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
