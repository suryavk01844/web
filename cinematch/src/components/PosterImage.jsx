import { useState } from 'react';
import { posterUrl } from '../config';
import { FilmIcon } from './Icons';

// Poster with a shimmer while loading and a styled fallback if there's no image.
// Render it with `key={movie.id}` so its loading state resets when the movie changes.
export default function PosterImage({ path, title, size = 'w342', className = '' }) {
  const [status, setStatus] = useState('loading');
  const src = posterUrl(path, size);

  if (!src || status === 'error') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-700 to-ink-900 p-4 text-center text-zinc-500 ${className}`}
        role="img"
        aria-label={`${title} – poster not available`}
      >
        <FilmIcon className="h-10 w-10" />
        <span className="line-clamp-3 text-xs font-medium">{title}</span>
      </div>
    );
  }

  return (
    <div className={`relative bg-ink-700 ${className}`}>
      {status === 'loading' && <div className="shimmer absolute inset-0" />}
      <img
        src={src}
        alt={`${title} poster`}
        loading="lazy"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
