
import Light from './src/basicSettings.ts';
import AdvanceSettings from './src/advanceSettings.ts';

const homepageButton = document.querySelector<HTMLButtonElement>('.entry_point');
const homepage = document.querySelector<HTMLElement>('main');
const mainRoomsContainer = document.querySelector<HTMLElement>('.application_container');
const advanceFeaturesContainer = document.querySelector<HTMLElement>('.advanced_features_container');
const nav = document.querySelector<HTMLElement>('nav');
const loader = document.querySelector<HTMLElement>('.loader-container');

if (!homepageButton || !homepage || !mainRoomsContainer || !advanceFeaturesContainer || !nav || !loader) {
    console.error("Initialization failed: One or more essential elements not found.");
} else {
    const lightController: Light = new Light();
    const advancedSettings: AdvanceSettings = new AdvanceSettings();




    homepageButton.addEventListener('click', (e: MouseEvent) => {
        lightController.addHidden(homepage);
        lightController.removeHidden(loader); // Show loader

        window.setTimeout(() => {
            lightController.addHidden(loader); // Hide loader after delay
            lightController.removeHidden(mainRoomsContainer); // Show main content
            lightController.removeHidden(nav); // Show nav
        }, 1000);
    });


    mainRoomsContainer.addEventListener('click', (e: MouseEvent) => {
        const targetElement = e.target as Element;

        const lightSwitchButton = targetElement.closest<HTMLButtonElement>(".light-switch");
        if (lightSwitchButton) {
            lightController.toggleLightSwitch(lightSwitchButton);
            return;
        }

        const advancedSettingsBtn = targetElement.closest<HTMLButtonElement>('.advance-settings_modal');
        if (advancedSettingsBtn) {
            advancedSettings.modalPopUp(advancedSettingsBtn);
            return;
        }
    });

    mainRoomsContainer.addEventListener('change', (e: Event) => {
        if (e.target instanceof HTMLInputElement && e.target.type === 'range' && e.target.id === 'light_intensity') {
             const slider = e.target;
             const value = slider.value; // Value is string
             lightController.handleLightIntensitySlider(slider, value);
        }
    });

    advanceFeaturesContainer.addEventListener('click', (e: MouseEvent) => {
        const targetElement = e.target as Element;

        if (targetElement.closest('.close-btn')) {
            advancedSettings.closeModalPopUp();
            return;
        }

        const customizationBtn = targetElement.closest<HTMLButtonElement>('.customization-btn');
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