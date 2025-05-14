'use strict'

import General from "./general.js";

class AdvanceSettings extends General {
    constructor () {
        super();

    }

    markup (component) {
        const {name, numOfLights, autoOn, autoOff} = component;
        return `
            <section class="component_summary">
                <div>
                    <p class"component_name">${this.capFirstLetter(name)} lights</p>
                    <p class="number_of_lights">${numOfLights}</p>
                </div>
                <div>

                    <p class="auto_on">
                        <span>Automatic turn on:</span>
                        <span>${autoOn}</span>
                    </p>
                    <p class="auto_off">
                        <span>Automatic turn off:</span>
                        <span>${autoOff}</span>
                    </p>
                </div>
            </section>
            <section class="customization">
                <div class="edit">
                    <p>Customize</p>
                    <button class="customization-btn">
                        <img src="./assets/svgs/edit.svg" alt="customize settings svg icon">
                    </button>
                </div>
                <section class="customization-details hidden">
                    <div>
                        <h4>Automatic on/off settings</h4>
                        <div class="defaultOn">
                            <label for="">Turn on</label>
                            <input type="time" name="autoOnTime" id="autoOnTime">
                            <div>
                                <button class="defaultOn-okay">Okay</button>
                                <button class="defaultOn-cancel">Cancel</button>
                            </div>
                        </div>
                        <div class="defaultOff">
                            <label for="">Go off</label>
                            <input type="time" name="autoOffTime" id="autoOffTime">
                            <div>
                                <button class="defaultOff-okay">Okay</button>
                                <button class="defaultOff-cancel">Cancel</button>
                            </div>
                        </div>

                    </div>
                </section>
                <section class="summary">
                    <h3>Summary</h3>
                    <div class="chart-container">
                        <canvas id="myChart"></canvas>
                    </div>
                </section>
            </section>
        `
    }

    getSelectedComponent (componentName) {
        if (!componentName) return this.componentsData;
        const component = this.componentsData[componentName.toLowerCase()];
        return component;
    }

    getSelectedSettings (componentName) {
        // if (!componentName) return this.componentsData;
        // const component = this.componentsData[componentName.toLowerCase()];
        // return this.markup(component);
        return this.markup(this.getSelectedComponent(componentName));

    }

    setNewData (component, key, data) {
        const selectedComponent = this.componentsData[component.toLowerCase()];
        return selectedComponent[key] = data;
    }

    capFirstLetter (word) {
        return word.replace(word.at(0), word.at(0).toUpperCase())
    }

    getObjectDetails() {
        return this;
    }

    formatTime (time) {
        const [hour, min] = time.split(':');
        
        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(hour); 
        dailyAlarmTime.setMinutes(min);
        dailyAlarmTime.setSeconds(0);
        
        return dailyAlarmTime;
    };

    async timer (time, message, component) {
        return new Promise ((resolve, reject) => {
            const checkAndTriggerAlarm = () => {
                const now = new Date();
                console.log(time, now);
                if (
                    now.getHours() === time.getHours() &&
                    now.getMinutes() === time.getMinutes() &&
                    now.getSeconds() === time.getSeconds()
                ) {
                    console.log(message);
                    this.isLightOff = false;
                    this.componentsData[component].isLightOff = message;
                    resolve (this.componentsData[component].isLightOff)
                }
            }
        
            // Check every second
            setInterval(checkAndTriggerAlarm, 1000);

        })
    }

    async automateLight (time, component) {
        const formattedTime = this.formatTime(time);
        return await this.timer(formattedTime, true, component);
        
    }


}

export default AdvanceSettings;