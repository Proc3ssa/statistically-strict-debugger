'use script'
// basics settings element
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const nav = document.querySelector('nav');
// const basicSettings = document.querySelector('.basic_settings');
// const basicSettingsButtons = document.querySelectorAll('.basic_settings_buttons');
// const allRooms = document.querySelectorAll('.rooms');
// const mainWifiContainer = document.querySelector('.wifi-container');

const loader = document.querySelector('.loader-container')

// advanced settings elements


// helper variables
const wifiConnection = [
    {id: 0, wifiName: 'Inet service', signal: 'excellent'},
    {id: 1, wifiName: 'Kojo_kwame121', signal: 'poor'},
    {id: 2, wifiName: 'spicyalice', signal: 'good'},
    {id: 3, wifiName: 'virus', signal: 'good'},
]


// imports
import Light from './js/basicSettings.js';
import AdvanceSettings from './js/advanceSettings.js';

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
// hidden homepage after button is clicked
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
        const message = `Feature not accessible yet.
                         This feature is a general switch for all components.`

        lightController.displayNotification(message, 'afterend', mainRoomsContainer)
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
        
        
        /** alternating light display */
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

        // console.log(advancedSettings, selectedComponent);
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
                // data: [12, 19, 3, 5, 2, 3, 8],
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
    
    // handing wifi
    if (e.target.closest('.img_svg-container')) {
        let wifiParentContainer = e.target.closest('.wifi-container');
        let wifiStatusMessage = wifiParentContainer.querySelector('.wifi_notification p');
        const connectionListContainer = wifiParentContainer.querySelector('.wifi_connection_list_container');

        // toggling wifi status message - when on/off
        wifiStatusMessage.classList.toggle('hidden');
        
        if (!wifiStatusMessage.classList.contains('hidden')) {
            // console.log(isWifiActive);
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
    // when wifi is off disable functionality
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

/**default settings / customize
 * @10:00pm the bedroom lights go off => time to sleep
 * @6:30am the bedroom lights turn on => time to wake up
 * {
 *  component: bedroom,
 *  numberOfLights: 3,
 *  isLightOff: true,
 *  defaultTimeOff: 10:00pm,
 *  defaultTimeOn: 6:30am,
 *  
 * }
 * 
 * @6:00pm the outside lights turn on => it's evening
 * @6:00am the outside lights go off => it's morning
 * 
 */

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

            // console.log(response);
            if (response) {
                // console.log('hi');

                // console.log(lightController);
                const slider = document.querySelector('input[type="range"]');
                const element = document.querySelector(`.${selectedComponent}`);

                // console.log(element)

                // console.log(slider);

                slider.value = lightController.lightIntensity;

                // lightController.lightIntensity = 5;
                // slider.value = lightController.lightIntensity;
                
                // lightButton.style.filter = `drop-shadow(0 0 ${lightController.lightIntensity}px #ffd600)`; 
                // componentImg.style.filter = `brightness(${lightController.lightIntensity / 10})`;
                // lightController.isLightOff = false;
                // gridLightButtonFunctionality(lightButton, 'lights are on');
                // return;
                
            }

            console.log(advancedSettings.automateLight(updatedTime, selectedComponent));

            // advancedSettings.automateLight(updatedTime);


            // console.log(lightController.componentsData[selectedComponent].isLightOff);
            
            return;
        }
        if (currentElement.classList.contains('defaultOff-okay')) {
            let timeElement = currentElement.closest('.advanced_features').querySelector('.auto_off span:last-child');

            const updatedTime = advancedSettings.setNewData(selectedComponent, 'autoOff', value)
            timeElement.textContent = updatedTime;
            return;
        }


        // return;

        // there should be a notification popup
    }
    if (currentElement.textContent === 'Cancel') {
        const inputElement = currentElement.parentElement.parentElement.querySelector('input');
        inputElement.value = '';
        return;
    }

    

})

closeButton.addEventListener('click', function() {
    const parent = document.querySelector('.advanced_features');
    parent.replaceChildren(parent.firstElementChild); // remove children elements expect the first child
    advancedFeaturesContainer.classList.add('hidden');
})

// const time = (advancedSettings.componentsData.bathroom.autoOn);
// // advancedSettings.automateLight(time);
// const formattedTime = advancedSettings.formatTime(time);

// const timer = function (time, message) {
//     // console.log(time)
//     function checkAndTriggerAlarm() {
//         const now = new Date();
//         // console.log(formattedTime, now);
//         if (
//             now.getHours() === time.getHours() &&
//             now.getMinutes() === time.getMinutes() &&
//             now.getSeconds() === time.getSeconds()
//         ) {
//             console.log(message);

//             // lightController.componentsData
    
//             lightController.lightIntensity = 5;
//             slider.value = lightController.lightIntensity;
            
//             lightButton.style.filter = `drop-shadow(0 0 ${lightController.lightIntensity}px #ffd600)`; 
//             componentImg.style.filter = `brightness(${lightController.lightIntensity / 10})`;
//             lightController.isLightOff = false;
//             gridLightButtonFunctionality(lightButton, 'lights are on');
//             return;
//             // this.isLightOff = false;
//             // if (!lightController.isLightOff) {
//             // }
//         }
//     }
    
//     // Check every second
//     setInterval(checkAndTriggerAlarm, 1000);
    
// }
// timer(formattedTime, 'hello...')

// const wifiLogo = document.querySelector('.img_svg-container > img');
// function to dynamical change image element with dataset
const changeImg = function(element) {
    let temp, next;

    temp = element.attributes[0].value;
    next = element.attributes[2].value;

    element.src = next;
    element.setAttribute('data-altWifiImg', temp);
}

// changeImg(wifiLogo);







// console.log(advancedSettings.componentsData.bathroom.autoOn)
// const time = advancedSettings.formatTime('9:23');
// advancedSettings.timer(time, 'Hello welcome')

/**
 * when i set the time, the clock or setInterval function function would keep tract and call the callback fn when the time is up
 */


/**
 * a function that is waiting to execute a functionality
 * the function waits for multiple components or data object
 */

// console.log(advancedSettings.getObjectDetails());
// const date = new Date();
// const hours = date.getHours();
// const mins = date.getMinutes();

// const changeToSeconds = function(time) {

//     const [hours, mins] = time.split(':');
    
//     const hourToSeconds = +hours * 60 * 60;
//     const minsToSeconds = +mins * 60;

//     return hourToSeconds + minsToSeconds;
// }

// // console.log(changeToSeconds('01:02'))
// // console.log(new Date('17:35'))

// // console.log(new Date(Date.now()))

// const getCurrentTimeInSeconds = function() {
//     const now = Date.now();
//     const date = new Date(now);
//     const hours = date.getHours();
//     const mins = date.getMinutes();

//     const time = `${hours}:${mins}`;
//     // console.log(time);

//     const seconds = changeToSeconds(time)
//     // console.log(seconds);

//     return seconds;


// }

// // console.log(getCurrentTimeInSeconds())

// const difference = changeToSeconds('17:31') - getCurrentTimeInSeconds();
// const toMilliseconds = difference * 1000;
// // console.log(difference, toMilliseconds);


// setTimeout(() => {
//     console.log('time up...')
// }, toMilliseconds);


// const timer = new Date()
// console.log(timer);
// const hour = timer.getHours();
// const min = timer.getMinutes();


/**test function */
// function setRepeatingAlarm(time, message) {
//     function checkAndTriggerAlarm() {
//         const now = new Date();
//         if (
//             now.getHours() === time.getHours() &&
//             now.getMinutes() === time.getMinutes() 
            
//             // &&
//             // now.getSeconds() === time.getSeconds()
//         ) {
//             console.log(message);
//         }
//     }

//     // Check every second
//     setInterval(checkAndTriggerAlarm, 1000);
// }

// // Example usage:
// const dailyAlarmTime = new Date();
// dailyAlarmTime.setHours(21); // 2 PM
// dailyAlarmTime.setMinutes(59);
// // dailyAlarmTime.setSeconds(0);

// setRepeatingAlarm(dailyAlarmTime, 'This is your daily alarm!');


// const formatTime = function(time) {
//     const [hour, min] = time.split(':');
    
//     const dailyAlarmTime = new Date();
//     dailyAlarmTime.setHours(hour); 
//     dailyAlarmTime.setMinutes(min);
//     // dailyAlarmTime.setSeconds(0);
//     console.log(dailyAlarmTime);
//     return dailyAlarmTime;
// }
// console.log(formatTime('9:10'))

// const time = '11:32';
// const timeTaken = new Date();
// console.log(timeTaken.setHours(11))
// console.log(timeTaken.setHours('11'))


