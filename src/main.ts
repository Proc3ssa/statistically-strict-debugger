'use script'
// basics settings element
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const nav = document.querySelector('nav');

const loader = document.querySelector('.loader-container')



// helper variables
const wifiConnection = [
    {id: 0, wifiName: 'Processor connect', signal: 'excellent'},
    {id: 1, wifiName: 'Faisal123', signal: 'poor'},
    {id: 2, wifiName: 'Training', signal: 'good'},
    {id: 3, wifiName: 'Frontend', signal: 'good'},
]


// imports
import Light from './basicSettings.js';
import AdvanceSettings from './advanceSettings.js';
import { Chart } from 'chart.js';

// object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();

// global variables
let selectedComponent: string | undefined;
let isWifiActive = true;



// helper functions
const gridLightButtonFunctionality = function(lightButton: Element, notificationMessage: string) {

    let dataElement = (lightButton as HTMLImageElement).dataset.lighton;
    let temp: string | undefined;
    const roomElement = lightButton.closest('.rooms');
    const roomName = roomElement?.querySelector('p')?.textContent;

    if (roomName) {
        lightController.lightSwitch(lightButton, dataElement!, temp!);

        const message = `${roomName} ${notificationMessage}`;

        if (mainRoomsContainer) {
            lightController.displayNotification(message, 'afterend', mainRoomsContainer);
        }

        const notificationElement = document.querySelector('.notification');
        if (notificationElement) {
            lightController.removeNotification(notificationElement);
        }
    }

    return;
}


// Event handlers
// go to menu/rooms after button is clicked
homepageButton?.addEventListener('click', function(e) {
    homepage?.classList.add('hidden');
    loader?.classList.remove('hidden')

    setTimeout(() => {
        mainRoomsContainer?.classList.remove('hidden');
        nav?.classList.remove('hidden');
    }, 6000);
})

// handling events in the nav section
nav?.addEventListener('click', function(e) {
    const current = e.target as Element;
    // toggling wifi network
    if (current?.closest('.network-container')) {
        const img = document.querySelector('.img_svg-container > img');
        const statusMessage = document.querySelector('.wifi_notification > p')

        if (isWifiActive) {
            isWifiActive = false;
            if (img) changeImg(img as HTMLImageElement);
            const message = 'Wifi is currently off'
            if (mainRoomsContainer) {
                lightController.displayNotification(message, 'afterend', mainRoomsContainer);
            }
            const notificationElement = document.querySelector('.notification');
            if (notificationElement) {
                lightController.removeNotification(notificationElement);
            }
            return;
        }
        if (!isWifiActive) {
            isWifiActive = true;
            if (img) changeImg(img as HTMLImageElement);
            const message = 'Wifi network now is active'
             if (mainRoomsContainer) {
                lightController.displayNotification(message, 'afterend', mainRoomsContainer);
            }
            const notificationElement = document.querySelector('.notification');
            if (notificationElement) {
                lightController.removeNotification(notificationElement);
            }
            return;
        }
    }

    // toggling light switch
    if (current?.closest('.general_light_switch')) {
        const generalSwitchButton = current.closest('.general_light_switch');
        const generalSwitchImg = generalSwitchButton?.querySelector('img');
        const allLightButtons = document.querySelectorAll('.basic_settings_buttons > button:first-child img');

        if (!generalSwitchImg) return;

        const isGeneralLightOn = generalSwitchImg.getAttribute('src') === './assets/svgs/light_bulb.svg';

        allLightButtons.forEach(lightButton => {
            const componentImg = lightButton.closest('.rooms')?.querySelector(':first-child') as HTMLImageElement | null;
            const slider = lightButton.closest('.basic_settings')?.querySelector('input') as HTMLInputElement | null;

            if (!componentImg || !slider) return;

            if (isGeneralLightOn) {
                // Turn all lights off
                lightButton.setAttribute('src', './assets/svgs/light_bulb_off.svg');
                lightButton.setAttribute('data-lightOn', './assets/svgs/light_bulb.svg');
                (lightButton as HTMLElement).style.filter = `drop-shadow(0 0 0)`;
                componentImg.style.filter = `brightness(0)`;
                slider.value = '0'; // Slider value is string
                lightController.isLightOff = true;
                lightController.lightIntensity = 0;
            } else {
                // Turn all lights on
                lightButton.setAttribute('src', './assets/svgs/light_bulb.svg');
                lightButton.setAttribute('data-lightOn', './assets/svgs/light_bulb_off.svg');
                (lightButton as HTMLElement).style.filter = `drop-shadow(0 0 5px #ffd600)`;
                componentImg.style.filter = `brightness(0.5)`;
                slider.value = '5'; // Slider value is string
                lightController.isLightOff = false;
                lightController.lightIntensity = 5;
            }
        });

        // Toggle the general switch button image
        const generalSwitchDataElement = generalSwitchImg.dataset.lighton;
        let temp: string | undefined;
        lightController.lightSwitch(generalSwitchImg, generalSwitchDataElement!, temp!);


        const message = isGeneralLightOn ? 'All lights are off' : 'All lights are on';
        if (mainRoomsContainer) {
            lightController.displayNotification(message, 'afterend', mainRoomsContainer);
        }
        const notificationElement = document.querySelector('.notification');
        if (notificationElement) {
            lightController.removeNotification(notificationElement);
        }
    }

})



// main app activities
mainRoomsContainer?.addEventListener('click', function (e) {
     // when wifi is off disable lights
    if (!isWifiActive) return;

    const targetElement = e.target as Element;

    if (targetElement?.closest('.basic_settings_buttons > button:first-child')) {
        const lightButton = targetElement.closest('.basic_settings_buttons > button:first-child')?.querySelector('img') as HTMLImageElement | null;
        const componentImg = targetElement.closest('.rooms')?.querySelector(':first-child') as HTMLImageElement | null;
        const slider = targetElement.closest('.basic_settings')?.querySelector('input') as HTMLInputElement | null;

        if (!lightButton || !componentImg || !slider) return;

        if (lightButton.getAttribute('src') === './assets/svgs/light_bulb.svg') {
            lightController.isLightOff = true;
            lightController.lightIntensity = 0

            slider.value = '0'; // Slider value is string

            lightButton.style.filter = `drop-shadow(0 0 0)`;
            componentImg.style.filter = `brightness(0)`;
            gridLightButtonFunctionality(lightButton, 'lights are off')
            return;
        }

        lightController.lightIntensity = 5;
        slider.value = '5'; // Slider value is string

        lightButton.style.filter = `drop-shadow(0 0 ${lightController.lightIntensity}px #ffd600)`;
        componentImg.style.filter = `brightness(${lightController.lightIntensity / 10})`;
        lightController.isLightOff = false;
        gridLightButtonFunctionality(lightButton, 'lights are on');
        return;

    };

    // expanding additional functionalities or advance settings
    if (targetElement?.closest('.basic_settings_buttons > button:last-child')) {
        const advancedFeaturesContainer = document.querySelector('.advanced_features_container');
        advancedFeaturesContainer?.classList.remove('hidden');

        selectedComponent = targetElement.closest('.rooms')?.querySelector('p')?.textContent?.toLowerCase();

        const markup = advancedSettings.getSelectedSettings(selectedComponent);


        const container = document.querySelector('.advanced_features')

        if (container) {
            advancedSettings.renderHTML(markup, 'beforeend', container);
        }


        // getting specific component's data
        if (selectedComponent && advancedSettings.componentsData[selectedComponent as keyof typeof advancedSettings.componentsData]) {
             const data = advancedSettings.componentsData[selectedComponent as keyof typeof advancedSettings.componentsData].usage;

            // handling line graph
            const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;
            if (ctx) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
                      datasets: [{
                        label: 'Hours of usage',

                        data: data,
                        borderWidth: 1
                      }]
                    },
                    options: {
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }
                  });
            }
        }


    };

    // handle wifi
    if (targetElement?.closest('.img_svg-container')) {
        let wifiParentContainer = targetElement.closest('.wifi-container');
        let wifiStatusMessage = wifiParentContainer?.querySelector('.wifi_notification p');
        const connectionListContainer = wifiParentContainer?.querySelector('.wifi_connection_list_container');

        if (!wifiStatusMessage || !connectionListContainer) return;

        wifiStatusMessage.classList.toggle('hidden');

        if (!wifiStatusMessage.classList.contains('hidden')) {

            const statusMessage = isWifiActive ? 'Wifi connections available' : 'Wifi is currently not available'
            wifiStatusMessage.textContent = statusMessage;
        }

        if (wifiStatusMessage.classList.contains('hidden')) {
            const wifiLists = (wifiStatusMessage.closest('.wifi-container')?.querySelector('.wifi_connection_list_container')?.children);

            if (wifiLists) {
                [...wifiLists].forEach(list => {
                    list.remove();
                })
            }


            wifiStatusMessage.parentElement?.classList.remove('wifi-active');
            connectionListContainer.classList.add('hidden');


        } else {
            // rendering wifi to dom
                wifiConnection.forEach(connection => {
                    const availableWifiConnectionMarkup =
                    `
                        <div class="wifi_connections_list">
                            <p>${connection.wifiName}</p>
                            <img src="./assets/svgs/wifi_signal_${connection.signal !== 'excellent' ? (connection.signal === 'poor' ? 'poor' : 'good') : 'excellent'}.svg" alt="wifi signal svg icon">
                        </div>
                    `;

                    if (wifiStatusMessage.parentElement?.previousElementSibling) {
                         lightController.renderHTML(availableWifiConnectionMarkup, 'afterbegin', wifiStatusMessage.parentElement.previousElementSibling)
                    }


            })
            wifiStatusMessage.parentElement?.classList.add('wifi-active');
            connectionListContainer.classList.remove('hidden');

        }



    }
})

// handling wifi on mouse hover
const mainWifiContainer = document.querySelector('.wifi-container');
mainWifiContainer?.addEventListener('mouseenter', function(e) {
    const status = document.querySelector('.wifi_notification > p');

    const message = isWifiActive ? 'Wifi connections available' : 'Wifi is currently not available'

    if (status) {
        status.textContent = message;
        status.classList.remove('hidden');
    }


})
mainWifiContainer?.addEventListener('mouseleave',function(e) {
    const status = document.querySelector('.wifi_notification > p');
    const connectionListContainer = document.querySelector('.wifi_connection_list_container');

    if (!connectionListContainer?.classList.contains('hidden') || !status) return;
    status.classList.add('hidden');

})


// when the slider is moved
mainRoomsContainer?.addEventListener('change', function(e) {
    // when wifi is off disable lights
    if (!isWifiActive) return;

    const targetElement = e.target as Element;

    if (!targetElement?.closest('.slider')) return;

    const slider = targetElement.closest('.slider')?.querySelector('input') as HTMLInputElement | null;
    const componentImg = targetElement.closest('.rooms')?.querySelector(':first-child') as HTMLImageElement | null;
    const lightSwitch = targetElement.closest('.basic_settings')?.querySelector('.basic_settings_buttons button:first-child img') as HTMLImageElement | null;

    if (!slider || !componentImg || !lightSwitch) return;

    const intensity = parseInt(slider.value); // Parse slider value to number
    lightController.lightIntensity = intensity;


    if (intensity >= 1) {
        lightSwitch.setAttribute('src', "./assets/svgs/light_bulb.svg")
        lightSwitch.setAttribute('data-lightOn', "./assets/svgs/light_bulb_off.svg")
        lightController.isLightOff = false;
    } else {
        lightSwitch.setAttribute('src', "./assets/svgs/light_bulb_off.svg")
        lightSwitch.setAttribute('data-lightOn', "./assets/svgs/light_bulb.svg")
        lightController.isLightOff = true;
    }


    lightSwitch.style.filter = `drop-shadow(${0} ${0} ${intensity}px #ffd600)`;
    componentImg.style.filter = `brightness(${intensity / 10})`;


})


// Advance settings
const advancedFeaturesContainer = document.querySelector('.advanced_features_container');
const closeButton = document.querySelector('.close-btn');

advancedFeaturesContainer?.addEventListener('click', async function(e) {
    // console.log(advancedSettings);
    const currentElement = e.target as Element;

    if (currentElement?.closest('.customization-btn')) {
        const element = document.querySelector('.customization-details')
        element?.classList.toggle('hidden');

        return;
    }

    if (currentElement?.textContent === 'Okay') {
        const inputElement = currentElement.parentElement?.parentElement?.querySelector('input') as HTMLInputElement | null;
        if (!inputElement) return;
        const { value } = inputElement;
        if (value === '') return;
        inputElement.value = '';
        console.log(selectedComponent);

        if (currentElement.classList.contains('defaultOn-okay')) {
            let timeElement = currentElement.closest('.advanced_features')?.querySelector('.auto_on span:last-child');

            if (selectedComponent) {
                const updatedTime = advancedSettings.setNewData(selectedComponent, 'autoOn', value)

                if (timeElement) {
                    timeElement.textContent = updatedTime;
                }

                const response = await advancedSettings.automateLight(updatedTime, selectedComponent);


                if (response) {

                    const slider = document.querySelector('input[type="range"]') as HTMLInputElement | null;
                    const element = document.querySelector(`.${selectedComponent}`);

                    if (slider) {
                         slider.value = lightController.lightIntensity.toString(); // Slider value is string
                    }


                }

                console.log(advancedSettings.automateLight(updatedTime, selectedComponent));
            }


            return;
        }
        if (currentElement.classList.contains('defaultOff-okay')) {
            let timeElement = currentElement.closest('.advanced_features')?.querySelector('.auto_off span:last-child');

            if (selectedComponent) {
                const updatedTime = advancedSettings.setNewData(selectedComponent, 'autoOff', value)
                 if (timeElement) {
                    timeElement.textContent = updatedTime;
                }
            }

            return;
        }



        //notification
    }
    if (currentElement?.textContent === 'Cancel') {
        const inputElement = currentElement.parentElement?.parentElement?.querySelector('input') as HTMLInputElement | null;
        if (inputElement) {
            inputElement.value = '';
        }
        return;
    }



})

closeButton?.addEventListener('click', function() {
    const parent = document.querySelector('.advanced_features');
    if (parent && parent.firstElementChild) {
        parent.replaceChildren(parent.firstElementChild);
    }
    advancedFeaturesContainer?.classList.add('hidden');
})

const changeImg = function(element: HTMLImageElement) {
    let temp: string | null, next: string | null;

    temp = element.attributes[0].value;
    next = element.attributes[2].value;

    if (next) {
        element.src = next;
    }
    if (temp) {
        element.setAttribute('data-altWifiImg', temp);
    }
}