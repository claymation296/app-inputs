
/**
  * `InputMixin`
  * 
  *   Common app-input logic.
  *
  *
  *
  *  Properites:
  *
  *
  *    allowed-pattern - <String> Regex for underlying Polymer input allowed-pattern.
  *
  *
  *    autocomplete - <Boolean> Underlying Polymer input autocomplete.
  *  
  *
  *    autocorrect - <Boolean> Underlying Polymer input autocorrect.
  *
  *
  *    autocapitalize - <Boolean> Underlying Polymer input autocapitalize.
  *
  *  
  *    focused - <Boolean> Underlying Polymer input focused state.
  *
  *
  *    label - <String> Underlying Polymer input label.
  *
  *
  *    placeholder - <String> Underlying Polymer input placeholder.
  *
  *
  *    tabindex - <Number> Underlying Polymer input tabindex.
  *
  *
  *    type - <String> Underlying Polymer input type.
  *
  *
  *    value - <String> Underlying Polymer input value.
  *
  *
  *
  *
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  *
  **/

import {AppElement}   from '@longlost/app-element/app-element.js';
import {consumeEvent} from '@longlost/utils/utils.js';
import '@longlost/app-shared-styles/app-shared-styles.js';


export const InputMixin = () => {
  return class InputMixin extends AppElement {


    static get properties() {
      return {

        allowedPattern: String,

        autocomplete: {
          type: Boolean,
          value: true
        },

        autocorrect: {
          type: Boolean,
          value: true
        },
        
        autocapitalize: {
          type: Boolean,
          value: true
        },

        focused: {
          type: Boolean,      
          value: false,
          reflectToAttribute: true,
        },

        label: String,

        placeholder: String,

        tabindex: {
          type: Number,
          value: 0
        },

        type: String,
        
        value: String

      };
    }


    __focusedChanged(event) {
      this.focused = event.detail.value;
    }


    __valueChanged(event) {
      consumeEvent(event);

      this.fire('value-changed', event.detail);
    }

  };
};
