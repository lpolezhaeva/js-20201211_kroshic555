import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};
  defaultFormData = {
    title: '',
    description: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    images: [],
    price: 100,
    discount: 0
  };

  onSubmit = event => {
    event.preventDefault();
    this.save();
  };

  constructor(productId) {
    this.productId = productId;
  }

  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElements[item.dataset.element] = item;
    }

    return subElements;
  }


  productTitle() {
    return `
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" value="" required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
    `;
  }

  productDescription() {
    return `
      <div class="form-group form-group__wide">
          <label class="form-label">Описание</label>
          <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
        </div>
    `;
  }

  productPhoto() {
    return `
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <ul class="sortable-list" data-element="imageListContainer"></ul>
          <input id="fileInput" type="file" hidden/>
          <button type="button" name="uploadImage" class="button-primary-outline fit-content" data-element="uploadImage">
            <span>Загрузить</span>
          </button>
        </div>
    `;
  }

  productCategory() {
    return `
      <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
         ${this.createCategoriesSelect()}
      </div>
    `;
  }

  createCategoriesSelect() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<select class="form-control" id="subcategory" name="subcategory"></select>`;
    const select = wrapper.firstElementChild;
    for (const category of this.categories) {
      for (const child of category.subcategories) {
        select.append(new Option(`${category.title} > ${child.title}`, child.id));
      }
    }
    return select.outerHTML;
  }

  productPriceAndDiscount() {
    return `
      <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
            <label class="form-label">Цена ($)</label>
            <input id="price" required="" value="" type="number" name="price" class="form-control" placeholder="${this.defaultFormData.price}">
          </fieldset>
          <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input id="discount" required="" value="" type="number" name="discount" class="form-control" placeholder="${this.defaultFormData.discount}">
          </fieldset>
        </div>
    `;
  }

  productAmount() {
    return `
      <div class="form-group form-group__part-half">
          <label class="form-label">Количество</label>
          <input id="quantity" value="" required="" type="number" class="form-control" name="quantity" placeholder="${this.defaultFormData.quantity}">
        </div>
    `;
  }

  productStatus() {
    return `
      <div class="form-group form-group__part-half">
          <label class="form-label">Статус</label>
          <select id="status" class="form-control" name="status">
            <option value="1">Активен</option>
            <option value="0">Неактивен</option>
          </select>
        </div>
    `;
  }

  productSaveButton() {
    return `
      <div class="form-buttons">
          <button type="submit" name="save" class="button-primary-outline">
            ${this.productId ? "Сохранить" : "Добавить"} товар
          </button>
      </div>
    `;
  }

  productListElement(url, name) {
    const element = document.createElement('div');
    element.innerHTML = `
      <li class="products-edit__imagelist-item sortable-list__item">
        <span>
          <img src="./icon-grab.svg" data-grab-handle alt="grab">
          <img class="sortable-table__cell-img" alt="${escapeHtml(name)}" src="${escapeHtml(url)}">
          <span>${escapeHtml(name)}</span>
        </span>
        <button type="button">
          <img src="./icon-trash.svg" alt="delete" data-delete-handle>
        </button>
      </li>`;
    return element.firstElementChild;
  }

  productPhotoList() {
    const {imageListContainer} = this.subElements;
    const {images} = this.formData;
    const items = images.map(({url, source}) => this.productListElement(url, source));
    const sortableList = new SortableList({
      items
    });
    imageListContainer.append(sortableList.element);
  }

  getForm() {
    return `
      <form data-element="productForm" class="form-grid">
       ${this.productTitle()}
       ${this.productDescription()}
       ${this.productPhoto()}
       ${this.productCategory()}
       ${this.productPriceAndDiscount()}
       ${this.productAmount()}
       ${this.productStatus()}
       ${this.productSaveButton()}
      </form>
    `;
  }

  getEmptyTemplate() {
    return `
      <div>
        <h1 class="page-title">Страница не найдена</h1>
        <p>Извините, данный товар не существует</p>
      </div>
    `;
  }

  async loadProductData(productId) {
    return fetchJson(`${BACKEND_URL}/api/rest/products?id=${productId}`);
  }

  async loadCategoriesList() {
    return fetchJson(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`);
  }

  dispatchEvent(id) {
    const event = this.productId
      ? new CustomEvent('product-updated', {detail: id})
      : new CustomEvent('product-saved');

    this.element.dispatchEvent(event);
  }

  setFormData() {
    const {productForm} = this.subElements;

    productForm.elements.title.value = this.formData['title'];
    productForm.elements.description.value = this.formData['description'];

    productForm.elements.price.value = this.formData['price'];
    productForm.elements.discount.value = this.formData['discount'];
    productForm.elements.quantity.value = this.formData['quantity'];
  }

  initEventListeners() {
    const {productForm, uploadImage} = this.subElements;

    productForm.addEventListener('submit', this.onSubmit);
    uploadImage.addEventListener('click', this.uploadImage);
  }

  async render() {
    const categoriesPromise = this.loadCategoriesList();

    const productPromise = this.productId
      ? this.loadProductData(this.productId)
      : [this.defaultFormData];

    const [categoriesData, productResponse] = await Promise.all([categoriesPromise, productPromise]);
    const [productData] = productResponse;

    this.formData = productData;
    this.categories = categoriesData;

    const element = document.createElement('div');
    element.innerHTML = this.formData ? this.getForm() : this.getEmptyTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.setFormData();
    this.productPhotoList();
    this.initEventListeners();
    return this.element;
  }

  uploadImage = () => {
    const fileElement = document.getElementById('fileInput');

    fileElement.onchange = async () => {
      const [file] = fileElement.files;
      if (file) {
        const formData = new FormData();
        const {imageListContainer} = this.subElements;
        formData.append('image', file);
        const response = await fetchJson('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
          },
          body: formData,
        });
        imageListContainer.append(this.productListElement(response.data.link, file.name));
      }
    }
    fileElement.click();
  }

  async save() {
    const product = this.getFormData();

    try {
      const result = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      this.dispatchEvent(result.id);
    } catch (error) {
      console.error('something went wrong', error);
    }
  }

  getFormData() {
    const {productForm, imageListContainer} = this.subElements;
    const excludedFields = ['images'];
    const formatToNumber = ['price', 'quantity', 'discount', 'status'];
    const fields = Object.keys(this.defaultFormData).filter(item => !excludedFields.includes(item));
    const values = {};

    for (const field of fields) {
      values[field] = formatToNumber.includes(field)
        ? parseInt(productForm.querySelector(`#${field}`).value)
        : productForm.querySelector(`#${field}`).value;
    }

    const imagesHTMLCollection = imageListContainer.querySelectorAll('.sortable-table__cell-img');

    values.images = [];
    values.id = this.productId;

    for (const image of imagesHTMLCollection) {
      values.images.push({
        url: image.src,
        source: image.alt
      });
    }

    return values;
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }

  remove() {
    this.element.remove();
  }
}
