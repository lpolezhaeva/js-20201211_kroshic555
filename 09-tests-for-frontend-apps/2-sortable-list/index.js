export default class SortableList {

  constructor({items = []}) {
    this.items = items;
    this.render()
  }

  getListItems() {
    return this.items.map(item => {
      item.classList.add('sortable-list__item');
      item.classList.add('draggable');
      item.setAttribute('draggable', 'true');
      return item.outerHTML;
    }).join('');
  }

  template() {
    return `
        <ul class="sortable-list">
            ${this.getListItems()}
        </ul>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template();
    this.element = element.firstElementChild;

    this.initEventListeners();
  }

  initEventListeners() {
    const draggables = this.element.querySelectorAll('.draggable');
    const droppable = this.element;
    const placeholderElement = document.createElement('div');
    placeholderElement.classList.add('sortable-list__placeholder');

    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', () => {
        draggable.classList.add('sortable-list__item_dragging');
        this.element.appendChild(placeholderElement);
      });

      draggable.addEventListener('dragend', () => {
        draggable.classList.remove('sortable-list__item_dragging');
      });

      draggable.addEventListener('pointerdown', event => {
        if ('deleteHandle' in event.target.dataset) {
          draggable.remove();
        }
        if ('grabHandle' in event.target.dataset) {
          // ???
        }
      });
    });


    droppable.addEventListener('dragover', event => {
      event.preventDefault();
      const afterElement = getDragAfterElement(droppable, event.clientY);
      const draggable = this.element.querySelector('.sortable-list__item_dragging');
      if (afterElement == null) {
        droppable.appendChild(draggable);
      } else {
        droppable.insertBefore(draggable, afterElement);
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return {offset: offset, element: child};
        } else {
          return closest;
        }
      }, {offset: Number.NEGATIVE_INFINITY}).element;
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  remove() {
    this.element.remove();
  }
}
