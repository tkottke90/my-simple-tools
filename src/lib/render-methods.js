/**
 * Generates an icon elemnt using iconify and mdi
 * @param {string} iconName
 * @returns {HTMLSpanElement} 
 */
export function renderIcon(iconName) {
  const icon = document.createElement('span');

  icon.classList.add('iconify');
  icon.dataset.icon = `mdi-${iconName}`

  return icon;
}

/**
 * Generates a icon button with a click event that triggers the callback
 * @param {string | HTMLSpanElement} iconName Name of the icon to be displayed
 * @param {function} callback Function to be triggered with the click event 
 * @returns 
 */
export function renderIconButton(iconName, callback) {
  const button = document.createElement('button');
  const icon = renderIcon(iconName);

  button.appendChild(icon);
  button.addEventListener('click', callback);
  button.classList.add('icon');

  return button;
}