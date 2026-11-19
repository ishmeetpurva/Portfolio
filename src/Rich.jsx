// Renders text where *word* becomes the Fraunces italic accent.
export function Rich({ text }) {
  const parts = String(text).split(/(\*[^*]+\*)/g);
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*') && p.length > 2 ? (
      <em className="accent" key={i}>{p.slice(1, -1)}</em>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
