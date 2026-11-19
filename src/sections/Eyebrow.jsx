export default function Eyebrow({ num, children, dot }) {
  return (
    <p className="eyebrow">
      {dot && <span className="dot" />}
      {num && <><span className="num">{num}</span><span className="slash">/</span></>}
      <span>{children}</span>
    </p>
  );
}
