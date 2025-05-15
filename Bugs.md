# Documented Bugs and Solutions

This document outlines the bugs identified and fixed in the JavaScript files of the smart light application.

## Bug 1: Typo in `main.js`

**Description:** The strict mode directive in `main.js` was misspelled as `'use script'` instead of `'use strict'`.

**Solution:** Corrected the directive to `'use strict'`.

## Bug 2: Incorrect Timeout Duration in `main.js`

**Description:** The `setTimeout` duration for transitioning from the homepage/loader to the main application content was too short (1000ms), causing a visual glitch.

**Solution:** Increased the timeout duration to 6000ms to allow the loader to display for an appropriate time.

## Bug 3: Missing Wifi Handling Logic in `main.js`

**Description:** The `main.js` file was missing the `changeImg` helper function and the event listeners required to handle the toggling and display of the wifi status and connection list in the navigation bar.

**Solution:** Added the `changeImg` function and the necessary event listeners for the navigation and wifi container from the `smart-light-app/main.js` file.

## Bug 4: Incorrect Class Inheritance in `js/advanceSettings.js`

**Description:** The `AdvanceSettings` class in `js/advanceSettings.js` incorrectly inherited from the `Light` class instead of the `General` class.

**Solution:** Changed the class inheritance to `class AdvanceSettings extends General`.

## Bug 5: Issue in `timer` Function in `js/advanceSettings.js`

**Description:** The `timer` function in `js/advanceSettings.js` had issues with its resolution value and an incorrect attempt to set the `isLightOff` property.

**Solution:** Modified the `timer` function to correctly call `this.toggleLightSwitch` to toggle the light and resolve the promise with `true` upon successful execution. Removed the incorrect line attempting to set `isLightOff`.