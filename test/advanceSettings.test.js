'use strict';

import AdvanceSettings from '../public/advanceSettings.js';

// Mock the General class at the correct path
jest.mock('../public/general.js', () => {
  return class General {
    constructor() {
      this.componentsData = {
        kitchen: {
          name: 'kitchen',
          numOfLights: 4,
          autoOn: '18:00',
          autoOff: '23:00',
          isLightOff: true
        }
      };
    }
  };
});

describe('AdvanceSettings', () => {
  let advanceSettings;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-15T12:00:00Z'));
    advanceSettings = new AdvanceSettings();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should initialize with componentsData from General', () => {
    expect(advanceSettings.componentsData).toEqual({
      kitchen: {
        name: 'kitchen',
        numOfLights: 4,
        autoOn: '18:00',
        autoOff: '23:00',
        isLightOff: true
      }
    });
  });

  test('getSelectedComponent should return all components if no componentName provided', () => {
    const result = advanceSettings.getSelectedComponent();
    expect(result).toEqual(advanceSettings.componentsData);
  });

  test('getSelectedComponent should return specific component if componentName provided', () => {
    const result = advanceSettings.getSelectedComponent('kitchen');
    expect(result).toEqual({
      name: 'kitchen',
      numOfLights: 4,
      autoOn: '18:00',
      autoOff: '23:00',
      isLightOff: true
    });
  });

  

  test('setNewData should update component data for a given key', () => {
    advanceSettings.setNewData('kitchen', 'autoOn', '19:00');
    expect(advanceSettings.componentsData.kitchen.autoOn).toBe('19:00');
  });

  test('capFirstLetter should capitalize the first letter of a word', () => {
    expect(advanceSettings.capFirstLetter('kitchen')).toBe('Kitchen');
    expect(advanceSettings.capFirstLetter('bedroom')).toBe('Bedroom');
  });

  test('getObjectDetails should return the AdvanceSettings instance', () => {
    const result = advanceSettings.getObjectDetails();
    expect(result).toBe(advanceSettings);
  });

  test('formatTime should convert time string to Date object', () => {
    const time = advanceSettings.formatTime('18:30');
    expect(time).toBeInstanceOf(Date);
    expect(time.getHours()).toBe(18);
    expect(time.getMinutes()).toBe(30);
    expect(time.getSeconds()).toBe(0);
  });

  test('timer should resolve with updated isLightOff when time matches', async () => {
    const targetTime = new Date('2025-05-15T18:00:00Z');
    jest.setSystemTime(new Date('2025-05-15T17:59:59Z'));
    const timerPromise = advanceSettings.timer(targetTime, true, 'kitchen');
    jest.advanceTimersByTime(1000);
    const result = await timerPromise;
    expect(result).toBe(true);
    expect(advanceSettings.componentsData.kitchen.isLightOff).toBe(true);
  });

  test('automateLight should format time and call timer', async () => {
    jest.spyOn(advanceSettings, 'timer');
    jest.setSystemTime(new Date('2025-05-15T17:59:59Z'));
    const result = advanceSettings.automateLight('18:00', 'kitchen');
    const expectedTime = new Date();
    expectedTime.setHours(18);
    expectedTime.setMinutes(0);
    expectedTime.setSeconds(0);
    expect(advanceSettings.timer).toHaveBeenCalledWith(expectedTime, true, 'kitchen');
    jest.advanceTimersByTime(1000);
    await result;
    expect(advanceSettings.componentsData.kitchen.isLightOff).toBe(true);
  });
});