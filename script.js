const closeButton = document.querySelector('.close-nav');
const openButton = document.querySelector('.open-nav')
const nav = document.querySelector('.nav');

closeButton.addEventListener("click", buttonClose);
openButton.addEventListener('click', buttonOpen);

function buttonClose() {
    nav.classList.remove('navigation-open')
};

function buttonOpen(){
    nav.classList.add('navigation-open')
}
