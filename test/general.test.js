// Jest or similar testing framework is recommended for running these tests.
// A testing environment with JSDOM might be needed to simulate the browser environment.

import General from '../public/general.js';

describe('general.js tests', () => {
  let general;

  beforeEach(() => {
    general = new General();
  });

  test('General class should be instantiated', () => {
    expect(general).toBeInstanceOf(General);
  });

  test('componentsData should be initialized correctly', () => {
    expect(general.componentsData).toBeDefined();
    expect(Object.keys(general.componentsData).length).toBe(7); // Check the number of components
    expect(general.componentsData.hall.name).toBe('hall');
    expect(general.componentsData.bedroom.numOfLights).toBe(3);
  });

  test('isLightOff and lightIntensity should be initialized correctly', () => {
    expect(general.isLightOff).toBe(true);
    expect(general.lightIntensity).toBe(5);
  });

  test('renderHTML should call insertAdjacentHTML', () => {
    const mockContainer = { insertAdjacentHTML: jest.fn() };
    const element = '<div>test</div>';
    const position = 'beforeend';
    general.renderHTML(element, position, mockContainer);
    expect(mockContainer.insertAdjacentHTML).toHaveBeenCalledWith(position, element);
  });

  test('notification should return correct HTML string', () => {
    const message = 'Test message';
    const expectedHtml = `
            <div class="notification">
                <p>${message}</p>
            </div>
        `;
    expect(general.notification(message).replace(/\s/g, '')).toBe(expectedHtml.replace(/\s/g, ''));
  });

  test('displayNotification should call notification and renderHTML', () => {
    const message = 'Test message';
    const mockContainer = { insertAdjacentHTML: jest.fn() };
    const notificationSpy = jest.spyOn(general, 'notification');
    const renderHTMLSpy = jest.spyOn(general, 'renderHTML');

    general.displayNotification(message, 'afterend', mockContainer);

    expect(notificationSpy).toHaveBeenCalledWith(message);
    expect(renderHTMLSpy).toHaveBeenCalled();
    notificationSpy.mockRestore();
    renderHTMLSpy.mockRestore();
  });

  test('removeNotification should call element.remove after a delay', () => {
    jest.useFakeTimers();
    const mockElement = { remove: jest.fn() };
    general.removeNotification(mockElement);
    expect(mockElement.remove).not.toHaveBeenCalled();
    jest.advanceTimersByTime(5000);
    expect(mockElement.remove).toHaveBeenCalled();
    jest.useRealTimers();
  });
});