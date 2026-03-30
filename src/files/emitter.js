export const runEmitter = (events, callback) => {
  let i = 0;

  const interval = setInterval(() => {
    if (i >= events.length) {
      clearInterval(interval);
      return;
    }

    callback(events[i]);
    i++;
  }, 1200); // slower = more realistic
};