import type { Product } from "@/lib/catalog";
import { generateReviewList, ratingDistribution } from "@/lib/reviews";
import { ReviewForm } from "./review-form";

export function Reviews({ product, bare = false }: { product: Product; bare?: boolean }) {
  const reviews = generateReviewList(product, 4);
  const dist = ratingDistribution(product); // [★5..★1]
  const maxCount = Math.max(...dist, 1);

  const Wrapper = bare ? "div" : "section";

  return (
    <Wrapper className={bare ? "" : "section"} id="reviews">
      {bare ? null : (
        <div className="section-head">
          <h2>カスタマーレビュー</h2>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <ReviewForm productId={product.id} />
      </div>

      <div className="review-summary">
        <div className="review-score">
          <b>{product.rating.toFixed(1)}</b>
          <span className="stars" aria-hidden>
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{product.reviews.toLocaleString("ja-JP")}件の評価</span>
        </div>
        <div className="review-bars">
          {dist.map((count, i) => {
            const star = 5 - i;
            return (
              <div className="review-bar-row" key={star}>
                <span className="review-bar-label">★{star}</span>
                <span className="review-bar-track">
                  <span className="review-bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                </span>
                <span className="review-bar-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="review-list">
        {reviews.map((r, i) => (
          <div className="review-item" key={i}>
            <div className="review-item-head">
              <span className="stars" aria-hidden>
                {"★".repeat(r.stars)}
                {"☆".repeat(5 - r.stars)}
              </span>
              <b>{r.title}</b>
            </div>
            <div className="review-meta">
              {r.author}　{r.date}
            </div>
            <p className="review-body">{r.body}</p>
            <div className="review-helpful">👍 参考になった（{r.helpful}）</div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
