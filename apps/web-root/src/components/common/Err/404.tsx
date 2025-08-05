
import image_404 from "@public/media/404.svg";

export default function ErrNotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="text-center container">
        <img
          src={image_404}
          alt="404 illustration"
          className="mx-auto mb-4 mb-md-5 img-fluid"
          style={{ maxWidth: "500px", width: "100%" }}
        />

        <h1 className="fw-bold mb-2 mb-md-3 fs-2 fs-md-1">Page Missing!</h1>

        <p className="text-secondary mb-4 fs-5 fs-md-4 px-2">
          Page not found. Please check again!
        </p>

        <button onClick={() => window.history.back()} className="px-4 py-2">
          Go Back
        </button>
      </div>
    </div>
  );
}
