import General, { Component } from "./general";

class AdvanceSettings extends General {
    // Assuming componentsData is inherited from General or initialized elsewhere
    // It appears to be an object mapping component names (lowercase string) to Component objects
    constructor () {
        super();
        // Initialize properties if not inherited from General
        // this.componentsData = {};
        // this.isLightOff = false;
    }

    markup (component: Component): string {
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
        `;
    }

    getSelectedComponent (componentName: string): Component | undefined {
        const component = this.componentsData[componentName.toLowerCase()];
        return component;
    }

    getSelectedSettings (componentName: string): string | undefined {
        const selectedComponent = this.getSelectedComponent(componentName);
        if (selectedComponent) {
             return this.markup(selectedComponent);
        }
        return undefined; // Or handle the case where component is not found
    }

    setNewData<K extends keyof Component>(componentName: string, key: K, data: Component[K]): Component[K] | undefined {
        const selectedComponent = this.componentsData[componentName.toLowerCase()];
        if (selectedComponent) {
            // Assert selectedComponent is of type Component within this block
            const component: Component = selectedComponent;
            component[key] = data;
            return component[key];
        }
        return undefined; // Or handle the case where component is not found
    }

    capFirstLetter (word: string): string {
        if (!word) return word;
        return word.replace(word[0]!, word[0]!.toUpperCase());
    }

    getObjectDetails(): this {
        return this;
    }

    formatTime (time: string): Date {
        const [hour, min] = time.split(':');

        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(parseInt(hour, 10));
        dailyAlarmTime.setMinutes(parseInt(min, 10));
        dailyAlarmTime.setSeconds(0);

        return dailyAlarmTime;
    };

    async timer (time: Date, message: boolean, componentName: string): Promise<boolean | undefined> {
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
                    this.isLightOff = false; // This seems inconsistent with the message parameter
                    const component = this.componentsData[componentName];
                    if (component) {
                        component.isLightOff = message;
                        resolve (component.isLightOff);
                    } else {
                        reject(new Error(`Component ${componentName} not found`));
                    }
                }
            };

            // Check every second
            const intervalId = setInterval(checkAndTriggerAlarm, 1000);

            // Optional: Add a mechanism to clear the interval if needed
            // For example, after a certain time or condition is met
            // setTimeout(() => clearInterval(intervalId), 24 * 60 * 60 * 1000); // Clear after 24 hours
        });
    }

    async automateLight (time: string, componentName: string): Promise<boolean | undefined> {
        const formattedTime = this.formatTime(time);
        // Assuming automateLight is intended to turn the light ON at the specified time
        // The `true` message in timer suggests turning the light ON.
        return await this.timer(formattedTime, true, componentName);
    }
}

export default AdvanceSettings;