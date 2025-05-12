//using iterface 
interface ComponentData {
    name: string;
    lightIntensity: number;
    numOfLights: number;
    isLightOn: boolean;
    autoOn: string; 
    autoOff: string; 
    usage: number[];
    element?: HTMLButtonElement | null; 
  }
  
  interface WifiConnection {
    id: number;
    wifiName: string;
    signal: 'excellent' | 'good' | 'poor';
  }
  
  
  type ComponentsData = Record<string, ComponentData>;
  
  const componentsData: ComponentsData = {
    hall: { name: 'hall', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [22, 11, 12, 10, 12, 17, 22] },
    bedroom: { name: 'bedroom', lightIntensity: 5, numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [18, 5, 7, 5, 6, 6, 18] },
    bathroom: { name: 'bathroom', lightIntensity: 5, numOfLights: 1, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [2, 1, 1, 1, 1, 3, 3] },
    'outdoor lights': { name: 'outdoor lights', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [15, 12, 13, 9, 12, 13, 18] },
    'guest room': { name: 'guest room', lightIntensity: 5, numOfLights: 4, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 10, 3, 9, 5, 5, 18] },
    kitchen: { name: 'kitchen', lightIntensity: 5, numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 11, 12, 13, 18] },
    'walkway & corridor': { name: 'walkway & corridor', lightIntensity: 5, numOfLights: 8, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 15, 22, 23, 18] },
  };
  
  const wifiConnections: WifiConnection[] = [
    { id: 0, wifiName: 'Inet service', signal: 'excellent' },
    { id: 1, wifiName: 'Kojo_kwame121', signal: 'poor' },
    { id: 2, wifiName: 'spicyalice', signal: 'good' },
    { id: 3, wifiName: 'virus', signal: 'good' },
  ];
  
  
  class General {
      
      protected componentsData: ComponentsData = componentsData;
      protected wifiConnections: WifiConnection[] = wifiConnections;
  
    
      public isLightOn: boolean;
      public lightIntensity: number;
  
      constructor() {
          
          this.isLightOn = false;
          this.lightIntensity = 5; 
      }
  
      getComponent(name: string): ComponentData | undefined {
          return this.componentsData[name.toLowerCase()];
      }
  
      getWifi(): WifiConnection[] {
          return this.wifiConnections;
      }
  
     
      protected selector<T extends Element>(identifier: string): T | null {
          return document.querySelector<T>(identifier);
      }
  
      
      protected closestSelector<T extends Element>(
          selectedElement: Element,
          ancestorIdentifier: string,
          childSelector: string
      ): T | null {
          const closestAncestor = selectedElement.closest<HTMLElement>(ancestorIdentifier);
          return closestAncestor ? closestAncestor.querySelector<T>(childSelector) : null;
      }
  
      getSelectedComponentName(element: Element, ancestorIdentifier: string = '.rooms', elementSelector: string = 'p'): string | null {
          const selectedElement = this.closestSelector<HTMLParagraphElement>(element, ancestorIdentifier, elementSelector);
          return selectedElement ? selectedElement.textContent?.toLowerCase() ?? null : null;
      }
  
       getComponentData(element: Element, ancestorIdentifier: string, childElementSelector: string): ComponentData | undefined {
          const name = this.getSelectedComponentName(element, ancestorIdentifier, childElementSelector);
          return name ? this.getComponent(name) : undefined;
      }
  
  
      renderHTML(htmlString: string, position: InsertPosition, container: Element): void {
          container.insertAdjacentHTML(position, htmlString);
      }
  
      
      notification(message: string): string {
          return `
              <div class="notification">
                  <p>${message}</p>
              </div>
          `;
      }
  
      
      displayNotification(message: string, position: InsertPosition, container: Element): void {
          const html = this.notification(message);
          this.renderHTML(html, position, container);
          
      }
  
      removeNotification(element: Element): void {
          setTimeout(() => {
              element.remove();
          }, 2000); 
      }
  
  
      handleLightIntensity(element: HTMLElement, lightIntensity: number): void {
         
          const brightness = Math.max(0, Math.min(1, lightIntensity));
          element.style.filter = `brightness(${brightness})`;
      }
  
      
      updateComponentData(data: Partial<ComponentData>, componentName: string): void {
         const component = this.getComponent(componentName);
         if (component) {
             
             Object.assign(component, data);
             console.log(`Updated ${componentName}:`, component);
         } else {
              console.warn(`Component ${componentName} not found for update.`);
         }
      }
  
      updateMarkupValue(element: Element, value: string): void {
          element.textContent = value;
      }
  
      toggleHidden(element: Element): void {
          element.classList.toggle('hidden');
      }
  
      removeHidden(element: Element): void {
          element.classList.remove('hidden');
      }
  
      addHidden(element: Element): void {
          element.classList.add('hidden');
      }
  
      formatTextToClassName(name: string): string {
          return name.split(' ').join('_');
      }
  
  
      
      setComponentElement(roomData: ComponentData): void {
          
          if (roomData.element) return;
  
          let parent: HTMLElement | null = null;
          const roomName = roomData.name.toLowerCase(); 
  
          
          if (roomName === 'walkway & corridor') {
              parent = this.selector('.corridor');
          } else if (roomName === 'guest room') {
              const elementClassName = this.formatTextToClassName(roomName);
              parent = this.selector(`.${elementClassName}`);
          } else if (roomName === 'outdoor lights') {
              parent = this.selector('.outside_lights');
          } else {
             
               parent = this.selector(`.${this.formatTextToClassName(roomName)}`); 
          }
  
          if (parent) {
              const buttonElement = parent.querySelector<HTMLButtonElement>('.light-switch');
              roomData.element = buttonElement; 
               if (!buttonElement) {
                   console.warn(`Light switch button not found for room: ${roomData.name} in parent:`, parent);
              }
          } else {
              console.warn(`Parent element not found for room: ${roomData.name}`);
          }
      }
  }
  
  export default General;

  export { ComponentData, WifiConnection, ComponentsData };