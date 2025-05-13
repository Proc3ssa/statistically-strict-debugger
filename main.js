'use strict'
// elements declarations
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');

// imports
import Light from './js/basicSettings.js';
import AdvanceSettings from './js/advanceSettings.js';

// object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();

// global variables
let selectedComponent;
let isWifiActive = true;

// Event handlers
// hide homepage after button is clicked
homepageButton.addEventListener('click', function(e) {
    lightController.addHidden(homepage);
    lightController.removeHidden(loader);
    
    setTimeout(() => {
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    }, 6000);
})


mainRoomsContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;

    // when click occurs on light switch
    if (selectedElement.closest(".light-switch")) {
        const lightSwitch = selectedElement.closest(".basic_settings_buttons").firstElementChild;
        lightController.toggleLightSwitch(lightSwitch);
        return;
    }

    // when click occurs on advance modal
    if (selectedElement.closest('.advance-settings_modal')) {
        const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal');
        advancedSettings.modalPopUp(advancedSettingsBtn);
    }
});

mainRoomsContainer.addEventListener('change', (e) => {
    const slider = e.target;
    const value = slider.value;

    lightController.handleLightIntensitySlider(slider, value);
    
})

// advance settings modal
advanceFeaturesContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;

    if (selectedElement.closest('.close-btn')) {
       advancedSettings.closeModalPopUp()
    }

    // display customization markup
    if (selectedElement.closest('.customization-btn')) {
        advancedSettings.displayCustomization(selectedElement);
    }

    // set light on time customization
    if (selectedElement.matches('.defaultOn-okay')) {
        advancedSettings.customizeAutomaticOnPreset(selectedElement);
    }
    
    // set light off time customization
    if (selectedElement.matches('.defaultOff-okay')) {
        advancedSettings.customizeAutomaticOffPreset(selectedElement);
    }

    // cancel light time customization
    if (selectedElement.textContent.includes("Cancel")) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        } else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});
// helper functions
const changeImg = function(element) {
    let temp, next;

    temp = element.attributes[0].value;
    next = element.attributes[2].value;

    element.src = next;
    element.setAttribute('data-altWifiImg', temp);
}


// handling events in the nav section
nav.addEventListener('click', function(e) {
    const current = e.target;
    // toggling wifi network
    if (current.closest('.network-container')) {
        const img = document.querySelector('.img_svg-container > img');
        const statusMessage = document.querySelector('.wifi_notification > p')

        if (isWifiActive) {
            isWifiActive = false;
            changeImg(img);
            const message = 'Wifi is currently off'
            lightController.displayNotification(message, 'afterend', mainRoomsContainer);
            lightController.removeNotification(document.querySelector('.notification'));
            return;
        }
        if (!isWifiActive) {
            isWifiActive = true;
            changeImg(img);
            const message = 'Wifi network now is active'
            lightController.displayNotification(message, 'afterend', mainRoomsContainer);
            lightController.removeNotification(document.querySelector('.notification'));
            return;
        }
    }

    // toggling light switch
    if (current.closest('.general_light_switch')) {
        const message = `Feature not accessible yet.
                         This feature is a general switch for all components.`

        lightController.displayNotification(message, 'afterend', mainRoomsContainer)
        lightController.removeNotification(document.querySelector('.notification'));
    }

})


// handing wifi on mouse hover
const mainWifiContainer = document.querySelector('.wifi-container');
mainWifiContainer.addEventListener('mouseenter', function(e) {
    const status = document.querySelector('.wifi_notification > p');

    const message = isWifiActive ? 'Wifi connections available' : 'Wifi is currently not available'

    status.textContent = message;
    status.classList.remove('hidden');

})
mainWifiContainer.addEventListener('mouseleave',function(e) {
    const status = document.querySelector('.wifi_notification > p');
    const connectionListContainer = document.querySelector('.wifi_connection_list_container');

    if (!connectionListContainer.classList.contains('hidden')) return;
    status.classList.add('hidden');

})

