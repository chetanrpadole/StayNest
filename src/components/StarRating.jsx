const StarRating = ({ rating, onChange, interactive = true }) => {
  if (!interactive) {
    return (
      <div className="review-stars d-flex align-items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const starVal = i + 1;
          return (
            <i
              key={starVal}
              className={`fa-star ${starVal <= rating ? "fa-solid review-star-filled" : "fa-regular review-star-empty"}`}
              style={{ color: starVal <= rating ? "#f59e0b" : "#e0e0e0", fontSize: "0.9rem" }}
            ></i>
          );
        })}
        <span className="review-rating-text text-dark ms-2 fw-bold" style={{ fontSize: "0.85rem", background: "#fef3c7", padding: "2px 8px", borderRadius: "6px" }}>
          {rating}.0
        </span>
      </div>
    );
  }

  return (
    <fieldset className="star-rating-field d-inline-flex flex-row-reverse gap-1 border-0 p-0 m-0">
      {Array.from({ length: 5 }, (_, i) => {
        const starVal = 5 - i;
        const id = `star-${starVal}`;
        return (
          <div key={starVal} className="d-inline-block">
            <input
              type="radio"
              id={id}
              name="rating"
              value={starVal}
              checked={rating === starVal}
              onChange={() => onChange(starVal)}
              className="d-none"
            />
            <label
              htmlFor={id}
              title={`${starVal} star${starVal > 1 ? "s" : ""}`}
              style={{
                cursor: "pointer",
                fontSize: "1.6rem",
                color: rating >= starVal ? "#f59e0b" : "#d1d5db",
                transition: "color 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              <i className="fa-solid fa-star"></i>
            </label>
          </div>
        );
      })}
    </fieldset>
  );
};

export default StarRating;
