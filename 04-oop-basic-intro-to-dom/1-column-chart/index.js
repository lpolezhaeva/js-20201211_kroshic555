export default class ColumnChart {
  chartHeight = 50;
  isSkeleton = false;

  constructor({...args} = {}) {
    if (Object.keys(args).length === 0) {
      this.isSkeleton = true;
    } else {
      this.data = args.data;
      this.label = args.label;
      this.value = args.value;
      this.link = args.link;
    }

    this.render();
  }

  proportionalData() {
    const max = Math.max(...this.data)
    return this.data.map(it => {
      return {
        value: String(Math.floor((it * this.chartHeight) / max)),
        percent: (it / max * 100).toFixed(0) + '%',
      }
    });
  }

  render() {
    const element = document.createElement('div');

    if (this.isSkeleton) {
      element.className = "column-chart_loading";
    } else {
      element.className = "column-chart";
    }

    const title = document.createElement('div');
    title.className = "column-chart__title";
    title.textContent = this.label;

    const link = document.createElement('a');
    link.className = "column-chart__link";
    link.href = this.link;

    const header = document.createElement('div');
    header.className = "column-chart__header";
    header.textContent = this.value;

    const data = document.createElement('div');
    data.className = "column-chart__chart";

    if (this.data) {
      const propData = this.proportionalData()
      for (let key of propData) {
        const childElem = document.createElement('div');
        childElem.setAttribute('style', '--value: ' + key.value);
        childElem.setAttribute('data-tooltip', key.percent)
        data.appendChild(childElem);
      }
    }

    element.appendChild(title).appendChild(link);
    element.appendChild(header);
    element.appendChild(data);


    this.element = element;
  }

  update(data) {
    this.data = data;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
