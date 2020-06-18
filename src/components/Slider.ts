/**
 * Slider class
 * 
 * @project AN2020 - Traitement d'images pour nombre de globules blancs
 * @date 2020.06.18
 * @version 2020.06.18
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */

/**
 * Slider class
 * 
 * @author Lucas Fridez <lucas.fridez@he-arc.ch>
 */
export class Slider {

    // Properties
    private value: number;
    private inputElement: HTMLInputElement;
    private valueElement: HTMLSpanElement;
    private callback: any;

    /**
     * Construct a new Slider
     * 
     * @param idSlider
     * @param callbackOnChange
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public constructor(idSlider: string, callbackOnChange: any) {
        this.inputElement = <HTMLInputElement>document.getElementById(idSlider);
        this.valueElement = this.inputElement.parentElement.querySelector("span");
        this.value = parseInt(this.inputElement.value);
        this.callback = callbackOnChange;

        this.inputElement.addEventListener("change", this.onChange);
        this.inputElement.addEventListener("input", this.onInput);
    }

    /**
     * On change method callback
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private onChange = () : void => {
        this.value = parseInt(this.inputElement.value);
        this.callback();
    }

    /**
     * On input method callback
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    private onInput = () : void => {
        this.valueElement.textContent = this.inputElement.value;
    }

    /**
     * @return {number} input slider value
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public getValue = () : number => {
        return this.value; 
    }

    /**
     * Set input slider value and adapt string of Slider
     * 
     * @param value to set
     * 
     * @author Lucas Fridez <lucas.fridez@he-arc.ch>
     */
    public setValue = (v: number) : void => {
        this.value = v;
        this.inputElement.value = v.toString();
        this.valueElement.innerText = v.toString();
    }
}