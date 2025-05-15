// Jest or similar testing framework is recommended for running these tests.
// A testing environment with JSDOM might be needed to simulate the browser environment.

import AdvanceSettings from '../public/advanceSettings.js';
import General from '../public/general.js'; // Assuming General is needed or mocked

// Mock the General class if it's not directly testable or has dependencies
jest.mock('../public/general.js');

describe('advanceSettings.js tests', () => {
  let advanceSettings;

  beforeEach(() => {
    // Clear mock instances and calls before each test
    General.mockClear();
    advanceSettings = new AdvanceSettings();
    // Mock componentsData if necessary for tests
    advanceSettings.componentsData = {
      kitchen: { name: 'kitchen', numOfLights: 3, autoOn: '06:00', autoOff: '22:00', usage: [1, 2, 3, 4, 5, 6, 7] },
      bedroom: { name: 'bedroom', numOfLights: 2, autoOn: '07:00', autoOff: '23:00', usage: [7, 6, 5, 4, 3, 2, 1] },
    };
  });

  test('AdvanceSettings class should extend General', () => {
    expect(advanceSettings).toBeInstanceOf(General);
  });

  test('getSelectedComponent should return all componentsData if no name is provided', () => {
    const components = advanceSettings.getSelectedComponent();
    expect(components).toEqual(advanceSettings.componentsData);
  });

  test('getSelectedComponent should return the correct component by name', () => {
    const kitchenComponent = advanceSettings.getSelectedComponent('kitchen');
    expect(kitchenComponent).toEqual(advanceSettings.componentsData.kitchen);
  });

  test('getSelectedSettings should return markup for the selected component', () => {
    const kitchenMarkup = advanceSettings.getSelectedSettings('kitchen');
    // Basic check for expected content in the markup string
    expect(kitchenMarkup).toContain('Kitchen lights');
    expect(kitchenMarkup).toContain('06:00');
    expect(kitchenMarkup).toContain('22:00');
  });

  test('setNewData should update the specified data for a component', () => {
    const newTime = '08:00';
    advanceSettings.setNewData('kitchen', 'autoOn', newTime);
    expect(advanceSettings.componentsData.kitchen.autoOn).toBe(newTime);
  });

  test('capFirstLetter should capitalize the first letter of a word', () => {
    expect(advanceSettings.capFirstLetter('kitchen')).toBe('Kitchen');
    expect(advanceSettings.capFirstLetter('bedroom')).toBe('Bedroom');
  });

  test('formatTime should return a Date object with correct time', () => {
    const time = '14:30';
    const date = advanceSettings.formatTime(time);
    expect(date).toBeInstanceOf(Date);
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(30);
    expect(date.getSeconds()).toBe(0);
  });

  // Mocking timer and automateLight would require more complex setup,
  // potentially involving fake timers or mocking setInterval.
  // For now, we'll add a placeholder test.
  test.todo('automateLight should set a timer and update light status');

});