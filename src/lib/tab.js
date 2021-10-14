const tabContainer = document.querySelector('.tab-container');
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content > section');

tabs.forEach(tab => {
  const tabName = tab.dataset.tab;
  const content = document.querySelector(`.tab-content > [data-tab=${tabName}]`);

  if (!content) {
    tab.setAttribute('disabled', '');
    return;
  }
  
  tab.addEventListener('click', () => {
    const allContent = document.querySelectorAll('[data-tab-display]');
    allContent.forEach(item => item.classList.remove('active'));

    const content = document.querySelector(`.tab-content > [data-tab=${tabName}]`);
    
    tab.classList.add('active')
    content.classList.add('active');
  });
});