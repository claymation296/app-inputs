
/**
 	* `edit-input`
 	* 
 	*
 	*
 	* @customElement
 	* @polymer
 	* @demo demo/index.html
 	*
 	*
 	**/

import {
  AppElement, 
  html
}                 from '@longlost/app-element/app-element.js';
import {
  getRootTarget, 
  listen,
  warn
}                 from '@longlost/utils/utils.js';
import htmlString from './edit-input.html';
import '@longlost/icon-to-spinner/icon-to-spinner.js';
import '@longlost/pencil-to-check-icon/pencil-to-check-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-ripple/paper-ripple.js';


class EditInput extends AppElement {
  static get is() { return 'edit-input'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      icon: String,

      // Fired back to parent to distinguish 
      // between confirm edit events.
      kind: String,

      disabled: {
        type: Boolean,
        value: false
      },

      _focused: Boolean,

      _invalid: Boolean,

      _noPaperRipple: Boolean,

      _paperInputNode: Object,

      // Controls edit icon state.
      _showCheckButton: {
        type: Boolean,
        computed: '__computeShowCheckButton(_value, _invalid)'
      },

      _value: String

    };
  }


  static get observers() {
    return [
      '__showCheckButtonChanged(_showCheckButton, disabled)',
      '__disabledChanged(disabled)'
    ];
  } 
  

  connectedCallback() {
    super.connectedCallback();

    const slottedInput = this.slotNodes('#inputSlot').find(node => 
                           node.nodeName !== '#text');
    this._slottedInput = slottedInput;
    listen(slottedInput, 'focused-changed', this.__inputFocusedChanged.bind(this));
    listen(slottedInput, 'invalid-changed', this.__inputInvalidChanged.bind(this));
    listen(slottedInput, 'value-changed',   this.__inputValueChanged.bind(this));
    listen(this,         'click',           this.__thisClicked.bind(this));
  }


  __computeShowCheckButton(value, invalid) {
    return value && !invalid;
  }


  __computeEditIconEntry(disabled) {
    return disabled ? '' : 'edit-icon-entry';
  }


  __computeColor(disabled, invalid, focused) {
    if (disabled) { return 'disabled'; }
    if (invalid)  { return 'invalid';  }
    if (focused)  { return 'focused';  }
    return '';
  }


  __disabledChanged(disabled) {
    if (!disabled)                 { return; }
    if (!this._slottedInput)       { return; }
    if (!this._slottedInput.value) { return; }

    this._slottedInput.value = undefined;
  }


  __inputFocusedChanged(event) {
    this._focused = event.detail.value;
  }


  __inputInvalidChanged(event) {
    this._invalid = event.detail.value;
  }


  __inputValueChanged(event) {
    const {value} = event.detail;
    this._value   = value;

    this.fire('edit-input-changed', {kind: this.kind, value});
  }


  async __showCheckButtonChanged(showCheck, disabled) {
    try {
      await this.debounce('__showCheckButtonDebouncer', 500);

      if (showCheck && !disabled) {
        this.$.editIcon.toCheck();
        this._noPaperRipple = true;
      }
      else {
        this.$.editIcon.toPencil();
        this._noPaperRipple = false;
      }
    }
    catch (error) {
      if (error === 'debounced') { return; }
      console.error(error);
    }
  }


  __findPaperInputNode(domNode) {
    const find = node => {

      if (node.nodeName === 'EDIT-INPUT') { 
        return node.firstElementChild; 
      }

      return find(node.offsetParent);
    };

    return find(domNode);
  }


  async __thisClicked(event) {
    try {
      if (this.disabled) { return; }

      const parent = getRootTarget(event);

      await this.clicked();

      const paperInputNode = this.__findPaperInputNode(parent);

      if (!paperInputNode) { return; }

      // Used to remove focus from input (blur).
      this._paperInputNode = paperInputNode; 

      // Double focus calls undo the focus.
      if (paperInputNode.focused) { return; } 

      paperInputNode.focus();
      this.fire('edit-input-clicked');
    }
    catch (error) {
      if (error === 'click debounced') { return; }
      console.error(error);
    }
  }


  async __editButtonClicked() {
    try {
      await this.clicked();

      if (this._invalid) {
        warn('This input has an invalid format');
        return;
      }

      if (this._noPaperRipple) {
        await this.$.inputIcon.startSpinner();
        this._paperInputNode.blur();
        
        this.fire('edit-input-confirm-edit', {
          kind:        this.kind, 
          value:       this._value, 
          stopSpinner: this.$.inputIcon.stopSpinner.bind(this.$.inputIcon),
          reset:       () => this._slottedInput.value = undefined 
        });
      }
    }
    catch (error) {
      if (error === 'click debounced') { return; }
      console.error(error);
    }
  }

}

window.customElements.define(EditInput.is, EditInput);