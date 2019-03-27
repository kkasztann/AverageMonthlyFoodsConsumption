const voivodeships = new Map([
  ["PL-DS", {name: "dolnośląskie", unitID: "x"}],
  ["PL-KP", {name: "kujawsko-pomorskie", unitID: "x"}],
  ["PL-LD", {name: "lubelskie", unitID: "x"}],
  ["PL-LU", {name: "lubuskie", unitID: "x"}],
  ["PL-LB", {name: "łódzkie", unitID: "x"}],
  ["PL-MA", {name: "małopolskie", unitID: "x"}],
  ["PL-MZ", {name: "mazowieckie", unitID: "x"}],
  ["PL-OP", {name: "opolskie", unitID: "x"}],
  ["PL-PK", {name: "podkarpackie", unitID: "x"}],
  ["PL-PD", {name: "podlaskie", unitID: "x"}],
  ["PL-PM", {name: "pomorskie", unitID: "x"}],
  ["PL-SL", {name: "śląskie", unitID: "x"}],
  ["PL-SK", {name: "świętokrzyskie", unitID: "x"}],
  ["PL-WN", {name: "warmińsko-mazurskie", unitID: "x"}],
  ["PL-WP", {name: "wielkopolskie", unitID: "x"}],
  ["PL-ZP", {name: "zachodniopomorskie", unitID: "x"}]
]);

function setUnitID() {
  axios.get('https://cors-anywhere.herokuapp.com/https://bdl.stat.gov.pl/api/v1/units?level=2&format=json&page-size=20')
    .then(function (response) {
      console.log("TAK");
      data = response.data;
      if (data.totalRecords === 16) {
        console.log(data.results);
        voivodeships.forEach(voivodeship => {
          data.results.forEach(data => {
            if (data.name.toLowerCase() === voivodeship.name) {
              voivodeship.unitID = data.id;
            }
          })
        })
      } else {
        console.log("No data :(");
      }
    })
    .catch(function (error) {
      console.log("NIE");
      console.log(error);
    })
}

setUnitID();


const map = document.querySelectorAll("path");
const voivodeship = document.querySelector(".voivodeship");
map.forEach(land => {
  land.addEventListener("click", (e) => {
    map.forEach(land => {
      land.classList.remove("landTagged");
    });
    e.target.classList.add("landTagged");
    voivodeship.textContent = voivodeships.get(e.target.id).name;
  })
})