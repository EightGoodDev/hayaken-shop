export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const full = Math.round(rating);
  return (
    <span className="rating">
      <span className="stars" aria-hidden>
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
      <span>
        {rating.toFixed(1)}
        {reviews !== undefined ? `（${reviews.toLocaleString("ja-JP")}）` : null}
      </span>
    </span>
  );
}
