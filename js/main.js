console.log("Work mode ON");
//  All areas are listed in the line below. You can use this list in your script.
// ,{id:"PL-LU"},{id:"PL-LB"},

const voivodeships = new Map([
    ["PL-DS", "dolnośląskie"],
    ["PL-KP", "kujawsko-pomorskie"],
    ["PL-LD", "lubelskie"],
    ["PL-LU", "lubuskie"],
    ["PL-LB", "łódzkie"],
    ["PL-MA", "małopolskie"],
    ["PL-MZ", "mazowieckie"],
    ["PL-OP", "opolskie"],
    ["PL-PK", "podkarpackie"],
    ["PL-PD", "podlaskie"],
    ["PL-PM", "pomorskie"],
    ["PL-SL", "śląskie"],
    ["PL-SK", "świętokrzyskie"],
    ["PL-WN", "warmińsko-mazurskie"],
    ["PL-WP", "wielkopolskie"],
    ["PL-ZP", "zachodniopomorskie"]
]);

const map = document.querySelectorAll("path");
const voivodeship = document.querySelector(".voivodeship");
map.forEach(land => {
    land.addEventListener("click", (e) => {
        map.forEach(land => {
            land.classList.remove("landTagged");
        });
        e.target.classList.add("landTagged");
        voivodeship.textContent = voivodeships.get(e.target.id);
    })
})