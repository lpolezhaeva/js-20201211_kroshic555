export default class NotificationMessage {
  static isActive;

  constructor(text = '', {
    duration = 0,
    type = '',
  } = {}) {

    if (NotificationMessage.isActive) {
      NotificationMessage.isActive.remove();
    }

    this.text = text;
    this.duration = duration;
    this.durationInSeconds = (duration / 1000) + 's';
    this.type = type;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.durationInSeconds}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.text}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    NotificationMessage.isActive = this.element;
  }

  show(parent = document.body) {
    parent.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.isActive = null;
  }
}
