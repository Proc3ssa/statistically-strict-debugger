// Jest or similar testing framework is recommended for running these tests.
// A testing environment with JSDOM might be needed to simulate the browser environment.

import Light from '../public/basicSettings.js';
import General from '../public/general.js'; // Assuming General is needed or mocked

// Mock the General class if it's not directly testable or has dependencies
jest.mock('../public/general.js');

describe('basicSettings.js tests', () => {
  let light;

  beforeEach(() => {
    // Clear mock instances and calls before each test
    General.mockClear();
    light = new Light();
  });

  test('Light class should extend General', () => {
    expect(light).toBeInstanceOf(General);
  });

  // Add tests for methods in public/basicSettings.js here.
  // For example, testing renderHTML, notification, displayNotification, removeNotification, lightSwitch.

  test('renderHTML should call insertAdjacentHTML', () => {
    const mockContainer = { insertAdjacentHTML: jest.fn() };
    const element = '<div>test</div>';
    const position = 'beforeend';
    light.renderHTML(element, position, mockContainer);
    expect(mockContainer.insertAdjacentHTML).toHaveBeenCalledWith(position, element);
  });

  test('notification should return correct HTML string', () => {
    const message = 'Test message';
    const expectedHtml = `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;
    expect(light.notification(message).replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });

  // Add more tests for other methods...
});