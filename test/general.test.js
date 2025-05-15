// __tests__/general.test.js
// Make sure to place this file in a __tests__ directory or configure Jest to find it.

// Import the class to be tested
import General from '../public/general.js'; // Adjust path if your files are structured differently

// Mocking the DOM environment for tests that interact with it
// JSDOM is typically set up globally by Jest's default environment (jsdom)
// So, document should be available.

describe('General Class', () => {
    let generalInstance;
    let mockContainer;

    beforeEach(() => {
        generalInstance = new General();
        // Create a mock container for DOM manipulations
        mockContainer = document.createElement('div');
        document.body.appendChild(mockContainer); // Append to body so querySelector can find it if needed
    });

    afterEach(() => {
        // Clean up the mock container
        if (mockContainer.parentNode) {
            mockContainer.parentNode.removeChild(mockContainer);
        }
        mockContainer = null;
        // Reset any timers mocked
        jest.useRealTimers();
    });

    test('Constructor initializes properties', () => {
        expect(generalInstance.isLightOff).toBe(true);
        expect(generalInstance.lightIntensity).toBe(5);
        expect(typeof generalInstance.componentsData).toBe('object');
        expect(generalInstance.componentsData).toHaveProperty('hall');
    });

    test('notification(message) returns correct HTML string', () => {
        const message = 'Test Notification';
        const expectedHtml = `
            <div class="notification">
                <p>${message}</p>
            </div>
        `;
        // Normalize whitespace for comparison
        const normalize = (str) => str.replace(/\s+/g, ' ').trim();
        expect(normalize(generalInstance.notification(message))).toBe(normalize(expectedHtml));
    });

    test('renderHTML(element, position, container) inserts HTML', () => {
        const htmlToInsert = '<p id="test-p">Hello</p>';
        generalInstance.renderHTML(htmlToInsert, 'beforeend', mockContainer);
        const insertedElement = mockContainer.querySelector('#test-p');
        expect(insertedElement).not.toBeNull();
        expect(insertedElement.textContent).toBe('Hello');
    });

    test('displayNotification(message, position, container) renders notification', () => {
        generalInstance.displayNotification('General Test', 'beforeend', mockContainer);
        const notificationElement = mockContainer.querySelector('.notification');
        expect(notificationElement).not.toBeNull();
        expect(notificationElement.textContent).toContain('General Test');
    });

    test('removeNotification(element) removes element after timeout', () => {
        jest.useFakeTimers(); // Use Jest's fake timers

        const tempDiv = document.createElement('div');
        tempDiv.className = 'temp-notification';
        mockContainer.appendChild(tempDiv);

        expect(mockContainer.querySelector('.temp-notification')).not.toBeNull();

        generalInstance.removeNotification(tempDiv);

        // Fast-forward time by 5000ms (the timeout in the function)
        jest.advanceTimersByTime(5000);

        expect(mockContainer.querySelector('.temp-notification')).toBeNull();
        jest.clearAllTimers(); // Clear any other timers
    });
});