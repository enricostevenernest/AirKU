export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-top"></div>

      <div className="skeleton-content">
        <div className="skeleton-pill"></div>

        <div className="skeleton-title"></div>
        <div className="skeleton-title short"></div>

        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );
}