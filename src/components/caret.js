export default class Caret {
  constructor(output, position) {
    this.output = output;
    this.position = position;
  }

  show() {
    this.output.focus();
    this.output.selectionEnd = this.output.selectionStart = this.position;
  }

  setPosition(modifier = 'end', length = 1) {
    switch (modifier) {
      case 'end':
      default:
        this.position = this.output.value.length;
        break;
      case 'increment':
        this.position = this.position + length;
        break;
      case 'decrement':
        this.position = Math.max(this.position - length, 0);
        break;
    }

    this.show();
  }
}
