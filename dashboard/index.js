const menuBtn = document.querySelector('.menu-btn');
const backBtn = document.querySelector('.back-btn');

menuBtn.addEventListener('click', () => {
    gsap.to("nav", { x: 0, xPercent: 0, duration: .3, ease: "expo.inOut" });
    gsap.to('body',{
        duration: 3,
        '--degree': '45deg',
        ease: "expo.Out"
    })
})

backBtn.addEventListener('click', () => {
    gsap.to("nav", { xPercent: -100, duration: .3, ease: "expo.inOut" });
    gsap.to('body',{
        duration: 3,
        '--degree': '220deg',
        ease: "expo.Out"
    })
})