"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicSettings_js_1 = __importDefault(require("./basicSettings.js"));
const advanceSettings_js_1 = __importDefault(require("./advanceSettings.js"));
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');
if (!homepageButton || !homepage || !mainRoomsContainer || !advanceFeaturesContainer || !nav || !loader) {
    console.error("Initialization failed: One or more essential elements not found.");
}
else {
    const lightController = new basicSettings_js_1.default();
    const advancedSettings = new advanceSettings_js_1.default();
    homepageButton.addEventListener('click', (e) => {
        lightController.addHidden(homepage);
        lightController.removeHidden(loader); // Show loader
        window.setTimeout(() => {
            lightController.addHidden(loader); // Hide loader after delay
            lightController.removeHidden(mainRoomsContainer); // Show main content
            lightController.removeHidden(nav); // Show nav
        }, 1000);
    });
    mainRoomsContainer.addEventListener('click', (e) => {
        const targetElement = e.target;
        const lightSwitchButton = targetElement.closest(".light-switch");
        if (lightSwitchButton) {
            lightController.toggleLightSwitch(lightSwitchButton);
            return;
        }
        const advancedSettingsBtn = targetElement.closest('.advance-settings_modal');
        if (advancedSettingsBtn) {
            advancedSettings.modalPopUp(advancedSettingsBtn);
            return;
        }
    });
    mainRoomsContainer.addEventListener('change', (e) => {
        if (e.target instanceof HTMLInputElement && e.target.type === 'range' && e.target.id === 'light_intensity') {
            const slider = e.target;
            const value = slider.value; // Value is string
            lightController.handleLightIntensitySlider(slider, value);
        }
    });
    advanceFeaturesContainer.addEventListener('click', (e) => {
        const targetElement = e.target;
        if (targetElement.closest('.close-btn')) {
            advancedSettings.closeModalPopUp();
            return;
        }
        const customizationBtn = targetElement.closest('.customization-btn');
        if (customizationBtn) {
            advancedSettings.displayCustomization(customizationBtn);
            return;
        }
        if (targetElement.matches('.defaultOn-okay')) {
            advancedSettings.customizeAutomaticOnPreset(targetElement);
            return;
        }
        if (targetElement.matches('.defaultOff-okay')) {
            advancedSettings.customizeAutomaticOffPreset(targetElement);
            return;
        }
        if (targetElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(targetElement, '.defaultOn');
            return;
        }
        if (targetElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(targetElement, '.defaultOff');
            return;
        }
    });
    Object.values(lightController.componentsData).forEach(component => {
        lightController.setComponentElement(component);
    });
}
