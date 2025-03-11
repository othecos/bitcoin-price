export const LoadingState = ({ isSquare }: { isSquare?: boolean }) => (
  <div className="animate-pulse" data-testid="loading-state">
    <div
      className="bg-gray-200 rounded w-64"
      style={{ height: isSquare ? "64px" : "8px" }}
    ></div>
  </div>
);
