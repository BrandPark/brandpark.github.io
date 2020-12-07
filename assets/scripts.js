$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

/* Side Bar */
var menuBtn = document.querySelector('.menu-btn');
var nav = document.querySelector('.sidebar');
var lineOne = document.querySelector('.sidebar .menu-btn .line--1');
var lineTwo = document.querySelector('.sidebar .menu-btn .line--2');
var link = document.querySelector('.sidebar .nav-links');
var blur = document.querySelector('.blur');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    lineOne.classList.toggle('line-cross');
    lineTwo.classList.toggle('line-cross');
    link.classList.toggle('fade-in');
    blur.classList.toggle('show');
})