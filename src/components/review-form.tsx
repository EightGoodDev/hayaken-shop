"use client";

import { useEffect, useState } from "react";
import { addUserReview, loadUserReviews, type UserReview } from "@/lib/user-reviews";
import { isReviewHidden, loadHiddenReviews } from "@/lib/review-moderation";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function ReviewForm({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");

  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    setReviews(loadUserReviews(productId));
    setHidden(loadHiddenReviews());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "kounan_review_hidden_v1") setHidden(loadHiddenReviews());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [productId]);

  const visibleReviews = reviews.filter((r) => !isReviewHidden(hidden, productId, r));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const review: UserReview = {
      stars,
      title: title.trim(),
      body: body.trim(),
      author: author.trim() || "購入者",
      date: todayString(),
    };
    setReviews(addUserReview(productId, review));
    setTitle("");
    setBody("");
    setAuthor("");
    setStars(5);
    setOpen(false);
  }

  const shown = hover || stars;

  return (
    <div className="review-user">
      {ready && visibleReviews.length > 0 ? (
        <div className="review-list" style={{ marginTop: 0, marginBottom: 14 }}>
          {visibleReviews.map((r, i) => (
            <div className="review-item" key={i} style={{ borderColor: "var(--brand)" }}>
              <div className="review-item-head">
                <span className="stars" aria-hidden>
                  {"★".repeat(r.stars)}
                  {"☆".repeat(5 - r.stars)}
                </span>
                <b>{r.title}</b>
                <span className="pill" style={{ marginLeft: "auto" }}>
                  あなたの投稿
                </span>
              </div>
              <div className="review-meta">
                {r.author}　{r.date}
              </div>
              <p className="review-body">{r.body}</p>
            </div>
          ))}
        </div>
      ) : null}

      {open ? (
        <form className="co-card" onSubmit={submit} style={{ padding: 18 }}>
          <b style={{ fontSize: 15 }}>レビューを投稿</b>
          <div style={{ margin: "10px 0" }}>
            <span className="review-stars-input" aria-label="評価">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setStars(n)}
                  aria-label={`${n}つ星`}
                  className={n <= shown ? "on" : ""}
                >
                  ★
                </button>
              ))}
            </span>
          </div>
          <input
            className="review-input"
            placeholder="タイトル（例: 買ってよかった）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="review-input"
            placeholder="使ってみた感想をお書きください"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ resize: "vertical", marginTop: 8 }}
          />
          <input
            className="review-input"
            placeholder="ニックネーム（任意）"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ marginTop: 8 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "9px 20px", fontSize: 14 }}>
              投稿する
            </button>
            <button type="button" className="btn btn-ghost" style={{ padding: "9px 20px", fontSize: 14 }} onClick={() => setOpen(false)}>
              キャンセル
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, marginBottom: 0 }}>
            ※ デモのため、投稿はこの端末にのみ保存されます。
          </p>
        </form>
      ) : (
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(true)} style={{ padding: "10px 20px", fontSize: 14 }}>
          ✍️ レビューを書く
        </button>
      )}
    </div>
  );
}
