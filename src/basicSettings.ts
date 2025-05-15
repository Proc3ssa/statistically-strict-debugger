'use strict'

import General from "./general.js";



class Light extends General {
    constructor() {
        super();

    }

    renderHTML (element: string, position: InsertPosition, container: Element) {
        container.insertAdjacentHTML(position, element);
    }

    notification (message: string): string {
        return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;

    }

    displayNotification (message: string, position: InsertPosition, container: Element) {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }

    removeNotification (element: Element) {
        setTimeout(() => {
            element.remove();
        }, 5000);
    }

    lightSwitch (lightButton: Element, dataElement: string, temp: string | null) {
        temp = lightButton.attributes[0].textContent;
        lightButton.setAttribute('src', dataElement);
        if (temp) {
            lightButton.setAttribute('data-lightOn', temp);
        }
    }

}



export default Light;