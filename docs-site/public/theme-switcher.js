(() => {
  const storageKey = 'rex-theme-style';
  const storedStyle = localStorage.getItem(storageKey);
  const initialStyle = storedStyle === 'red-gold' ? 'red-gold' : 'medieval2';
  document.documentElement.dataset.style = initialStyle;

  function addStylePicker(container) {
    if (!container || container.querySelector('[data-style-picker]')) return;

    const themeSelect = container.querySelector('starlight-theme-select');
    if (!themeSelect) return;

    const wrapper = document.createElement('label');
    wrapper.dataset.stylePicker = 'true';
    wrapper.setAttribute('aria-label', 'Select visual style');
    wrapper.className = 'style-picker';

    const select = document.createElement('select');
    select.innerHTML = '<option value="medieval2">M2TW Style</option><option value="red-gold">Rome Style</option>';
    select.value = document.documentElement.dataset.style || initialStyle;
    select.addEventListener('change', () => {
      localStorage.setItem(storageKey, select.value);
      document.documentElement.dataset.style = select.value;
      document.querySelectorAll('[data-style-picker] select').forEach((picker) => {
        picker.value = select.value;
      });
    });

    wrapper.append(select);
    themeSelect.before(wrapper);
  }

  function addStylePickers() {
    addStylePicker(document.querySelector('.header .right-group'));
    addStylePicker(document.querySelector('.mobile-preferences'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addStylePickers);
  } else {
    addStylePickers();
  }
})();
