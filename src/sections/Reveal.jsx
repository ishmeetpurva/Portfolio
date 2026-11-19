import { useReveal } from '../hooks.js';

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
