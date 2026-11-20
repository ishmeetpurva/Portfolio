/** Builds the dots in a Web Worker, falling back to the main thread if the worker fails. */
export function makeDots(buffer) {
  return new Promise((resolve, reject) => {
    let worker;
    const fallback = async () => {
      worker?.terminate();
      try {
        const { parseModel, buildDots } = await import('./dotsMain.js');
        resolve(buildDots(await parseModel(buffer)));
      } catch (e) { reject(e); }
    };
    try {
      worker = new Worker(new URL('./dotsWorker.js', import.meta.url), { type: 'module' });
    } catch { fallback(); return; }
    worker.onmessage = ({ data }) => {
      worker.terminate();
      if (data.dots) resolve(data.dots); else fallback();
    };
    worker.onerror = (e) => { e.preventDefault?.(); fallback(); };
    // Sent as a copy (no transfer list), so the fallback can still use `buffer`.
    worker.postMessage(buffer);
  });
}
