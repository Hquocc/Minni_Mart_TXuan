class AppDialog extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <dialog class="app-dialog" id="app-dialog" aria-labelledby="dialog-title">
        <form id="dialog-form">
          <div class="dialog-heading">
            <div><p class="eyebrow">MINNI MART</p><h2 id="dialog-title">Thêm sản phẩm</h2></div>
            <button class="dialog-close" type="button" aria-label="Đóng">×</button>
          </div>
          <div id="dialog-content"></div>
          <div class="dialog-actions">
            <button class="button button-quiet" type="button" data-close-dialog>Hủy</button>
            <button class="button button-primary" type="submit" id="dialog-submit">Lưu thông tin</button>
          </div>
        </form>
      </dialog>`;
  }
}

class AppToast extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  }
}

customElements.define("app-dialog", AppDialog);
customElements.define("app-toast", AppToast);
