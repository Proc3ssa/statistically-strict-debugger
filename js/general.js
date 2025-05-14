class General {
    componentsData = {
        hall: { name: 'hall', numOfLights: 6, isLightOff: false, autoOn: '06:30', autoOff: '22:00', usage: [22, 11, 12, 10, 12, 17, 22] }, 
        bedroom: { name: 'bedroom', numOfLights: 3, isLightOff: true, autoOn: '06:30', autoOff: '22:00', usage: [18, 5, 7, 5, 6, 6, 18] },
        bathroom: { name: 'bathroom', numOfLights: 1, isLightOff: true, autoOn: '06:30', autoOff: '22:00', usage: [2, 1, 1, 1, 1, 3, 3] },
        ['outdoor lights']: { name: 'outdoor lights', numOfLights: 6, isLightOff: true, autoOn: '06:30', autoOff: '22:00', usage: [15, 12, 13, 9, 12, 13, 18] },
        ['guest room']: { name: 'guest room', numOfLights: 4, isLightOff: true, autoOn: '06:30', autoOff: '22:00', usage: [12, 10, 3, 9, 5, 5, 18] },
        kitchen: { name: 'kitchen', numOfLights: 3, isLightOff: true, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 11, 12, 13, 18] },
        [['walkway & corridor']]: { name: 'walkway & corridor', numOfLights: 8, isLightOff: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 15, 22, 23, 18] },
    }

    constructor () {
        // this.autoOn = autoOn;
        // this.autoOff = autoOff;
        this.isLightOff = true;
        this.lightIntensity = 5;
    }

    renderHTML (element, position, container) {
        container.insertAdjacentHTML(position, element);
    }

    notification (message) {
        return `
            <div class="notification">
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

}

export default General