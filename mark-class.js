
class MarkerTool {

  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
        mark: {
            class: 'cdx-marker'
        }
    };
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({api}) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.tag = 'MARK';
    this.class = 'cdx-marker';
    this.wrapper = null;
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range) {
    if (this.state) {
      this.unwrap(range);
      return;
    }

    this.wrap(range);
  }

  wrap(range) {
    const selectedText = range.extractContents();
    const mark = document.createElement(this.tag);

    mark.classList.add(this.class);
    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
  }

  unwrap(range) {
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    const text = range.extractContents();

    mark.remove();

    range.insertNode(text);
  }


  checkState() {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;

    if(this.state){
      this.showActions(mark);
    }else{
      this.hideActions();
    }
  }

  renderActions() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('list-group');
    
    return this.wrapper;
  }

  showActions(mark){
    this.wrapper.innerHTML = '';
    const list = document.querySelectorAll('.btn-light');
    if(list.length === 0){
      this.wrapper.style.padding = '20px';
      this.wrapper.innerHTML = "Добавьте пожалуйста кнопку";
    }
    list.forEach((elem, item) => {
      console.log(elem);
      this.listButton = document.createElement('button');
      this.listButton.classList.add('list-group-item', 'hook-button');
      this.listButton.type = 'button';
      this.listButton.innerHTML = elem.innerHTML;
      this.listButton.style.color = elem.style.backgroundColor;

      this.wrapper.appendChild(this.listButton);
    })
    console.log(this.wrapper);
    this.buttonHook = document.querySelectorAll('.hook-button');
    this.buttonHook.forEach(elem => {
      this.api.listeners.on(elem, 'click', () => {
        console.log(elem.innerHTML);
        mark.style.color = elem.style.color;
      }, false);
    })
    /**/
  }
  hideActions(){
    this.wrapper.innerHTML = '';
  }
}