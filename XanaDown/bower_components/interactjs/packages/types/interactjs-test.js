// eslint-disable-next-line node/no-extraneous-import
import interact from 'interactjs';
// Interactables
interact(document.body);
interact(document);
interact(window);
interact('.drag-and-resize')
    .draggable({
    modifiers: [
        interact.modifiers.snap({
            targets: [
                { x: 100, y: 200 },
                function (x, y) { return { x: x % 20, y }; },
            ],
        }),
    ],
})
    .resizable({
    inertia: true,
});
// Selector context
const myList = document.querySelector('#my-list');
interact('li', {
    context: myList,
})
    .draggable({ /* ... */});
// Action options
const target = 'li';
interact(target)
    .draggable({
    max: 1,
    maxPerElement: 2,
    manualStart: true,
    modifiers: [],
    inertia: { /* ... */},
    autoScroll: { /* ... */},
    lockAxis: 'x' || 'y' || 'start',
    startAxis: 'x' || 'y',
})
    .resizable({
    max: 1,
    maxPerElement: 2,
    manualStart: true,
    modifiers: [],
    inertia: { /* ... */},
    autoScroll: { /* ... */},
    margin: 50,
    square: true || false,
    axis: 'x' || 'y',
})
    .gesturable({
    max: 1,
    maxPerElement: 2,
    manualStart: true,
    modifiers: [],
});
// autoscroll
const element = 'li';
interact(element)
    .draggable({
    autoScroll: true,
})
    .resizable({
    autoScroll: {
        container: document.body,
        margin: 50,
        distance: 5,
        interval: 10,
    },
});
// axis
interact(target).draggable({
    axis: 'x',
});
interact(target).resizable({
    axis: 'x',
});
const handleEl = 'li';
interact(target).resizable({
    edges: {
        top: true,
        left: false,
        bottom: '.resize-s',
        right: handleEl,
    },
});
// resize invert
interact(target).resizable({
    edges: { bottom: true, right: true },
    invert: 'reposition',
});
// resize square
interact(target).resizable({
    squareResize: true,
});
// dropzone  accept
interact(target).dropzone({
    accept: '.drag0, .drag1',
});
// dropzone overlap
interact(target).dropzone({
    overlap: 0.25,
});
// dropzone checker
interact(target).dropzone({
    checker(_dragEvent, // related dragmove or dragend
    _event, // Touch, Pointer or Mouse Event
    dropped, // bool default checker result
    _dropzone, // dropzone Interactable
    dropElement, // dropzone elemnt
    _draggable, // draggable Interactable
    _draggableElement) {
        // only allow drops into empty dropzone elements
        return dropped && !dropElement.hasChildNodes();
    },
});
interact.dynamicDrop();
interact.dynamicDrop(false);
// Events
function listener(event) {
    const { type, pageX, pageY } = event;
    alert({ type, pageX, pageY });
}
interact(target)
    .on('dragstart', listener)
    .on('dragmove dragend', listener)
    .on(['resizemove', 'resizeend'], listener)
    .on({
    gesturestart: listener,
    gestureend: listener,
});
interact.on('resize', (event) => {
    const { rect, deltaRect } = event;
    alert(JSON.stringify({ rect, deltaRect }));
});
interact(target).resizable({
    listeners: [
        { start: listener, move: listener },
    ],
});
interact(target).draggable({
    listeners: { start: listener, end: listener },
});
interact(target).draggable({
    onstart: listener,
    onmove: listener,
    onend: listener,
});
interact.on(['dragmove', 'resizestart'], listener);
const dropTarget = 'div';
// Drop Events
interact(dropTarget)
    .dropzone({
    ondrop(event) {
        alert(event.relatedTarget.id +
            ' was dropped into ' +
            event.target.id);
    },
})
    .on('dropactivate', (event) => {
    event.target.classList.add('drop-activated');
});
interact(target).on('up', (_event) => { });
// fast click
interact('a[href]').on('tap', (event) => {
    window.location.href = event.currentTarget.href;
    event.preventDefault();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJhY3Rqcy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZXJhY3Rqcy10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFEQUFxRDtBQUNyRCxPQUFPLFFBQVEsTUFBTSxZQUFZLENBQUE7QUFFakMsZ0JBQWdCO0FBQ2hCLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdkIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2xCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUVoQixRQUFRLENBQUMsa0JBQWtCLENBQUM7S0FDekIsU0FBUyxDQUFDO0lBQ1QsU0FBUyxFQUFFO1FBQ1QsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDdEIsT0FBTyxFQUFFO2dCQUNQLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNsQixVQUFVLENBQVMsRUFBRSxDQUFTLElBQUksT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFBLENBQUMsQ0FBQzthQUM1RDtTQUNGLENBQUM7S0FDSDtDQUNGLENBQUM7S0FDRCxTQUFTLENBQUM7SUFDVCxPQUFPLEVBQUUsSUFBSTtDQUNkLENBQUMsQ0FBQTtBQUVKLG1CQUFtQjtBQUNuQixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRWpELFFBQVEsQ0FBQyxJQUFJLEVBQUU7SUFDYixPQUFPLEVBQUUsTUFBTTtDQUNoQixDQUFDO0tBQ0MsU0FBUyxDQUFDLEVBQUUsU0FBUyxDQUFFLENBQUMsQ0FBQTtBQUUzQixpQkFBaUI7QUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ25CLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDYixTQUFTLENBQUM7SUFDVCxHQUFHLEVBQVksQ0FBQztJQUNoQixhQUFhLEVBQUUsQ0FB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YyxFQUFFLENBQUE7QUFDeEIsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby1leHRyYW5lb3VzLWltcG9ydFxuaW1wb3J0IGludGVyYWN0IGZyb20gJ2ludGVyYWN0anMnXG5cbi8vIEludGVyYWN0YWJsZXNcbmludGVyYWN0KGRvY3VtZW50LmJvZHkpXG5pbnRlcmFjdChkb2N1bWVudClcbmludGVyYWN0KHdpbmRvdylcblxuaW50ZXJhY3QoJy5kcmFnLWFuZC1yZXNpemUnKVxuICAuZHJhZ2dhYmxlKHtcbiAgICBtb2RpZmllcnM6IFtcbiAgICAgIGludGVyYWN0Lm1vZGlmaWVycy5zbmFwKHtcbiAgICAgICAgdGFyZ2V0czogW1xuICAgICAgICAgIHsgeDogMTAwLCB5OiAyMDAgfSxcbiAgICAgICAgICBmdW5jdGlvbiAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHsgcmV0dXJuIHsgeDogeCAlIDIwLCB5IH0gfSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0pXG4gIC5yZXNpemFibGUoe1xuICAgIGluZXJ0aWE6IHRydWUsXG4gIH0pXG5cbi8vIFNlbGVjdG9yIGNvbnRleHRcbmNvbnN0IG15TGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteS1saXN0JylcblxuaW50ZXJhY3QoJ2xpJywge1xuICBjb250ZXh0OiBteUxpc3QsXG59KVxuICAuZHJhZ2dhYmxlKHsgLyogLi4uICovIH0pXG5cbi8vIEFjdGlvbiBvcHRpb25zXG5jb25zdCB0YXJnZXQgPSAnbGknXG5pbnRlcmFjdCh0YXJnZXQpXG4gIC5kcmFnZ2FibGUoe1xuICAgIG1heCAgICAgICAgICA6IDEsXG4gICAgbWF4UGVyRWxlbWVudDogMixcbiAgICBtYW51YWxTdGFydCAgOiB0cnVlLFxuICAgIG1vZGlmaWVycyAgICA6IFtdLFxuICAgIGluZXJ0aWEgICAgICA6IHsvKiAuLi4gKi99LFxuICAgIGF1dG9TY3JvbGwgICA6IHsvKiAuLi4gKi99LFxuXG4gICAgbG9ja0F4aXMgICAgIDogJ3gnIHx8ICd5JyB8fCAnc3RhcnQnLFxuICAgIHN0YXJ0QXhpcyAgICA6ICd4JyB8fCAneScsXG4gIH0pXG4gIC5yZXNpemFibGUoe1xuICAgIG1heCAgICAgICAgICA6IDEsXG4gICAgbWF4UGVyRWxlbWVudDogMixcbiAgICBtYW51YWxTdGFydCAgOiB0cnVlLFxuICAgIG1vZGlmaWVycyAgICA6IFtdLFxuICAgIGluZXJ0aWEgICAgICA6IHsvKiAuLi4gKi99LFxuICAgIGF1dG9TY3JvbGwgICA6IHsvKiAuLi4gKi99LFxuICAgIG1hcmdpbiAgICAgICA6IDUwLFxuXG4gICAgc3F1YXJlICAgICAgIDogdHJ1ZSB8fCBmYWxzZSxcbiAgICBheGlzICAgICAgICAgOiAneCcgfHwgJ3knLFxuICB9KVxuICAuZ2VzdHVyYWJsZSh7XG4gICAgbWF4ICAgICAgICAgIDogMSxcbiAgICBtYXhQZXJFbGVtZW50OiAyLFxuICAgIG1hbnVhbFN0YXJ0ICA6IHRydWUsXG4gICAgbW9kaWZpZXJzICAgIDogW10sXG4gIH0pXG5cbi8vIGF1dG9zY3JvbGxcbmNvbnN0IGVsZW1lbnQgPSAnbGknXG5pbnRlcmFjdChlbGVtZW50KVxuICAuZHJhZ2dhYmxlKHtcbiAgICBhdXRvU2Nyb2xsOiB0cnVlLFxuICB9KVxuICAucmVzaXphYmxlKHtcbiAgICBhdXRvU2Nyb2xsOiB7XG4gICAgICBjb250YWluZXI6IGRvY3VtZW50LmJvZHksXG4gICAgICBtYXJnaW46IDUwLFxuICAgICAgZGlzdGFuY2U6IDUsXG4gICAgICBpbnRlcnZhbDogMTAsXG4gICAgfSxcbiAgfSlcblxuLy8gYXhpc1xuaW50ZXJhY3QodGFyZ2V0KS5kcmFnZ2FibGUoe1xuICBheGlzOiAneCcsXG59KVxuXG5pbnRlcmFjdCh0YXJnZXQpLnJlc2l6YWJsZSh7XG4gIGF4aXM6ICd4Jyxcbn0pXG5cbmNvbnN0IGhhbmRsZUVsID0gJ2xpJ1xuaW50ZXJhY3QodGFyZ2V0KS5yZXNpemFibGUoe1xuICBlZGdlczoge1xuICAgIHRvcCAgIDogdHJ1ZSwgICAgICAgLy8gVXNlIHBvaW50ZXIgY29vcmRzIHRvIGNoZWNrIGZvciByZXNpemUuXG4gICAgbGVmdCAgOiBmYWxzZSwgICAgICAvLyBEaXNhYmxlIHJlc2l6aW5nIGZyb20gbGVmdCBlZGdlLlxuICAgIGJvdHRvbTogJy5yZXNpemUtcycsIC8vIFJlc2l6ZSBpZiBwb2ludGVyIHRhcmdldCBtYXRjaGVzIHNlbGVjdG9yXG4gICAgcmlnaHQgOiBoYW5kbGVFbCwgICAgLy8gUmVzaXplIGlmIHBvaW50ZXIgdGFyZ2V0IGlzIHRoZSBnaXZlbiBFbGVtZW50XG4gIH0sXG59KVxuXG4vLyByZXNpemUgaW52ZXJ0XG5pbnRlcmFjdCh0YXJnZXQpLnJlc2l6YWJsZSh7XG4gIGVkZ2VzOiB7IGJvdHRvbTogdHJ1ZSwgcmlnaHQ6IHRydWUgfSxcbiAgaW52ZXJ0OiAncmVwb3NpdGlvbicsXG59KVxuXG4vLyByZXNpemUgc3F1YXJlXG5pbnRlcmFjdCh0YXJnZXQpLnJlc2l6YWJsZSh7XG4gIHNxdWFyZVJlc2l6ZTogdHJ1ZSxcbn0pXG5cbi8vIGRyb3B6b25lICBhY2NlcHRcbmludGVyYWN0KHRhcmdldCkuZHJvcHpvbmUoe1xuICBhY2NlcHQ6ICcuZHJhZzAsIC5kcmFnMScsXG59KVxuXG4vLyBkcm9wem9uZSBvdmVybGFwXG5pbnRlcmFjdCh0YXJnZXQpLmRyb3B6b25lKHtcbiAgb3ZlcmxhcDogMC4yNSxcbn0pXG5cbi8vIGRyb3B6b25lIGNoZWNrZXJcbmludGVyYWN0KHRhcmdldCkuZHJvcHpvbmUoe1xuICBjaGVja2VyIChcbiAgICBfZHJhZ0V2ZW50OiBFbGVtZW50LCAgICAgICAgICAvLyByZWxhdGVkIGRyYWdtb3ZlIG9yIGRyYWdlbmRcbiAgICBfZXZlbnQ6IEV2ZW50LCAgICAgICAgICAgICAgICAvLyBUb3VjaCwgUG9pbnRlciBvciBNb3VzZSBFdmVudFxuICAgIGRyb3BwZWQ6IGJvb2xlYW4sICAgICAgICAgICAgIC8vIGJvb2wgZGVmYXVsdCBjaGVja2VyIHJlc3VsdFxuICAgIF9kcm9wem9uZTogSW50ZXJhY3QuSW50ZXJhY3RhYmxlLCAgICAgIC8vIGRyb3B6b25lIEludGVyYWN0YWJsZVxuICAgIGRyb3BFbGVtZW50OiBFbGVtZW50LCAgICAgICAgIC8vIGRyb3B6b25lIGVsZW1udFxuICAgIF9kcmFnZ2FibGU6IEludGVyYWN0LkludGVyYWN0YWJsZSwgICAgIC8vIGRyYWdnYWJsZSBJbnRlcmFjdGFibGVcbiAgICBfZHJhZ2dhYmxlRWxlbWVudDogRWxlbWVudCkgeyAvLyBkcmFnZ2FibGUgZWxlbWVudFxuICAgIC8vIG9ubHkgYWxsb3cgZHJvcHMgaW50byBlbXB0eSBkcm9wem9uZSBlbGVtZW50c1xuICAgIHJldHVybiBkcm9wcGVkICYmICFkcm9wRWxlbWVudC5oYXNDaGlsZE5vZGVzKClcbiAgfSxcbn0pXG5cbmludGVyYWN0LmR5bmFtaWNEcm9wKClcbmludGVyYWN0LmR5bmFtaWNEcm9wKGZhbHNlKVxuXG4vLyBFdmVudHNcbmZ1bmN0aW9uIGxpc3RlbmVyIChldmVudCkge1xuICBjb25zdCB7IHR5cGUsIHBhZ2VYLCBwYWdlWSB9ID0gZXZlbnRcbiAgYWxlcnQoeyB0eXBlLCBwYWdlWCwgcGFnZVkgfSlcbn1cblxuaW50ZXJhY3QodGFyZ2V0KVxuICAub24oJ2RyYWdzdGFydCcsIGxpc3RlbmVyKVxuICAub24oJ2RyYWdtb3ZlIGRyYWdlbmQnLCBsaXN0ZW5lcilcbiAgLm9uKFsncmVzaXplbW92ZScsICdyZXNpemVlbmQnXSwgbGlzdGVuZXIpXG4gIC5vbih7XG4gICAgZ2VzdHVyZXN0YXJ0OiBsaXN0ZW5lcixcbiAgICBnZXN0dXJlZW5kOiBsaXN0ZW5lcixcbiAgfSlcblxuaW50ZXJhY3Qub24oJ3Jlc2l6ZScsIChldmVudDogSW50ZXJhY3QuUmVzaXplRXZlbnQpID0+IHtcbiAgY29uc3QgeyByZWN0LCBkZWx0YVJlY3QgfSA9IGV2ZW50XG4gIGFsZXJ0KEpTT04uc3RyaW5naWZ5KHsgcmVjdCwgZGVsdGFSZWN0IH0pKVxufSlcblxuaW50ZXJhY3QodGFyZ2V0KS5yZXNpemFibGUoe1xuICBsaXN0ZW5lcnM6IFtcbiAgICB7IHN0YXJ0OiBsaXN0ZW5lciwgbW92ZTogbGlzdGVuZXIgfSxcbiAgXSxcbn0pXG5cbmludGVyYWN0KHRhcmdldCkuZHJhZ2dhYmxlKHtcbiAgbGlzdGVuZXJzOiB7IHN0YXJ0OiBsaXN0ZW5lciwgZW5kOiBsaXN0ZW5lciB9LFxufSlcblxuaW50ZXJhY3QodGFyZ2V0KS5kcmFnZ2FibGUoe1xuICBvbnN0YXJ0OiBsaXN0ZW5lcixcbiAgb25tb3ZlOiBsaXN0ZW5lcixcbiAgb25lbmQ6IGxpc3RlbmVyLFxufSlcblxuaW50ZXJhY3Qub24oWydkcmFnbW92ZScsICdyZXNpemVzdGFydCddLCBsaXN0ZW5lcilcblxuY29uc3QgZHJvcFRhcmdldCA9ICdkaXYnXG4vLyBEcm9wIEV2ZW50c1xuaW50ZXJhY3QoZHJvcFRhcmdldClcbiAgLmRyb3B6b25lKHtcbiAgICBvbmRyb3AgKGV2ZW50KSB7XG4gICAgICBhbGVydChldmVudC5yZWxhdGVkVGFyZ2V0LmlkICtcbiAgICAgICAgICAgICcgd2FzIGRyb3BwZWQgaW50byAnICtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pZClcbiAgICB9LFxuICB9KVxuICAub24oJ2Ryb3BhY3RpdmF0ZScsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdkcm9wLWFjdGl2YXRlZCcpXG4gIH0pXG5cbmludGVyYWN0KHRhcmdldCkub24oJ3VwJywgKF9ldmVudCkgPT4ge30pXG5cbi8vIGZhc3QgY2xpY2tcbmludGVyYWN0KCdhW2hyZWZdJykub24oJ3RhcCcsIChldmVudCkgPT4ge1xuICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuaHJlZlxuXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbn0pXG4iXX0=