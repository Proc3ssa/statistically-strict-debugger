
import General, { ComponentData } from "./general.js";

class Light extends General {
    constructor() {
        super();
    }

    notification(message: string): string {
        return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;
    }

    displayNotification(message: string, position: InsertPosition, container: Element): void {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
        const notificationElement = container.lastElementChild;
        if (notificationElement) {
             this.removeNotification(notificationElement);
        }
    }

    removeNotification(element: Element): void {
        setTimeout(() => {
            element.remove();
        }, 5000);
    }

    private lightSwitchOn(lightButtonImage: HTMLImageElement): void {
        lightButtonImage.setAttribute('src', './assets/svgs/light_bulb.svg');
    }

    private lightSwitchOff(lightButtonImage: HTMLImageElement): void {
        lightButtonImage.setAttribute('src', './assets/svgs/light_bulb_off.svg');
    }

    private lightComponentSelectors(lightButtonElement: Element): {
        roomName: string | null;
        componentData: ComponentData | undefined;
        childImage: HTMLImageElement | null;
        background: HTMLImageElement | null;
    } {
        const roomName = this.getSelectedComponentName(lightButtonElement);
        const componentData = roomName ? this.getComponent(roomName) : undefined;
        const childImage = lightButtonElement.querySelector<HTMLImageElement>('img');
        const background = this.closestSelector<HTMLImageElement>(lightButtonElement, '.rooms', 'img.room_background');

        return { roomName, componentData, childImage, background };
    }

    toggleLightSwitch(lightButtonElement: HTMLButtonElement): void {
        const { componentData: component, childImage, background } = this.lightComponentSelectors(lightButtonElement);
        const slider = this.closestSelector<HTMLInputElement>(lightButtonElement, '.rooms', 'input[type="range"]#light_intensity');

        if (!component || !childImage || !background || !slider) {
            console.warn("Could not toggle light: Missing component data, image, background, or slider.", { component, childImage, background, slider });
            return;
        }

        component.isLightOn = !component.isLightOn;

        if (component.isLightOn) {
            this.lightSwitchOn(childImage);
            component.lightIntensity = component.lightIntensity > 0 ? component.lightIntensity : 5;
            const brightness = component.lightIntensity / 10;
            this.handleLightIntensity(background, brightness);
            slider.value = String(component.lightIntensity);
        } else {
            this.lightSwitchOff(childImage);
            this.handleLightIntensity(background, 0);
            slider.value = String(component.lightIntensity);
        }
    }

    handleLightIntensitySlider(sliderElement: HTMLInputElement, intensityStr: string): void {
        const { componentData, background, childImage } = this.lightComponentSelectors(sliderElement);
        const lightSwitchButton = this.closestSelector<HTMLButtonElement>(sliderElement, '.rooms', '.light-switch');


        const intensity = Number(intensityStr);
         if (isNaN(intensity) || !componentData || !background || !lightSwitchButton || !childImage) {
             console.warn("Invalid intensity or missing elements for slider.", { intensityStr, componentData, background, lightSwitchButton, childImage});
             return;
         }


        componentData.lightIntensity = intensity;
        const brightness = intensity / 10;

        this.handleLightIntensity(background, brightness);

        if (intensity === 0) {
            if (componentData.isLightOn) {
                 componentData.isLightOn = false;
                 this.lightSwitchOff(childImage);
            }
        } else {
             if (!componentData.isLightOn) {
                 componentData.isLightOn = true;
                 this.lightSwitchOn(childImage);
             }
        }
    }

    sliderLight(isLightOn: boolean, lightButtonElement: HTMLButtonElement): void {
        const { componentData: component, childImage, background } = this.lightComponentSelectors(lightButtonElement);

        if (!component || !childImage || !background) {
             console.warn("Could not update light from slider state: Missing component, image, or background.");
             return;
        }

        component.isLightOn = isLightOn;

        if (isLightOn) {
            this.lightSwitchOn(childImage);
            const brightness = component.lightIntensity / 10;
            this.handleLightIntensity(background, brightness);
        } else {
            this.lightSwitchOff(childImage);
            this.handleLightIntensity(background, 0);
        }
    }

}

export default Light;