'use strict'

import General from "./general.js";

// basics settings element
// const allRooms = document.querySelectorAll('.rooms');
// const mainRoomsContainer = document.querySelector('.application_container');
// const basicSettings = document.querySelector('.basic_settings');
// const basicSettingsButtons = document.querySelectorAll('.basic_settings_buttons');

class Light extends General {
    constructor() {
        super();
        // this.isLightOff = true;
        // this.lightIntensity = 5;
    }

    renderHTML (element, position, container) {
        container.insertAdjacentHTML(position, element);
    }

    notification (message) {
        return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;

    }

    displayNotification (message, position, container) {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }

    removeNotification (element) {
        setTimeout(() => {
            element.remove();
        }, 5000);
    }

    lightSwitch (lightButton, dataElement, temp) {
        temp = lightButton.attributes[0].textContent;
        lightButton.setAttribute('src', dataElement);
        lightButton.setAttribute('data-lightOn', temp);
    }

}



export default Light;