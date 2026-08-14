import { useFlash } from "../context/FlashContext";

const FlashMessage = () => {
  const { message, clearMessage } = useFlash();

  if (!message) return null;

  const isSuccess = message.type === "success";

  return (
    <div
      className={`alert alert-dismissible fade show col-md-8 offset-md-2 mt-3 custom-alert ${
        isSuccess ? "alert-success" : "alert-danger"
      }`}
      role="alert"
      style={{
        border: "none",
        borderRadius: "16px",
        padding: "16px 24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        background: isSuccess
          ? "linear-gradient(135deg, rgba(236, 253, 245, 0.95), rgba(209, 250, 229, 0.95))"
          : "linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(254, 226, 226, 0.95))",
        borderLeft: isSuccess ? "5px solid #10b981" : "5px solid #f43f5e",
        color: isSuccess ? "#065f46" : "#991b1b",
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <i
          className={`fa-solid ${
            isSuccess ? "fa-circle-check" : "fa-circle-exclamation"
          } fs-5`}
          style={{ color: isSuccess ? "#10b981" : "#f43f5e" }}
        ></i>
        <div className="alert-message fw-semibold" style={{ fontSize: "0.95rem", letterSpacing: "-0.2px" }}>
          {message.text}
        </div>
      </div>
      <button
        type="button"
        className="btn-close"
        onClick={clearMessage}
        aria-label="Close"
        style={{ padding: "20px", boxShadow: "none" }}
      ></button>
    </div>
  );
};

export default FlashMessage;
