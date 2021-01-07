class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  onMouseOver = event => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.render(element.dataset.tooltip);
      this.moveTooltip(event);
      document.addEventListener('pointermove', this.onMouseMove);
    }

  };

  onMouseOut = () => {
    this.removeTooltip();
  }

  onMouseMove = event => {
    this.moveTooltip(event);
  }

  moveTooltip(event) {
    let left = event.clientX + 10;
    let top = event.clientY + 10;

    if (left < 0) {
      left = 0;
    }

    if (top < 0) {
      top = 0;
    }

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  render(html) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = html;
    document.body.append(this.element);
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.onMouseOver);
    document.addEventListener('pointerout', this.onMouseOut);
  }

  initialize() {
    this.initEventListeners();
  }

  removeTooltip() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      document.removeEventListener('pointermove', this.onMouseMove);
    }
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    document.body.removeEventListener('pointerover', this.onMouseOver);
    document.removeEventListener('pointerout', this.onMouseOut);
    this.removeTooltip();
  }

}

const tooltip = new Tooltip();

export default tooltip;
