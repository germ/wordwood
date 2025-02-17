let lastTime = 0;
let request;
let cancel;
function init(window) {
    request = window.requestAnimationFrame;
    cancel = window.cancelAnimationFrame;
    if (!request) {
        const vendors = ['ms', 'moz', 'webkit', 'o'];
        for (const vendor of vendors) {
            request = window[`${vendor}RequestAnimationFrame`];
            cancel = window[`${vendor}CancelAnimationFrame`] || window[`${vendor}CancelRequestAnimationFrame`];
        }
    }
    if (!request) {
        request = (callback) => {
            const currTime = Date.now();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            // eslint-disable-next-line standard/no-callback-literal
            const token = setTimeout(() => { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return token;
        };
        cancel = (token) => clearTimeout(token);
    }
}
export default {
    request: (callback) => request(callback),
    cancel: (token) => cancel(token),
    init,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmFmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQTtBQUNoQixJQUFJLE9BQU8sQ0FBQTtBQUNYLElBQUksTUFBTSxDQUFBO0FBRVYsU0FBUyxJQUFJLENBQUUsTUFBTTtJQUNuQixPQUFPLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFBO0lBQ3RDLE1BQU0sR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUE7SUFFcEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNaLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFFNUMsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDNUIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sdUJBQXVCLENBQUMsQ0FBQTtZQUNsRCxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLE1BQU0sNkJBQTZCLENBQUMsQ0FBQTtTQUNuRztLQUNGO0lBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3JCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtZQUMzQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQTtZQUMxRCx3REFBd0Q7WUFDeEQsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUEsQ0FBQyxDQUFDLEVBQ2hFLFVBQVUsQ0FBQyxDQUFBO1lBRWIsUUFBUSxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUE7WUFDaEMsT0FBTyxLQUFLLENBQUE7UUFDZCxDQUFDLENBQUE7UUFFRCxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUN4QztBQUNILENBQUM7QUFFRCxlQUFlO0lBQ2IsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ3hDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNoQyxJQUFJO0NBQ0wsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImxldCBsYXN0VGltZSA9IDBcbmxldCByZXF1ZXN0XG5sZXQgY2FuY2VsXG5cbmZ1bmN0aW9uIGluaXQgKHdpbmRvdykge1xuICByZXF1ZXN0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICBjYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWVcblxuICBpZiAoIXJlcXVlc3QpIHtcbiAgICBjb25zdCB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXVxuXG4gICAgZm9yIChjb25zdCB2ZW5kb3Igb2YgdmVuZG9ycykge1xuICAgICAgcmVxdWVzdCA9IHdpbmRvd1tgJHt2ZW5kb3J9UmVxdWVzdEFuaW1hdGlvbkZyYW1lYF1cbiAgICAgIGNhbmNlbCA9IHdpbmRvd1tgJHt2ZW5kb3J9Q2FuY2VsQW5pbWF0aW9uRnJhbWVgXSB8fCB3aW5kb3dbYCR7dmVuZG9yfUNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZWBdXG4gICAgfVxuICB9XG5cbiAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgcmVxdWVzdCA9IChjYWxsYmFjaykgPT4ge1xuICAgICAgY29uc3QgY3VyclRpbWUgPSBEYXRlLm5vdygpXG4gICAgICBjb25zdCB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc3RhbmRhcmQvbm8tY2FsbGJhY2stbGl0ZXJhbFxuICAgICAgY29uc3QgdG9rZW4gPSBzZXRUaW1lb3V0KCgpID0+IHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKSB9LFxuICAgICAgICB0aW1lVG9DYWxsKVxuXG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbFxuICAgICAgcmV0dXJuIHRva2VuXG4gICAgfVxuXG4gICAgY2FuY2VsID0gKHRva2VuKSA9PiBjbGVhclRpbWVvdXQodG9rZW4pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICByZXF1ZXN0OiAoY2FsbGJhY2spID0+IHJlcXVlc3QoY2FsbGJhY2spLFxuICBjYW5jZWw6ICh0b2tlbikgPT4gY2FuY2VsKHRva2VuKSxcbiAgaW5pdCxcbn1cbiJdfQ==