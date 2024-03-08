export default function NumResults({ movies }) {
  return (
    <p className="num-results">
      Showing <strong>{movies.length}</strong> results
    </p>
  );
}
