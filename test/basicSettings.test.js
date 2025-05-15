// __tests__/basicSettings.test.js
// Make sure to place this file in a __tests__ directory

import Light from '../public/basicSettings.js'; // Adjust path

describe('Light Class (BasicSettings)', () => {
    let lightInstance;
    let mockContainer;

    beforeEach(() => {
        lightInstance = new Light();
        mockContainer = document.createElement('div');
        document.body.appendChild(mockContainer);
    });

    afterEach(() => {
        if (mockContainer.parentNode) {
            mockContainer.parentNode.removeChild(mockContainer);
        }
        mockContainer = null;
        jest.useRealTimers();
    });

    test('Constructor (inherits from General)', () => {
        expect(lightInstance.isLightOff).toBe(true); // from General
        expect(lightInstance.componentsData).toHaveProperty('bedroom'); // from General
    });

    test('notification(message) returns specific HTML string for Light', () => {
        const message = 'Light Specific Notification';
        const expectedHtml = `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;
        const normalize = (str) => str.replace(/\s+/g, ' ').trim();
        expect(normalize(lightInstance.notification(message))).toBe(normalize(expectedHtml));
    });

    test('displayNotification(message, position, container) uses Light\'s notification', () => {
        lightInstance.displayNotification('Light Display Test', 'beforeend', mockContainer);
        const notificationElement = mockContainer.querySelector('.notification');
        expect(notificationElement).not.toBeNull();
        expect(notificationElement.querySelector('img[src="./assets/svgs/checked.svg"]')).not.toBeNull();
        expect(notificationElement.textContent).toContain('Light Display Test');
    });

    test('lightSwitch(lightButton, dataElement, temp) modifies attributes', () => {
        const mockLightButton = document.createElement('img');
        // Set initial attributes. The original code's reliance on attributes[0].textContent is fragile.
        // A better approach in the source code would be getAttribute/setAttribute for specific attribute names.
        // For this test, we'll mock it as closely as possible.
        mockLightButton.setAttribute('src', 'initial_src.svg');
        mockLightButton.setAttribute('data-lighton', 'some_other_src.svg');

        // To simulate attributes[0].textContent:
        // Jest's JSDOM environment might not populate .attributes NodeList in a way that attributes[0] is always 'src'.
        // We'll directly test the effect: setting 'src' and 'data-lighton'.
        // The original function: temp = lightButton.attributes[0].textContent;
        // lightButton.setAttribute('src', dataElement);
        // lightButton.setAttribute('data-lightOn', temp);

        // To make the test pass according to the original logic, we can spy on setAttribute
        // or simplify the assertion to what it *should* do.
        // Let's assume attributes[0].textContent would indeed be the value of the 'src' attribute before change.
        const originalSrc = mockLightButton.getAttribute('src');
        const dataElementValue = 'new_src.svg';
        let tempValueHolder; // The 'temp' in the function is local.

        // We can't directly test the 'temp' variable assignment without modifying the original function.
        // So we test the outcome.
        lightInstance.lightSwitch(mockLightButton, dataElementValue, tempValueHolder);

        expect(mockLightButton.getAttribute('src')).toBe(dataElementValue);
        expect(mockLightButton.getAttribute('data-lighton')).toBe(originalSrc); // Because temp would have held the original 'src'
    });
});
