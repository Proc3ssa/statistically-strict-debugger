
import { Chart, ChartConfiguration, registerables } from 'chart.js/auto';
Chart.register(...registerables);

import Light from './basicSettings.js';
import { ComponentData } from './general.js';


class AdvanceSettings extends Light {

    private activeChartInstance: Chart | null = null;

    constructor() {
        super();
    }

    private generateMarkup(component: ComponentData): string {
        const { name, numOfLights, autoOn, autoOff } = component;
        return `
        <div class="advanced_features">
            <button class="close-btn top-right-close"> <img src="./assets/svgs/close.svg" alt="close button svg icon">
            </button>
            <h3>Advanced features</h3>
            <section class="component_summary">
                <div>
                    <p class="component_name">${this.capFirstLetter(name)}</p>
                    <p class="number_of_lights">${numOfLights} Lights</p> </div>
                <div>
                    <p class="auto_on">
                        <span>Automatic turn on:</span>
                        <span>${autoOn || 'Not set'}</span> </p>
                    <p class="auto_off">
                        <span>Automatic turn off:</span>
                        <span>${autoOff || 'Not set'}</span> </p>
                </div>
            </section>
            <section class="customization">
                <div class="edit">
                    <p>Customize</p>
                    <button class="customization-btn" aria-label="Customize automatic settings"> <img src="./assets/svgs/edit.svg" alt="customize settings svg icon">
                    </button>
                </div>
                <section class="customization-details hidden">
                    <h4>Automatic on/off settings</h4>
                    <div class="defaultOn setting-group"> <label for="autoOnTime">Turn on at:</label> <input type="time" name="autoOnTime" id="autoOnTime" value="${autoOn || ''}"> <div>
                            <button class="defaultOn-okay">Okay</button>
                            <button class="defaultOn-cancel">Cancel</button>
                        </div>
                    </div>
                    <div class="defaultOff setting-group"> <label for="autoOffTime">Turn off at:</label> <input type="time" name="autoOffTime" id="autoOffTime" value="${autoOff || ''}"> <div>
                            <button class="defaultOff-okay">Okay</button>
                            <button class="defaultOff-cancel">Cancel</button>
                        </div>
                    </div>
                </section>
            </section> <section class="summary">
                 <h3>Usage Summary (Last 7 Days)</h3>
                 <div class="chart-container" style="position: relative; height:200px; width:100%"> <canvas id="myChart"></canvas>
                 </div>
             </section>
            </div>
        `;
    }

    private displayUsageAnalytics(usageData: number[]): void {
        const ctx = this.selector<HTMLCanvasElement>('#myChart');
        if (!ctx) {
            console.error('Canvas element #myChart not found.');
            return;
        }

        if (this.activeChartInstance) {
            this.activeChartInstance.destroy();
            this.activeChartInstance = null;
        }


        const chartConfig: ChartConfiguration = {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Hours of usage',
                    data: usageData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Important for sizing with container
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                             display: true,
                             text: 'Hours'
                         }
                    }
                },
                plugins: {
                     legend: {
                         position: 'top',
                     },
                     tooltip: {
                         enabled: true
                     }
                }
            }
        };

        this.activeChartInstance = new Chart(ctx, chartConfig);
    }


    modalPopUp(triggerElement: Element): void {
        const selectedRoomName = this.getSelectedComponentName(triggerElement);
        if (!selectedRoomName) {
            console.error("Could not determine room name from trigger element:", triggerElement);
            return;
        }

        const componentData = this.getComponent(selectedRoomName);
        if (!componentData) {
            console.error(`Component data not found for room: ${selectedRoomName}`);
            return;
        }

        const parentElement = this.selector<HTMLElement>('.advanced_features_container');
        if (!parentElement) {
            console.error('Advanced features container not found.');
            return;
        }

        parentElement.innerHTML = '';

        this.renderHTML(this.generateMarkup(componentData), 'afterbegin', parentElement);
        this.removeHidden(parentElement);

        const usage = Array.isArray(componentData.usage) ? componentData.usage : [];
        this.displayUsageAnalytics(usage);
    }

    displayCustomization(selectedElement: Element): void {
        const detailsSection = selectedElement.closest('.customization')?.querySelector<HTMLElement>('.customization-details');
        if (detailsSection) {
            this.toggleHidden(detailsSection);
        } else {
             console.warn("Could not find customization details section.");
        }
    }

    closeModalPopUp(): void {
        const parentElement = this.selector<HTMLElement>('.advanced_features_container');
        const childElement = this.selector<HTMLElement>('.advanced_features');

         if (this.activeChartInstance) {
            this.activeChartInstance.destroy();
            this.activeChartInstance = null;
        }


        if (childElement) {
             childElement.remove();
        }
        if (parentElement) {
             this.addHidden(parentElement);
        }
    }

    customizationCancelled(selectedElement: Element, parentSelectorIdentifier: string): void {
        const inputElement = this.closestSelector<HTMLInputElement>(selectedElement, parentSelectorIdentifier, 'input[type="time"]');
        if (inputElement) {
             const component = this.getComponentData(inputElement, '.advanced_features', '.component_name');
             if(component){
                 const originalValue = parentSelectorIdentifier === '.defaultOn' ? component.autoOn : component.autoOff;
                 inputElement.value = originalValue || '';
             } else {
                inputElement.value = '';
             }
        }
    }

    private updateAutoTime(selectedElement: Element, timeType: 'autoOn' | 'autoOff', parentSelector: '.defaultOn' | '.defaultOff'): void {
         const inputElement = this.closestSelector<HTMLInputElement>(selectedElement, parentSelector, 'input[type="time"]');
        if (!inputElement) return;

        const { value } = inputElement;

        if (!value || !/^\d{2}:\d{2}$/.test(value)) {
            console.warn("Invalid or empty time value provided.");
            return;
        }

        const component = this.getComponentData(inputElement, '.advanced_features', '.component_name');
        if (!component) {
            console.error("Could not find component data to update time.");
            return;
        }

        component[timeType] = value;

        const displaySelector = timeType === 'autoOn' ? '.auto_on > span:last-child' : '.auto_off > span:last-child';
        const spanElement = this.selector<HTMLSpanElement>(displaySelector);
        if (spanElement) {
            this.updateMarkupValue(spanElement, value);
        } else {
             console.warn(`Could not find span element ('${displaySelector}') to update time display.`);
        }



        console.log(`Set ${timeType} for ${component.name} to ${value}`);
        this.scheduleLightAutomation(component);


    }

     customizeAutomaticOnPreset(selectedElement: Element): void {
        this.updateAutoTime(selectedElement, 'autoOn', '.defaultOn');
    }

    customizeAutomaticOffPreset(selectedElement: Element): void {
         this.updateAutoTime(selectedElement, 'autoOff', '.defaultOff');
    }


    capFirstLetter(word: string): string {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    private formatTimeStringToDate(time: string): Date | null {
        if (!time || !/^\d{2}:\d{2}$/.test(time)) return null;
        const [hour, min] = time.split(':').map(Number);

        const targetTime = new Date();
        targetTime.setHours(hour, min, 0, 0); // Set hours, minutes, seconds, ms
        return targetTime;
    }

    private getTimeDifference(targetTime: Date): number {
        const now = new Date();
        let difference = targetTime.getTime() - now.getTime();

        if (difference < 0) {
             targetTime.setDate(targetTime.getDate() + 1); // Move to tomorrow
             difference = targetTime.getTime() - now.getTime();
         }
        return difference;
    }


    private automationTimeouts: { [key: string]: { on?: number; off?: number } } = {};


    private scheduleLightAutomation(component: ComponentData): void {
         const componentKey = component.name.toLowerCase();


         if (this.automationTimeouts[componentKey]?.on) {
             clearTimeout(this.automationTimeouts[componentKey].on);
         }
         if (this.automationTimeouts[componentKey]?.off) {
             clearTimeout(this.automationTimeouts[componentKey].off);
         }
         this.automationTimeouts[componentKey] = {};


         this.setComponentElement(component);
         const lightElement = component.element;


         if (!lightElement) {
             console.warn(`Cannot automate ${component.name}: light element not found.`);
             return;
         }


         const onTimeDate = this.formatTimeStringToDate(component.autoOn);
         if (onTimeDate) {
             const onDifference = this.getTimeDifference(onTimeDate);
             if (onDifference > 0) {
                 console.log(`Scheduling ${component.name} to turn ON in ${onDifference / 1000}s`);
                 this.automationTimeouts[componentKey].on = window.setTimeout(() => {
                     const currentComponentState = this.getComponent(component.name);
                      if (currentComponentState && !currentComponentState.isLightOn) {
                           console.log(`Auto turning ON ${component.name}`);
                           this.toggleLightSwitch(lightElement);
                      }
                     this.scheduleLightAutomation(component);
                 }, onDifference);
             }
         }


         const offTimeDate = this.formatTimeStringToDate(component.autoOff);
         if (offTimeDate) {
             const offDifference = this.getTimeDifference(offTimeDate);
             if (offDifference > 0) {
                  console.log(`Scheduling ${component.name} to turn OFF in ${offDifference / 1000}s`);
                 this.automationTimeouts[componentKey].off = window.setTimeout(() => {
                      const currentComponentState = this.getComponent(component.name);
                      if (currentComponentState && currentComponentState.isLightOn) {
                            console.log(`Auto turning OFF ${component.name}`);
                            this.toggleLightSwitch(lightElement);
                      }
                     this.scheduleLightAutomation(component);
                 }, offDifference);
             }
         }
    }


    async timer(time: Date, turnOn: boolean, component: ComponentData): Promise<void> {


        return new Promise<void>((resolve) => {
            const checkAndTriggerAlarm = () => {
                const now = new Date();
                if (
                    now.getHours() === time.getHours() &&
                    now.getMinutes() === time.getMinutes() &&
                    now.getSeconds() === time.getSeconds()
                ) {
                    console.log(`Timer matched for ${component.name}: ${turnOn ? 'ON' : 'OFF'}`);
                    if (component.element) {
                         const currentState = this.getComponent(component.name);
                         if (currentState && currentState.isLightOn !== turnOn) {
                             this.toggleLightSwitch(component.element);
                         }
                    } else {
                         console.warn(`Element not found for component ${component.name} during timer trigger.`);
                    }
                    clearInterval(intervalId);
                    resolve();
                }
            };

            const intervalId = setInterval(checkAndTriggerAlarm, 1000);
        });
    }

    async automateLight(timeString: string, component: ComponentData, turnOn: boolean): Promise<void> {
        const formattedTime = this.formatTimeStringToDate(timeString);
        if (formattedTime && component.element) {
             console.log(`Automating ${component.name} to turn ${turnOn ? 'ON' : 'OFF'} at ${timeString}`);
             await this.timer(formattedTime, turnOn, component);
        } else {
             console.warn(`Could not automate ${component.name}: Invalid time or missing element.`);
        }
    }


}

export default AdvanceSettings;