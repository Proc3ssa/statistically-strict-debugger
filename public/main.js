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

// object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();

// global variables
let selectedComponent;
let isWifiActive = true;



// helper functions
const gridLightButtonFunctionality = function(lightButton, notificationMessage) {
    
    let dataElement = lightButton.dataset.lighton;
    let temp;
    const roomName = lightButton.closest('.rooms').querySelector('p').textContent;
    
    lightController.lightSwitch(lightButton, dataElement, temp);

            const message = `${roomName} ${notificationMessage}`;
            
            lightController.displayNotification(message, 'afterend', mainRoomsContainer);

            lightController.removeNotification(document.querySelector('.notification'));
            
            return;
}


// Event handlers
// go to menu/rooms after button is clicked
homepageButton.addEventListener('click', function(e) {
    homepage.classList.add('hidden');
    loader.classList.remove('hidden')
    
    setTimeout(() => {
        mainRoomsContainer.classList.remove('hidden');
        nav.classList.remove('hidden');
    }, 6000);
})

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
        const generalSwitchButton = current.closest('.general_light_switch');
        const generalSwitchImg = generalSwitchButton.querySelector('img');
        const allLightButtons = document.querySelectorAll('.basic_settings_buttons > button:first-child img');
        const isGeneralLightOn = generalSwitchImg.getAttribute('src') === './assets/svgs/light_bulb.svg';

        allLightButtons.forEach(lightButton => {
            const componentImg = lightButton.closest('.rooms').querySelector(':first-child');
            const slider = lightButton.closest('.basic_settings').querySelector('input');

            if (isGeneralLightOn) {
                // Turn all lights off
                lightButton.setAttribute('src', './assets/svgs/light_bulb_off.svg');
                lightButton.setAttribute('data-lightOn', './assets/svgs/light_bulb.svg');
                lightButton.style.filter = `drop-shadow(0 0 0)`;
                componentImg.style.filter = `brightness(0)`;
                slider.value = 0;
                lightController.isLightOff = true;
                lightController.lightIntensity = 0;
            } else {
                // Turn all lights on
                lightButton.setAttribute('src', './assets/svgs/light_bulb.svg');
                lightButton.setAttribute('data-lightOn', './assets/svgs/light_bulb_off.svg');
                lightButton.style.filter = `drop-shadow(0 0 5px #ffd600)`;
                componentImg.style.filter = `brightness(0.5)`;
                slider.value = 5;
                lightController.isLightOff = false;
                lightController.lightIntensity = 5;
            }
        });

        // Toggle the general switch button image
        const generalSwitchDataElement = generalSwitchImg.dataset.lighton;
        let temp;
        lightController.lightSwitch(generalSwitchImg, generalSwitchDataElement, temp);


        const message = isGeneralLightOn ? 'All lights are off' : 'All lights are on';
        lightController.displayNotification(message, 'afterend', mainRoomsContainer);
        lightController.removeNotification(document.querySelector('.notification'));
    }
    
})



// main app activities
mainRoomsContainer.addEventListener('click', function (e) {
     // when wifi is off disable functionality
    if (!isWifiActive) return;

    if (e.target.closest('.basic_settings_buttons > button:first-child')) {
        const lightButton = e.target;
        const componentImg = lightButton.closest('.rooms').querySelector(':first-child');
        const slider = lightButton.closest('.basic_settings').querySelector('input');
        
        
        if (lightButton.getAttribute('src') === './assets/svgs/light_bulb.svg') {
            lightController.isLightOff = true;
            lightController.lightIntensity = 0
            
            slider.value = lightController.lightIntensity;
            
            lightButton.style.filter = `drop-shadow(0 0 0)`;
            componentImg.style.filter = `brightness(0)`;
            gridLightButtonFunctionality(lightButton, 'lights are off')
            return;
        }
        
        lightController.lightIntensity = 5;
        slider.value = lightController.lightIntensity;
        
        lightButton.style.filter = `drop-shadow(0 0 ${lightController.lightIntensity}px #ffd600)`; 
        componentImg.style.filter = `brightness(${lightController.lightIntensity / 10})`;
        lightController.isLightOff = false;
        gridLightButtonFunctionality(lightButton, 'lights are on');
        return;

    };

    // expanding additional functionalities or advance settings
    if (e.target.closest('.basic_settings_buttons > button:last-child')) {
        e.target.closest('body').querySelector('.advanced_features_container').classList.remove('hidden');

        selectedComponent = e.target.closest('.rooms').querySelector('p').textContent.toLowerCase();

        const markup = advancedSettings.getSelectedSettings(selectedComponent);

        
        const container = document.querySelector('.advanced_features')
        
        advancedSettings.renderHTML(markup, 'beforeend', container);

        // getting specific component's data
        const data = advancedSettings.componentsData[selectedComponent].usage;
        
        // handling line graph 
        const ctx = document.getElementById('myChart');
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

    };
    
    // handle wifi 
    if (e.target.closest('.img_svg-container')) {
        let wifiParentContainer = e.target.closest('.wifi-container');
        let wifiStatusMessage = wifiParentContainer.querySelector('.wifi_notification p');
        const connectionListContainer = wifiParentContainer.querySelector('.wifi_connection_list_container');

        
        wifiStatusMessage.classList.toggle('hidden');
        
        if (!wifiStatusMessage.classList.contains('hidden')) {
           
            const statusMessage = isWifiActive ? 'Wifi connections available' : 'Wifi is currently not available'
            wifiStatusMessage.textContent = statusMessage;
        }

        if (wifiStatusMessage.classList.contains('hidden')) {
            const wifiLists = (wifiStatusMessage.closest('.wifi-container').querySelector('.wifi_connection_list_container').children);

            [...wifiLists].forEach(list => {
                list.remove();
            })

            wifiStatusMessage.parentElement.classList.remove('wifi-active');
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

                    lightController.renderHTML(availableWifiConnectionMarkup, 'afterbegin', wifiStatusMessage.parentElement.previousElementSibling)
                
                
            })
            wifiStatusMessage.parentElement.classList.add('wifi-active');
            connectionListContainer.classList.remove('hidden');

        }
        

        
    }
})

// handling wifi on mouse hover
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


// when the slider is moved
mainRoomsContainer.addEventListener('change', function(e) {
    // when wifi is off disable lights
    if (!isWifiActive) return;

    if (!e.target.closest('.slider')) return;
    
    const slider = e.target;
    const componentImg = slider.closest('.rooms').querySelector(':first-child');
    const lightSwitch = slider.closest('.basic_settings').querySelector('.basic_settings_buttons button:first-child img');

    const intensity = slider.value;
    lightController.lightIntensity = slider.value;


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

advancedFeaturesContainer.addEventListener('click', async function(e) {
    // console.log(advancedSettings);
    const currentElement = e.target;

    if (currentElement.closest('.customization-btn')) {
        const element = document.querySelector('.customization-details')
        element.classList.toggle('hidden');
 
        return;
    }
    
    if (currentElement.textContent === 'Okay') {
        const inputElement = currentElement.parentElement.parentElement.querySelector('input');
        const { value } = inputElement;
        if (value === '') return;
        inputElement.value = '';
        console.log(selectedComponent);
        
        if (currentElement.classList.contains('defaultOn-okay')) {
            let timeElement = currentElement.closest('.advanced_features').querySelector('.auto_on span:last-child');

            const updatedTime = advancedSettings.setNewData(selectedComponent, 'autoOn', value)
            
            timeElement.textContent = updatedTime;
            const response = await advancedSettings.automateLight(updatedTime, selectedComponent);

           
            if (response) {
                
                const slider = document.querySelector('input[type="range"]');
                const element = document.querySelector(`.${selectedComponent}`);

               

                slider.value = lightController.lightIntensity;

                
                
            }

            console.log(advancedSettings.automateLight(updatedTime, selectedComponent));

            
            return;
        }
        if (currentElement.classList.contains('defaultOff-okay')) {
            let timeElement = currentElement.closest('.advanced_features').querySelector('.auto_off span:last-child');

            const updatedTime = advancedSettings.setNewData(selectedComponent, 'autoOff', value)
            timeElement.textContent = updatedTime;
            return;
        }


        

        //notification 
    }
    if (currentElement.textContent === 'Cancel') {
        const inputElement = currentElement.parentElement.parentElement.querySelector('input');
        inputElement.value = '';
        return;
    }

    

})

closeButton.addEventListener('click', function() {
    const parent = document.querySelector('.advanced_features');
    parent.replaceChildren(parent.firstElementChild); 
    advancedFeaturesContainer.classList.add('hidden');
})

const changeImg = function(element) {
    let temp, next;

    temp = element.attributes[0].value;
    next = element.attributes[2].value;

    element.src = next;
    element.setAttribute('data-altWifiImg', temp);
}




