import test from '@interactjs/_dev/test/test';
import { ActionName } from '@interactjs/core/scope';
import * as helpers from '@interactjs/core/tests/_helpers';
import * as utils from '@interactjs/utils';
import gesture from './gesture';
function getGestureProps(event) {
    return helpers.getProps(event, ['type', 'angle', 'distance', 'scale', 'ds', 'da']);
}
test('gesture action init', (t) => {
    const scope = helpers.mockScope();
    scope.usePlugin(gesture);
    t.ok(scope.actions.names.includes(ActionName.Gesture), '"gesture" in actions.names');
    t.equal(scope.actions.methodDict.gesture, 'gesturable');
    t.equal(typeof scope.Interactable.prototype.gesturable, 'function');
    t.end();
});
test('Interactable.gesturable method', (t) => {
    const scope = helpers.mockScope();
    scope.usePlugin(gesture);
    const interaction = scope.interactions.new({});
    const element = scope.document.body;
    const interactable = scope.interactables.new(element).gesturable(true);
    const rect = Object.freeze({ top: 100, left: 200, bottom: 300, right: 400 });
    const touches = [
        utils.pointer.coordsToEvent(utils.pointer.newCoords()),
        utils.pointer.coordsToEvent(utils.pointer.newCoords()),
    ].map((touch, index) => Object.assign(touch.coords, {
        pointerId: index,
        client: touch.page,
    }) && touch);
    const events = [];
    interactable.rectChecker(() => ({ ...rect }));
    interactable.on('gesturestart gesturemove gestureend', (event) => {
        events.push(event);
    });
    // 0 --> 1
    utils.extend(touches[0].page, { x: 0, y: 0 });
    utils.extend(touches[1].page, { x: 100, y: 0 });
    interaction.pointerDown(touches[0], touches[0], element);
    t.notOk(gesture.checker(touches[0], touches[0], interactable, element, interaction), 'not allowed with 1 pointer');
    interaction.pointerDown(touches[1], touches[1], element);
    t.ok(gesture.checker(touches[1], touches[1], interactable, element, interaction), 'allowed with 2 pointers');
    interaction.start({ name: ActionName.Gesture }, interactable, element);
    t.deepEqual(interaction.gesture, {
        angle: 0,
        distance: 100,
        scale: 1,
        startAngle: 0,
        startDistance: 100,
    }, 'start interaction properties are correct');
    t.deepEqual(getGestureProps(events[0]), {
        type: 'gesturestart',
        angle: 0,
        distance: 100,
        scale: 1,
        ds: 0,
        da: 0,
    }, 'start event properties are correct');
    // 0
    // |
    // v
    // 1
    utils.extend(touches[1].page, { x: 0, y: 50 });
    interaction.pointerMove(touches[1], touches[1], element);
    t.deepEqual(interaction.gesture, {
        angle: 90,
        distance: 50,
        scale: 0.5,
        startAngle: 0,
        startDistance: 100,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[1]), {
        type: 'gesturemove',
        angle: 90,
        distance: 50,
        scale: 0.5,
        ds: -0.5,
        da: 90,
    }, 'move event properties are correct');
    // 1 <-- 0
    utils.extend(touches[0].page, { x: 50, y: 50 });
    interaction.pointerMove(touches[0], touches[0], element);
    t.deepEqual(interaction.gesture, {
        angle: 180,
        distance: 50,
        scale: 0.5,
        startAngle: 0,
        startDistance: 100,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[2]), {
        type: 'gesturemove',
        angle: 180,
        distance: 50,
        scale: 0.5,
        ds: 0,
        da: 90,
    }, 'move event properties are correct');
    interaction.pointerUp(touches[1], touches[1], element, element);
    t.deepEqual(interaction.gesture, {
        angle: 180,
        distance: 50,
        scale: 0.5,
        startAngle: 0,
        startDistance: 100,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[3]), {
        type: 'gestureend',
        angle: 180,
        distance: 50,
        scale: 0.5,
        ds: 0,
        da: 0,
    }, 'end event properties are correct');
    // 0
    // |
    // v
    // 1
    interaction.pointerDown(touches[1], touches[1], element);
    utils.extend(touches[0].page, { x: 0, y: -150 });
    interaction.pointerMove(touches[1], touches[1], element);
    t.ok(gesture.checker(touches[0], touches[0], interactable, element, interaction), 'not allowed with re-added second pointers');
    interaction.start({ name: ActionName.Gesture }, interactable, element);
    t.deepEqual(interaction.gesture, {
        angle: 90,
        distance: 200,
        scale: 1,
        startAngle: 90,
        startDistance: 200,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[4]), {
        type: 'gesturestart',
        angle: 90,
        distance: 200,
        scale: 1,
        ds: 0,
        da: 0,
    }, 'second start event properties are correct');
    t.equal(events.length, 5, 'correct number of events fired');
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2VzdHVyZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLDRCQUE0QixDQUFBO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUNuRCxPQUFPLEtBQUssT0FBTyxNQUFNLGlDQUFpQyxDQUFBO0FBQzFELE9BQU8sS0FBSyxLQUFLLE1BQU0sbUJBQW1CLENBQUE7QUFDMUMsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFBO0FBRS9CLFNBQVMsZUFBZSxDQUFFLEtBQTRCO0lBQ3BELE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7QUFDcEYsQ0FBQztBQUVELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ2hDLE1BQU0sS0FBSyxHQUFtQixPQUFPLENBQUMsU0FBUyxFQUFFLENBQUE7SUFFakQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUV4QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQTtJQUNwRixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQTtJQUN2RCxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBRW5FLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNULENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDM0MsTUFBTSxLQUFLLEdBQW1CLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUVqRCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXhCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzlDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFBO0lBQ25DLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0RSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFDNUUsTUFBTSxPQUFPLEdBQUc7UUFDZCxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3RELEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDdkQsQ0FBQyxHQUFHLENBQ0gsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDNUMsU0FBUyxFQUFFLEtBQUs7UUFDaEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJO0tBQ25CLENBQUMsSUFBSSxLQUFLLENBQ1osQ0FBQTtJQUNELE1BQU0sTUFBTSxHQUE0QixFQUFFLENBQUE7SUFFMUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDN0MsWUFBWSxDQUFDLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxDQUFDLEtBQTRCLEVBQUUsRUFBRTtRQUN0RixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsVUFBVTtJQUNWLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDN0MsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUUvQyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFFeEQsQ0FBQyxDQUFDLEtBQUssQ0FDTCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFDM0UsNEJBQTRCLENBQzdCLENBQUE7SUFFRCxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFFeEQsQ0FBQyxDQUFDLEVBQUUsQ0FDRixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFDM0UseUJBQXlCLENBQzFCLENBQUE7SUFFRCxXQUFXLENBQUMsS0FBSyxD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VyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBRXRFLENBQUMsQ0FBQyxTQUFTLENBQ1QsV0FBVyxDQUFDLE9BQU8sRUFDbkI7UUFDRSxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxHQUFHO1FBQ2IsS0FBSyxFQUFFLENBQUM7UUFDUixVQUFVLEVBQUUsRUFBRTtRQUNkLGFBQWEsRUFBRSxHQUFHO0tBQ25CLEVBQ0QseUNBQXlDLENBQUMsQ0FBQTtJQUU1QyxDQUFDLENBQUMsU0FBUyxDQUNULGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDMUI7UUFDRSxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxHQUFHO1FBQ2IsS0FBSyxFQUFFLENBQUM7UUFDUixFQUFFLEVBQUUsQ0FBQztRQUNMLEVBQUUsRUFBRSxDQUFDO0tBQ04sRUFDRCwyQ0FBMkMsQ0FBQyxDQUFBO0lBRTlDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQTtJQUUzRCxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ0BpbnRlcmFjdGpzL19kZXYvdGVzdC90ZXN0J1xuaW1wb3J0IHsgQWN0aW9uTmFtZSB9IGZyb20gJ0BpbnRlcmFjdGpzL2NvcmUvc2NvcGUnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ0BpbnRlcmFjdGpzL2NvcmUvdGVzdHMvX2hlbHBlcnMnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICdAaW50ZXJhY3Rqcy91dGlscydcbmltcG9ydCBnZXN0dXJlIGZyb20gJy4vZ2VzdHVyZSdcblxuZnVuY3Rpb24gZ2V0R2VzdHVyZVByb3BzIChldmVudDogSW50ZXJhY3QuR2VzdHVyZUV2ZW50KSB7XG4gIHJldHVybiBoZWxwZXJzLmdldFByb3BzKGV2ZW50LCBbJ3R5cGUnLCAnYW5nbGUnLCAnZGlzdGFuY2UnLCAnc2NhbGUnLCAnZHMnLCAnZGEnXSlcbn1cblxudGVzdCgnZ2VzdHVyZSBhY3Rpb24gaW5pdCcsICh0KSA9PiB7XG4gIGNvbnN0IHNjb3BlOiBJbnRlcmFjdC5TY29wZSA9IGhlbHBlcnMubW9ja1Njb3BlKClcblxuICBzY29wZS51c2VQbHVnaW4oZ2VzdHVyZSlcblxuICB0Lm9rKHNjb3BlLmFjdGlvbnMubmFtZXMuaW5jbHVkZXMoQWN0aW9uTmFtZS5HZXN0dXJlKSwgJ1wiZ2VzdHVyZVwiIGluIGFjdGlvbnMubmFtZXMnKVxuICB0LmVxdWFsKHNjb3BlLmFjdGlvbnMubWV0aG9kRGljdC5nZXN0dXJlLCAnZ2VzdHVyYWJsZScpXG4gIHQuZXF1YWwodHlwZW9mIHNjb3BlLkludGVyYWN0YWJsZS5wcm90b3R5cGUuZ2VzdHVyYWJsZSwgJ2Z1bmN0aW9uJylcblxuICB0LmVuZCgpXG59KVxuXG50ZXN0KCdJbnRlcmFjdGFibGUuZ2VzdHVyYWJsZSBtZXRob2QnLCAodCkgPT4ge1xuICBjb25zdCBzY29wZTogSW50ZXJhY3QuU2NvcGUgPSBoZWxwZXJzLm1vY2tTY29wZSgpXG5cbiAgc2NvcGUudXNlUGx1Z2luKGdlc3R1cmUpXG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBzY29wZS5pbnRlcmFjdGlvbnMubmV3KHt9KVxuICBjb25zdCBlbGVtZW50ID0gc2NvcGUuZG9jdW1lbnQuYm9keVxuICBjb25zdCBpbnRlcmFjdGFibGUgPSBzY29wZS5pbnRlcmFjdGFibGVzLm5ldyhlbGVtZW50KS5nZXN0dXJhYmxlKHRydWUpXG4gIGNvbnN0IHJlY3QgPSBPYmplY3QuZnJlZXplKHsgdG9wOiAxMDAsIGxlZnQ6IDIwMCwgYm90dG9tOiAzMDAsIHJpZ2h0OiA0MDAgfSlcbiAgY29uc3QgdG91Y2hlcyA9IFtcbiAgICB1dGlscy5wb2ludGVyLmNvb3Jkc1RvRXZlbnQodXRpbHMucG9pbnRlci5uZXdDb29yZHMoKSksXG4gICAgdXRpbHMucG9pbnRlci5jb29yZHNUb0V2ZW50KHV0aWxzLnBvaW50ZXIubmV3Q29vcmRzKCkpLFxuICBdLm1hcChcbiAgICAodG91Y2gsIGluZGV4KSA9PiBPYmplY3QuYXNzaWduKHRvdWNoLmNvb3Jkcywge1xuICAgICAgcG9pbnRlcklkOiBpbmRleCxcbiAgICAgIGNsaWVudDogdG91Y2gucGFnZSxcbiAgICB9KSAmJiB0b3VjaFxuICApXG4gIGNvbnN0IGV2ZW50czogSW50ZXJhY3QuR2VzdHVyZUV2ZW50W10gPSBbXVxuXG4gIGludGVyYWN0YWJsZS5yZWN0Q2hlY2tlcigoKSA9PiAoeyAuLi5yZWN0IH0pKVxuICBpbnRlcmFjdGFibGUub24oJ2dlc3R1cmVzdGFydCBnZXN0dXJlbW92ZSBnZXN0dXJlZW5kJywgKGV2ZW50OiBJbnRlcmFjdC5HZXN0dXJlRXZlbnQpID0+IHtcbiAgICBldmVudHMucHVzaChldmVudClcbiAgfSlcblxuICAvLyAwIC0tPiAxXG4gIHV0aWxzLmV4dGVuZCh0b3VjaGVzWzBdLnBhZ2UsIHsgeDogMCwgeTogMCB9KVxuICB1dGlscy5leHRlbmQodG91Y2hlc1sxXS5wYWdlLCB7IHg6IDEwMCwgeTogMCB9KVxuXG4gIGludGVyYWN0aW9uLnBvaW50ZXJEb3duKHRvdWNoZXNbMF0sIHRvdWNoZXNbMF0sIGVsZW1lbnQpXG5cbiAgdC5ub3RPayhcbiAgICBnZXN0dXJlLmNoZWNrZXIodG91Y2hlc1swXSwgdG91Y2hlc1swXSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50LCBpbnRlcmFjdGlvbiksXG4gICAgJ25vdCBhbGxvd2VkIHdpdGggMSBwb2ludGVyJyxcbiAgKVxuXG4gIGludGVyYWN0aW9uLnBvaW50ZXJEb3duKHRvdWNoZXNbMV0sIHRvdWNoZXNbMV0sIGVsZW1lbnQpXG5cbiAgdC5vayhcbiAgICBnZXN0dXJlLmNoZWNrZXIodG91Y2hlc1sxXSwgdG91Y2hlc1sxXSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50LCBpbnRlcmFjdGlvbiksXG4gICAgJ2FsbG93ZWQgd2l0aCAyIHBvaW50ZXJzJyxcbiAgKVxuXG4gIGludGVyYWN0aW9uLnN0YXJ0KHsgbmFtZTogQWN0aW9uTmFtZS5HZXN0dXJlIH0sIGludGVyYWN0YWJsZSwgZWxlbWVudClcblxuICB0LmRlZXBFcXVhbChcbiAgICBpbnRlcmFjdGlvbi5nZXN0dXJlLFxuICAgIHtcbiAgICAgIGFuZ2xlOiAwLFxuICAgICAgZGlzdGFuY2U6IDEwMCxcbiAgICAgIHNjYWxlOiAxLFxuICAgICAgc3RhcnRBbmdsZTogMCxcbiAgICAgIHN0YXJ0RGlzdGFuY2U6IDEwMCxcbiAgICB9LFxuICAgICdzdGFydCBpbnRlcmFjdGlvbiBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICB0LmRlZXBFcXVhbChcbiAgICBnZXRHZXN0dXJlUHJvcHMoZXZlbnRzWzBdKSxcbiAgICB7XG4gICAgICB0eXBlOiAnZ2VzdHVyZXN0YXJ0JyxcbiAgICAgIGFuZ2xlOiAwLFxuICAgICAgZGlzdGFuY2U6IDEwMCxcbiAgICAgIHNjYWxlOiAxLFxuICAgICAgZHM6IDAsXG4gICAgICBkYTogMCxcbiAgICB9LFxuICAgICdzdGFydCBldmVudCBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICAvLyAwXG4gIC8vIHxcbiAgLy8gdlxuICAvLyAxXG4gIHV0aWxzLmV4dGVuZCh0b3VjaGVzWzFdLnBhZ2UsIHsgeDogMCwgeTogNTAgfSlcblxuICBpbnRlcmFjdGlvbi5wb2ludGVyTW92ZSh0b3VjaGVzWzFdLCB0b3VjaGVzWzFdLCBlbGVtZW50KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmdlc3R1cmUsXG4gICAge1xuICAgICAgYW5nbGU6IDkwLFxuICAgICAgZGlzdGFuY2U6IDUwLFxuICAgICAgc2NhbGU6IDAuNSxcbiAgICAgIHN0YXJ0QW5nbGU6IDAsXG4gICAgICBzdGFydERpc3RhbmNlOiAxMDAsXG4gICAgfSxcbiAgICAnbW92ZSBpbnRlcmFjdGlvbiBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICB0LmRlZXBFcXVhbChcbiAgICBnZXRHZXN0dXJlUHJvcHMoZXZlbnRzWzFdKSxcbiAgICB7XG4gICAgICB0eXBlOiAnZ2VzdHVyZW1vdmUnLFxuICAgICAgYW5nbGU6IDkwLFxuICAgICAgZGlzdGFuY2U6IDUwLFxuICAgICAgc2NhbGU6IDAuNSxcbiAgICAgIGRzOiAtMC41LFxuICAgICAgZGE6IDkwLFxuICAgIH0sXG4gICAgJ21vdmUgZXZlbnQgcHJvcGVydGllcyBhcmUgY29ycmVjdCcpXG5cbiAgLy8gMSA8LS0gMFxuICB1dGlscy5leHRlbmQodG91Y2hlc1swXS5wYWdlLCB7IHg6IDUwLCB5OiA1MCB9KVxuICBpbnRlcmFjdGlvbi5wb2ludGVyTW92ZSh0b3VjaGVzWzBdLCB0b3VjaGVzWzBdLCBlbGVtZW50KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmdlc3R1cmUsXG4gICAge1xuICAgICAgYW5nbGU6IDE4MCxcbiAgICAgIGRpc3RhbmNlOiA1MCxcbiAgICAgIHNjYWxlOiAwLjUsXG4gICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgc3RhcnREaXN0YW5jZTogMTAwLFxuICAgIH0sXG4gICAgJ21vdmUgaW50ZXJhY3Rpb24gcHJvcGVydGllcyBhcmUgY29ycmVjdCcpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgZ2V0R2VzdHVyZVByb3BzKGV2ZW50c1syXSksXG4gICAge1xuICAgICAgdHlwZTogJ2dlc3R1cmVtb3ZlJyxcbiAgICAgIGFuZ2xlOiAxODAsXG4gICAgICBkaXN0YW5jZTogNTAsXG4gICAgICBzY2FsZTogMC41LFxuICAgICAgZHM6IDAsXG4gICAgICBkYTogOTAsXG4gICAgfSxcbiAgICAnbW92ZSBldmVudCBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICBpbnRlcmFjdGlvbi5wb2ludGVyVXAodG91Y2hlc1sxXSwgdG91Y2hlc1sxXSwgZWxlbWVudCwgZWxlbWVudClcblxuICB0LmRlZXBFcXVhbChcbiAgICBpbnRlcmFjdGlvbi5nZXN0dXJlLFxuICAgIHtcbiAgICAgIGFuZ2xlOiAxODAsXG4gICAgICBkaXN0YW5jZTogNTAsXG4gICAgICBzY2FsZTogMC41LFxuICAgICAgc3RhcnRBbmdsZTogMCxcbiAgICAgIHN0YXJ0RGlzdGFuY2U6IDEwMCxcbiAgICB9LFxuICAgICdtb3ZlIGludGVyYWN0aW9uIHByb3BlcnRpZXMgYXJlIGNvcnJlY3QnKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGdldEdlc3R1cmVQcm9wcyhldmVudHNbM10pLFxuICAgIHtcbiAgICAgIHR5cGU6ICdnZXN0dXJlZW5kJyxcbiAgICAgIGFuZ2xlOiAxODAsXG4gICAgICBkaXN0YW5jZTogNTAsXG4gICAgICBzY2FsZTogMC41LFxuICAgICAgZHM6IDAsXG4gICAgICBkYTogMCxcbiAgICB9LFxuICAgICdlbmQgZXZlbnQgcHJvcGVydGllcyBhcmUgY29ycmVjdCcpXG5cbiAgLy8gMFxuICAvLyB8XG4gIC8vIHZcbiAgLy8gMVxuICBpbnRlcmFjdGlvbi5wb2ludGVyRG93bih0b3VjaGVzWzFdLCB0b3VjaGVzWzFdLCBlbGVtZW50KVxuICB1dGlscy5leHRlbmQodG91Y2hlc1swXS5wYWdlLCB7IHg6IDAsIHk6IC0xNTAgfSlcbiAgaW50ZXJhY3Rpb24ucG9pbnRlck1vdmUodG91Y2hlc1sxXSwgdG91Y2hlc1sxXSwgZWxlbWVudClcblxuICB0Lm9rKFxuICAgIGdlc3R1cmUuY2hlY2tlcih0b3VjaGVzWzBdLCB0b3VjaGVzWzBdLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQsIGludGVyYWN0aW9uKSxcbiAgICAnbm90IGFsbG93ZWQgd2l0aCByZS1hZGRlZCBzZWNvbmQgcG9pbnRlcnMnLFxuICApXG5cbiAgaW50ZXJhY3Rpb24uc3RhcnQoeyBuYW1lOiBBY3Rpb25OYW1lLkdlc3R1cmUgfSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmdlc3R1cmUsXG4gICAge1xuICAgICAgYW5nbGU6IDkwLFxuICAgICAgZGlzdGFuY2U6IDIwMCxcbiAgICAgIHNjYWxlOiAxLFxuICAgICAgc3RhcnRBbmdsZTogOTAsXG4gICAgICBzdGFydERpc3RhbmNlOiAyMDAsXG4gICAgfSxcbiAgICAnbW92ZSBpbnRlcmFjdGlvbiBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICB0LmRlZXBFcXVhbChcbiAgICBnZXRHZXN0dXJlUHJvcHMoZXZlbnRzWzRdKSxcbiAgICB7XG4gICAgICB0eXBlOiAnZ2VzdHVyZXN0YXJ0JyxcbiAgICAgIGFuZ2xlOiA5MCxcbiAgICAgIGRpc3RhbmNlOiAyMDAsXG4gICAgICBzY2FsZTogMSxcbiAgICAgIGRzOiAwLFxuICAgICAgZGE6IDAsXG4gICAgfSxcbiAgICAnc2Vjb25kIHN0YXJ0IGV2ZW50IHByb3BlcnRpZXMgYXJlIGNvcnJlY3QnKVxuXG4gIHQuZXF1YWwoZXZlbnRzLmxlbmd0aCwgNSwgJ2NvcnJlY3QgbnVtYmVyIG9mIGV2ZW50cyBmaXJlZCcpXG5cbiAgdC5lbmQoKVxufSlcbiJdfQ==