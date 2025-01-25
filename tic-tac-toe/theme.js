const THEME_BUTTON = document.createElement('button');
THEME_BUTTON.innerHTML = '&#xe518;'
THEME_BUTTON.classList.add('viewMode');
THEME_BUTTON.onclick = () => changeThemeMode(THEME_BUTTON);
THEME_BUTTON.setAttribute('mode', 'L');
document.body.prepend(THEME_BUTTON);

function changeThemeMode(sel) {
  let root = document.querySelector(':root');
  if (sel.getAttribute('mode') == 'D') {
    sel.setAttribute('mode', 'L');
    sel.innerHTML = '&#xe518;';
    root.style.setProperty('--mcolor', 'white');
    root.style.setProperty('--mcolorrgb', 'rgba(0, 0, 0, 0.2)');
    root.style.setProperty('--mcontrast', 'black');
    if (typeof Circle === 'function') {
      Circle.setColor('rgb(0, 0, 0)');
    }
  } else {
    sel.setAttribute('mode', 'D');
    sel.innerHTML = '&#xe51c;';
    root.style.setProperty('--mcolor', 'black');
    root.style.setProperty('--mcolorrgb', 'rgba(255, 255, 255, 0.2)');
    root.style.setProperty('--mcontrast', 'white');
    if (typeof Circle === 'function') {
      Circle.setColor('rgb(255, 255, 255)');
    }
  }
}

// initial theme setup
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  changeThemeMode(THEME_BUTTON, 'dark');
} else {
  changeThemeMode(THEME_BUTTON, 'light');
}

window.matchMedia('(prefers-color-scheme: dark)')
  .addListener(e => {
    console.log(e);
    if (e.matches) {
      changeThemeMode(THEME_BUTTON, 'dark');
    } else {
      changeThemeMode(THEME_BUTTON, 'light');
    }
  });