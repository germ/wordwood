import { contains } from './arr';
import * as domUtils from './domUtils';
import * as is from './is';
import pExtend from './pointerExtend';
import pointerUtils from './pointerUtils';
const elements = [];
const targets = [];
const delegatedEvents = {};
const documents = [];
function add(element, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    let elementIndex = elements.indexOf(element);
    let target = targets[elementIndex];
    if (!target) {
        target = {
            events: {},
            typeCount: 0,
        };
        elementIndex = elements.push(element) - 1;
        targets.push(target);
    }
    if (!target.events[type]) {
        target.events[type] = [];
        target.typeCount++;
    }
    if (!contains(target.events[type], listener)) {
        element.addEventListener(type, listener, events.supportsOptions ? options : !!options.capture);
        target.events[type].push(listener);
    }
}
function remove(element, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    const elementIndex = elements.indexOf(element);
    const target = targets[elementIndex];
    if (!target || !target.events) {
        return;
    }
    if (type === 'all') {
        for (type in target.events) {
            if (target.events.hasOwnProperty(type)) {
                remove(element, type, 'all');
            }
        }
        return;
    }
    if (target.events[type]) {
        const len = target.events[type].length;
        if (listener === 'all') {
            for (let i = 0; i < len; i++) {
                remove(element, type, target.events[type][i], options);
            }
            return;
        }
        else {
            for (let i = 0; i < len; i++) {
                if (target.events[type][i] === listener) {
                    element.removeEventListener(type, listener, events.supportsOptions ? options : !!options.capture);
                    target.events[type].splice(i, 1);
                    break;
                }
            }
        }
        if (target.events[type] && target.events[type].length === 0) {
            target.events[type] = null;
            target.typeCount--;
        }
    }
    if (!target.typeCount) {
        targets.splice(elementIndex, 1);
        elements.splice(elementIndex, 1);
    }
}
function addDelegate(selector, context, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    if (!delegatedEvents[type]) {
        delegatedEvents[type] = {
            contexts: [],
            listeners: [],
            selectors: [],
        };
        // add delegate listener functions
        for (const doc of documents) {
            add(doc, type, delegateListener);
            add(doc, type, delegateUseCapture, true);
        }
    }
    const delegated = delegatedEvents[type];
    let index;
    for (index = delegated.selectors.length - 1; index >= 0; index--) {
        if (delegated.selectors[index] === selector &&
            delegated.contexts[index] === context) {
            break;
        }
    }
    if (index === -1) {
        index = delegated.selectors.length;
        delegated.selectors.push(selector);
        delegated.contexts.push(context);
        delegated.listeners.push([]);
    }
    // keep listener and capture and passive flags
    delegated.listeners[index].push([listener, !!options.capture, options.passive]);
}
function removeDelegate(selector, context, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    const delegated = delegatedEvents[type];
    let matchFound = false;
    let index;
    if (!delegated) {
        return;
    }
    // count from last index of delegated to 0
    for (index = delegated.selectors.length - 1; index >= 0; index--) {
        // look for matching selector and context Node
        if (delegated.selectors[index] === selector &&
            delegated.contexts[index] === context) {
            const listeners = delegated.listeners[index];
            // each item of the listeners array is an array: [function, capture, passive]
            for (let i = listeners.length - 1; i >= 0; i--) {
                const [fn, capture, passive] = listeners[i];
                // check if the listener functions and capture and passive flags match
                if (fn === listener && capture === !!options.capture && passive === options.passive) {
                    // remove the listener from the array of listeners
                    listeners.splice(i, 1);
                    // if all listeners for this interactable have been removed
                    // remove the interactable from the delegated arrays
                    if (!listeners.length) {
                        delegated.selectors.splice(index, 1);
                        delegated.contexts.splice(index, 1);
                        delegated.listeners.splice(index, 1);
                        // remove delegate function from context
                        remove(context, type, delegateListener);
                        remove(context, type, delegateUseCapture, true);
                        // remove the arrays if they are empty
                        if (!delegated.selectors.length) {
                            delegatedEvents[type] = null;
                        }
                    }
                    // only remove one listener
                    matchFound = true;
                    break;
                }
            }
            if (matchFound) {
                break;
            }
        }
    }
}
// bound to the interactable context when a DOM event
// listener is added to a selector interactable
function delegateListener(event, optionalArg) {
    const options = getOptions(optionalArg);
    const fakeEvent = new FakeEvent(event);
    const delegated = delegatedEvents[event.type];
    const [eventTarget] = (pointerUtils.getEventTargets(event));
    let element = eventTarget;
    // climb up document tree looking for selector matches
    while (is.element(element)) {
        for (let i = 0; i < delegated.selectors.length; i++) {
            const selector = delegated.selectors[i];
            const context = delegated.contexts[i];
            if (domUtils.matchesSelector(element, selector) &&
                domUtils.nodeContains(context, eventTarget) &&
                domUtils.nodeContains(context, element)) {
                const listeners = delegated.listeners[i];
                fakeEvent.currentTarget = element;
                for (const [fn, capture, passive] of listeners) {
                    if (capture === !!options.capture && passive === options.passive) {
                        fn(fakeEvent);
                    }
                }
            }
        }
        element = domUtils.parentNode(element);
    }
}
function delegateUseCapture(event) {
    return delegateListener.call(this, event, true);
}
function getOptions(param) {
    return is.object(param) ? param : { capture: param };
}
export class FakeEvent {
    constructor(originalEvent) {
        this.originalEvent = originalEvent;
        // duplicate the event so that currentTarget can be changed
        pExtend(this, originalEvent);
    }
    preventOriginalDefault() {
        this.originalEvent.preventDefault();
    }
    stopPropagation() {
        this.originalEvent.stopPropagation();
    }
    stopImmediatePropagation() {
        this.originalEvent.stopImmediatePropagation();
    }
}
const events = {
    add,
    remove,
    addDelegate,
    removeDelegate,
    delegateListener,
    delegateUseCapture,
    delegatedEvents,
    documents,
    supportsOptions: false,
    supportsPassive: false,
    _elements: elements,
    _targets: targets,
    init(window) {
        window.document.createElement('div').addEventListener('test', null, {
            get capture() { return (events.supportsOptions = true); },
            get passive() { return (events.supportsPassive = true); },
        });
    },
};
export default events;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxPQUFPLENBQUE7QUFDaEMsT0FBTyxLQUFLLFFBQVEsTUFBTSxZQUFZLENBQUE7QUFDdEMsT0FBTyxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFDMUIsT0FBTyxPQUFPLE1BQU0saUJBQWlCLENBQUE7QUFDckMsT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUE7QUFJekMsTUFBTSxRQUFRLEdBQWtCLEVBQUUsQ0FBQTtBQUNsQyxNQUFNLE9BQU8sR0FHUixFQUFFLENBQUE7QUFFUCxNQUFNLGVBQWUsR0FNakIsRUFBRSxDQUFBO0FBQ04sTUFBTSxTQUFTLEdBQWUsRUFBRSxDQUFBO0FBRWhDLFNBQVMsR0FBRyxDQUFFLE9BQW9CLEVBQUUsSUFBWSxFQUFFLFFBQWtCLEVBQUUsV0FBMkI7SUFDL0YsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3ZDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDNUMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBRWxDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLEdBQUc7WUFDUCxNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxDQUFDO1NBQ2IsQ0FBQTtRQUVELFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3JCO0lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENB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LEVBQUUsS0FBSztJQUV0QixTQUFTLEVBQUUsUUFBUTtJQUNuQixRQUFRLEVBQUUsT0FBTztJQUVqQixJQUFJLENBQUUsTUFBYztRQUNsQixNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO1lBQ2xFLElBQUksT0FBTyxLQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUN6RCxJQUFJLE9BQU8sS0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7U0FDMUQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUE7QUFFRCxlQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbnRhaW5zIH0gZnJvbSAnLi9hcnInXG5pbXBvcnQgKiBhcyBkb21VdGlscyBmcm9tICcuL2RvbVV0aWxzJ1xuaW1wb3J0ICogYXMgaXMgZnJvbSAnLi9pcydcbmltcG9ydCBwRXh0ZW5kIGZyb20gJy4vcG9pbnRlckV4dGVuZCdcbmltcG9ydCBwb2ludGVyVXRpbHMgZnJvbSAnLi9wb2ludGVyVXRpbHMnXG5cbnR5cGUgTGlzdGVuZXIgPSAoZXZlbnQ6IEV2ZW50IHwgRmFrZUV2ZW50KSA9PiBhbnlcblxuY29uc3QgZWxlbWVudHM6IEV2ZW50VGFyZ2V0W10gPSBbXVxuY29uc3QgdGFyZ2V0czogQXJyYXk8e1xuICBldmVudHM6IHsgW3R5cGU6IHN0cmluZ106IExpc3RlbmVyW10gfSxcbiAgdHlwZUNvdW50OiBudW1iZXIsXG59PiA9IFtdXG5cbmNvbnN0IGRlbGVnYXRlZEV2ZW50czoge1xuICBbdHlwZTogc3RyaW5nXToge1xuICAgIHNlbGVjdG9yczogc3RyaW5nW10sXG4gICAgY29udGV4dHM6IE5vZGVbXSxcbiAgICBsaXN0ZW5lcnM6IEFycmF5PEFycmF5PFtMaXN0ZW5lciwgYm9vbGVhbiwgYm9vbGVhbl0+PixcbiAgfSxcbn0gPSB7fVxuY29uc3QgZG9jdW1lbnRzOiBEb2N1bWVudFtdID0gW11cblxuZnVuY3Rpb24gYWRkIChlbGVtZW50OiBFdmVudFRhcmdldCwgdHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogTGlzdGVuZXIsIG9wdGlvbmFsQXJnPzogYm9vbGVhbiB8IGFueSkge1xuICBjb25zdCBvcHRpb25zID0gZ2V0T3B0aW9ucyhvcHRpb25hbEFyZylcbiAgbGV0IGVsZW1lbnRJbmRleCA9IGVsZW1lbnRzLmluZGV4T2YoZWxlbWVudClcbiAgbGV0IHRhcmdldCA9IHRhcmdldHNbZWxlbWVudEluZGV4XVxuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGFyZ2V0ID0ge1xuICAgICAgZXZlbnRzOiB7fSxcbiAgICAgIHR5cGVDb3VudDogMCxcbiAgICB9XG5cbiAgICBlbGVtZW50SW5kZXggPSBlbGVtZW50cy5wdXNoKGVsZW1lbnQpIC0gMVxuICAgIHRhcmdldHMucHVzaCh0YXJnZXQpXG4gIH1cblxuICBpZiAoIXRhcmdldC5ldmVudHNbdHlwZV0pIHtcbiAgICB0YXJnZXQuZXZlbnRzW3R5cGVdID0gW11cbiAgICB0YXJnZXQudHlwZUNvdW50KytcbiAgfVxuXG4gIGlmICghY29udGFpbnModGFyZ2V0LmV2ZW50c1t0eXBlXSwgbGlzdGVuZXIpKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyIGFzIGFueSwgZXZlbnRzLnN1cHBvcnRzT3B0aW9ucyA/IG9wdGlvbnMgOiAhIW9wdGlvbnMuY2FwdHVyZSlcbiAgICB0YXJnZXQuZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlIChlbGVtZW50OiBFdmVudFRhcmdldCwgdHlwZTogc3RyaW5nLCBsaXN0ZW5lcj86ICdhbGwnIHwgTGlzdGVuZXIsIG9wdGlvbmFsQXJnPzogYm9vbGVhbiB8IGFueSkge1xuICBjb25zdCBvcHRpb25zID0gZ2V0T3B0aW9ucyhvcHRpb25hbEFyZylcbiAgY29uc3QgZWxlbWVudEluZGV4ID0gZWxlbWVudHMuaW5kZXhPZihlbGVtZW50KVxuICBjb25zdCB0YXJnZXQgPSB0YXJnZXRzW2VsZW1lbnRJbmRleF1cblxuICBpZiAoIXRhcmdldCB8fCAhdGFyZ2V0LmV2ZW50cykge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdhbGwnKSB7XG4gICAgZm9yICh0eXBlIGluIHRhcmdldC5ldmVudHMpIHtcbiAgICAgIGlmICh0YXJnZXQuZXZlbnRzLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgIHJlbW92ZShlbGVtZW50LCB0eXBlLCAnYWxsJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAodGFyZ2V0LmV2ZW50c1t0eXBlXSkge1xuICAgIGNvbnN0IGxlbiA9IHRhcmdldC5ldmVudHNbdHlwZV0ubGVuZ3RoXG5cbiAgICBpZiAobGlzdGVuZXIgPT09ICdhbGwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHJlbW92ZShlbGVtZW50LCB0eXBlLCB0YXJnZXQuZXZlbnRzW3R5cGVdW2ldLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAodGFyZ2V0LmV2ZW50c1t0eXBlXVtpXSA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIgYXMgYW55LCBldmVudHMuc3VwcG9ydHNPcHRpb25zID8gb3B0aW9ucyA6ICEhb3B0aW9ucy5jYXB0dXJlKVxuICAgICAgICAgIHRhcmdldC5ldmVudHNbdHlwZV0uc3BsaWNlKGksIDEpXG5cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldC5ldmVudHNbdHlwZV0gJiYgdGFyZ2V0LmV2ZW50c1t0eXBlXS5sZW5ndGggPT09IDApIHtcbiAgICAgICh0YXJnZXQuZXZlbnRzW3R5cGVdIGFzIGFueSkgPSBudWxsXG4gICAgICB0YXJnZXQudHlwZUNvdW50LS1cbiAgICB9XG4gIH1cblxuICBpZiAoIXRhcmdldC50eXBlQ291bnQpIHtcbiAgICB0YXJnZXRzLnNwbGljZShlbGVtZW50SW5kZXgsIDEpXG4gICAgZWxlbWVudHMuc3BsaWNlKGVsZW1lbnRJbmRleCwgMSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGREZWxlZ2F0ZSAoc2VsZWN0b3I6IHN0cmluZywgY29udGV4dDogTm9kZSwgdHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogTGlzdGVuZXIsIG9wdGlvbmFsQXJnPzogYW55KSB7XG4gIGNvbnN0IG9wdGlvbnMgPSBnZXRPcHRpb25zKG9wdGlvbmFsQXJnKVxuICBpZiAoIWRlbGVnYXRlZEV2ZW50c1t0eXBlXSkge1xuICAgIGRlbGVnYXRlZEV2ZW50c1t0eXBlXSA9IHtcbiAgICAgIGNvbnRleHRzIDogW10sXG4gICAgICBsaXN0ZW5lcnM6IFtdLFxuICAgICAgc2VsZWN0b3JzOiBbXSxcbiAgICB9XG5cbiAgICAvLyBhZGQgZGVsZWdhdGUgbGlzdGVuZXIgZnVuY3Rpb25zXG4gICAgZm9yIChjb25zdCBkb2Mgb2YgZG9jdW1lbnRzKSB7XG4gICAgICBhZGQoZG9jLCB0eXBlLCBkZWxlZ2F0ZUxpc3RlbmVyKVxuICAgICAgYWRkKGRvYywgdHlwZSwgZGVsZWdhdGVVc2VDYXB0dXJlLCB0cnVlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlZCA9IGRlbGVnYXRlZEV2ZW50c1t0eXBlXVxuICBsZXQgaW5kZXhcblxuICBmb3IgKGluZGV4ID0gZGVsZWdhdGVkLnNlbGVjdG9ycy5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgaWYgKGRlbGVnYXRlZC5zZWxlY3RvcnNbaW5kZXhdID09PSBzZWxlY3RvciAmJlxuICAgICAgICBkZWxlZ2F0ZWQuY29udGV4dHNbaW5kZXhdID09PSBjb250ZXh0KSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICBpbmRleCA9IGRlbGVnYXRlZC5zZWxlY3RvcnMubGVuZ3RoXG5cbiAgICBkZWxlZ2F0ZWQuc2VsZWN0b3JzLnB1c2goc2VsZWN0b3IpXG4gICAgZGVsZWdhdGVkLmNvbnRleHRzLnB1c2goY29udGV4dClcbiAgICBkZWxlZ2F0ZWQubGlzdGVuZXJzLnB1c2goW10pXG4gIH1cblxuICAvLyBrZWVwIGxpc3RlbmVyIGFuZCBjYXB0dXJlIGFuZCBwYXNzaXZlIGZsYWdzXG4gIGRlbGVnYXRlZC5saXN0ZW5lcnNbaW5kZXhdLnB1c2goW2xpc3RlbmVyLCAhIW9wdGlvbnMuY2FwdHVyZSwgb3B0aW9ucy5wYXNzaXZlXSlcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRGVsZWdhdGUgKHNlbGVjdG9yLCBjb250ZXh0LCB0eXBlLCBsaXN0ZW5lcj8sIG9wdGlvbmFsQXJnPzogYW55KSB7XG4gIGNvbnN0IG9wdGlvbnMgPSBnZXRPcHRpb25zKG9wdGlvbmFsQXJnKVxuICBjb25zdCBkZWxlZ2F0ZWQgPSBkZWxlZ2F0ZWRFdmVudHNbdHlwZV1cbiAgbGV0IG1hdGNoRm91bmQgPSBmYWxzZVxuICBsZXQgaW5kZXhcblxuICBpZiAoIWRlbGVnYXRlZCkgeyByZXR1cm4gfVxuXG4gIC8vIGNvdW50IGZyb20gbGFzdCBpbmRleCBvZiBkZWxlZ2F0ZWQgdG8gMFxuICBmb3IgKGluZGV4ID0gZGVsZWdhdGVkLnNlbGVjdG9ycy5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgLy8gbG9vayBmb3IgbWF0Y2hpbmcgc2VsZWN0b3IgYW5kIGNvbnRleHQgTm9kZVxuICAgIGlmIChkZWxlZ2F0ZWQuc2VsZWN0b3JzW2luZGV4XSA9PT0gc2VsZWN0b3IgJiZcbiAgICAgICAgZGVsZWdhdGVkLmNvbnRleHRzW2luZGV4XSA9PT0gY29udGV4dCkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gZGVsZWdhdGVkLmxpc3RlbmVyc1tpbmRleF1cblxuICAgICAgLy8gZWFjaCBpdGVtIG9mIHRoZSBsaXN0ZW5lcnMgYXJyYXkgaXMgYW4gYXJyYXk6IFtmdW5jdGlvbiwgY2FwdHVyZSwgcGFzc2l2ZV1cbiAgICAgIGZvciAobGV0IGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgW2ZuLCBjYXB0dXJlLCBwYXNzaXZlXSA9IGxpc3RlbmVyc1tpXVxuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbnMgYW5kIGNhcHR1cmUgYW5kIHBhc3NpdmUgZmxhZ3MgbWF0Y2hcbiAgICAgICAgaWYgKGZuID09PSBsaXN0ZW5lciAmJiBjYXB0dXJlID09PSAhIW9wdGlvbnMuY2FwdHVyZSAmJiBwYXNzaXZlID09PSBvcHRpb25zLnBhc3NpdmUpIHtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gdGhlIGFycmF5IG9mIGxpc3RlbmVyc1xuICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSlcblxuICAgICAgICAgIC8vIGlmIGFsbCBsaXN0ZW5lcnMgZm9yIHRoaXMgaW50ZXJhY3RhYmxlIGhhdmUgYmVlbiByZW1vdmVkXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBpbnRlcmFjdGFibGUgZnJvbSB0aGUgZGVsZWdhdGVkIGFycmF5c1xuICAgICAgICAgIGlmICghbGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZGVsZWdhdGVkLnNlbGVjdG9ycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICBkZWxlZ2F0ZWQuY29udGV4dHMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgZGVsZWdhdGVkLmxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBkZWxlZ2F0ZSBmdW5jdGlvbiBmcm9tIGNvbnRleHRcbiAgICAgICAgICAgIHJlbW92ZShjb250ZXh0LCB0eXBlLCBkZWxlZ2F0ZUxpc3RlbmVyKVxuICAgICAgICAgICAgcmVtb3ZlKGNvbnRleHQsIHR5cGUsIGRlbGVnYXRlVXNlQ2FwdHVyZSwgdHJ1ZSlcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBhcnJheXMgaWYgdGhleSBhcmUgZW1wdHlcbiAgICAgICAgICAgIGlmICghZGVsZWdhdGVkLnNlbGVjdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZGVsZWdhdGVkRXZlbnRzW3R5cGVdID0gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG9ubHkgcmVtb3ZlIG9uZSBsaXN0ZW5lclxuICAgICAgICAgIG1hdGNoRm91bmQgPSB0cnVlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWF0Y2hGb3VuZCkgeyBicmVhayB9XG4gICAgfVxuICB9XG59XG5cbi8vIGJvdW5kIHRvIHRoZSBpbnRlcmFjdGFibGUgY29udGV4dCB3aGVuIGEgRE9NIGV2ZW50XG4vLyBsaXN0ZW5lciBpcyBhZGRlZCB0byBhIHNlbGVjdG9yIGludGVyYWN0YWJsZVxuZnVuY3Rpb24gZGVsZWdhdGVMaXN0ZW5lciAoZXZlbnQ6IEV2ZW50LCBvcHRpb25hbEFyZz86IGFueSkge1xuICBjb25zdCBvcHRpb25zID0gZ2V0T3B0aW9ucyhvcHRpb25hbEFyZylcbiAgY29uc3QgZmFrZUV2ZW50ID0gbmV3IEZha2VFdmVudChldmVudClcbiAgY29uc3QgZGVsZWdhdGVkID0gZGVsZWdhdGVkRXZlbnRzW2V2ZW50LnR5cGVdXG4gIGNvbnN0IFtldmVudFRhcmdldF0gPSAocG9pbnRlclV0aWxzLmdldEV2ZW50VGFyZ2V0cyhldmVudCkpXG4gIGxldCBlbGVtZW50ID0gZXZlbnRUYXJnZXRcblxuICAvLyBjbGltYiB1cCBkb2N1bWVudCB0cmVlIGxvb2tpbmcgZm9yIHNlbGVjdG9yIG1hdGNoZXNcbiAgd2hpbGUgKGlzLmVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlbGVnYXRlZC5zZWxlY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNlbGVjdG9yID0gZGVsZWdhdGVkLnNlbGVjdG9yc1tpXVxuICAgICAgY29uc3QgY29udGV4dCA9IGRlbGVnYXRlZC5jb250ZXh0c1tpXVxuXG4gICAgICBpZiAoZG9tVXRpbHMubWF0Y2hlc1NlbGVjdG9yKGVsZW1lbnQsIHNlbGVjdG9yKSAmJlxuICAgICAgICAgIGRvbVV0aWxzLm5vZGVDb250YWlucyhjb250ZXh0LCBldmVudFRhcmdldCkgJiZcbiAgICAgICAgICBkb21VdGlscy5ub2RlQ29udGFpbnMoY29udGV4dCwgZWxlbWVudCkpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gZGVsZWdhdGVkLmxpc3RlbmVyc1tpXVxuXG4gICAgICAgIGZha2VFdmVudC5jdXJyZW50VGFyZ2V0ID0gZWxlbWVudFxuXG4gICAgICAgIGZvciAoY29uc3QgW2ZuLCBjYXB0dXJlLCBwYXNzaXZlXSBvZiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICBpZiAoY2FwdHVyZSA9PT0gISFvcHRpb25zLmNhcHR1cmUgJiYgcGFzc2l2ZSA9PT0gb3B0aW9ucy5wYXNzaXZlKSB7XG4gICAgICAgICAgICBmbihmYWtlRXZlbnQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGRvbVV0aWxzLnBhcmVudE5vZGUoZWxlbWVudClcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWxlZ2F0ZVVzZUNhcHR1cmUgKGV2ZW50OiBFdmVudCkge1xuICByZXR1cm4gZGVsZWdhdGVMaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50LCB0cnVlKVxufVxuXG5mdW5jdGlvbiBnZXRPcHRpb25zIChwYXJhbSkge1xuICByZXR1cm4gaXMub2JqZWN0KHBhcmFtKSA/IHBhcmFtIDogeyBjYXB0dXJlOiBwYXJhbSB9XG59XG5cbmV4cG9ydCBjbGFzcyBGYWtlRXZlbnQgaW1wbGVtZW50cyBQYXJ0aWFsPEV2ZW50PiB7XG4gIGN1cnJlbnRUYXJnZXQ6IEV2ZW50VGFyZ2V0XG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBvcmlnaW5hbEV2ZW50KSB7XG4gICAgLy8gZHVwbGljYXRlIHRoZSBldmVudCBzbyB0aGF0IGN1cnJlbnRUYXJnZXQgY2FuIGJlIGNoYW5nZWRcbiAgICBwRXh0ZW5kKHRoaXMsIG9yaWdpbmFsRXZlbnQpXG4gIH1cblxuICBwcmV2ZW50T3JpZ2luYWxEZWZhdWx0ICgpIHtcbiAgICB0aGlzLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgc3RvcFByb3BhZ2F0aW9uICgpIHtcbiAgICB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgfVxuXG4gIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoKSB7XG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gIH1cbn1cblxuY29uc3QgZXZlbnRzID0ge1xuICBhZGQsXG4gIHJlbW92ZSxcblxuICBhZGREZWxlZ2F0ZSxcbiAgcmVtb3ZlRGVsZWdhdGUsXG5cbiAgZGVsZWdhdGVMaXN0ZW5lcixcbiAgZGVsZWdhdGVVc2VDYXB0dXJlLFxuICBkZWxlZ2F0ZWRFdmVudHMsXG4gIGRvY3VtZW50cyxcblxuICBzdXBwb3J0c09wdGlvbnM6IGZhbHNlLFxuICBzdXBwb3J0c1Bhc3NpdmU6IGZhbHNlLFxuXG4gIF9lbGVtZW50czogZWxlbWVudHMsXG4gIF90YXJnZXRzOiB0YXJnZXRzLFxuXG4gIGluaXQgKHdpbmRvdzogV2luZG93KSB7XG4gICAgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBudWxsLCB7XG4gICAgICBnZXQgY2FwdHVyZSAoKSB7IHJldHVybiAoZXZlbnRzLnN1cHBvcnRzT3B0aW9ucyA9IHRydWUpIH0sXG4gICAgICBnZXQgcGFzc2l2ZSAoKSB7IHJldHVybiAoZXZlbnRzLnN1cHBvcnRzUGFzc2l2ZSA9IHRydWUpIH0sXG4gICAgfSlcbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzXG4iXX0=