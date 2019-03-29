// ======================== MAIN CLASS =====================
class Main {
  constructor(products = [], voivodeships = [], activeVoivodeship = {}) {
    this.products = products;
    this.voivodeships = voivodeships;
    this.activeVoivodeship = activeVoivodeship;

    this.map = document.querySelectorAll("path");
  }


  setVoivodeships() {
    this.voivodeships = new Map([
      ["PL-DS", new Voivodeship("dolnośląskie")],
      ["PL-KP", new Voivodeship("kujawsko-pomorskie")],
      ["PL-LD", new Voivodeship("lubelskie")],
      ["PL-LU", new Voivodeship("lubuskie")],
      ["PL-LB", new Voivodeship("łódzkie")],
      ["PL-MA", new Voivodeship("małopolskie")],
      ["PL-MZ", new Voivodeship("mazowieckie")],
      ["PL-OP", new Voivodeship("opolskie")],
      ["PL-PK", new Voivodeship("podkarpackie")],
      ["PL-PD", new Voivodeship("podlaskie")],
      ["PL-PM", new Voivodeship("pomorskie")],
      ["PL-SL", new Voivodeship("śląskie")],
      ["PL-SK", new Voivodeship("świętokrzyskie")],
      ["PL-WN", new Voivodeship("warmińsko-mazurskie")],
      ["PL-WP", new Voivodeship("wielkopolskie")],
      ["PL-ZP", new Voivodeship("zachodniopomorskie")]
    ]);
  };


  setVoivodeshipsOnClick() {
    this.map.forEach(voivodeship => {
      voivodeship.addEventListener("click", (e) => {
        this.map.forEach(voivodeship => {
          voivodeship.classList.remove("landTagged");
        });
        e.target.classList.add("landTagged");
        document.querySelector(".voivodeship").textContent = this.voivodeships.get(e.target.id).name;
        this.activeVoivodeship = this.voivodeships.get(e.target.id).unitID;
      })
    })

  };


  setVoivodeshipsUnit() {
    axios.get('https://cors-anywhere.herokuapp.com/https://bdl.stat.gov.pl/api/v1/units?level=2&format=json&page-size=20', {
      headers: {
        'X-ClientId': '785f193c-9495-41ae-9e16-08d6b36cba0f'
      }
    }).then((response) => {
      if (response.data.totalRecords === 16) {
        console.log("16 rekordów");
        this.voivodeships.forEach(voivodeship => {
          response.data.results.forEach(data => {
            if (data.name.toLowerCase() === voivodeship.name) {
              voivodeship.unitID = data.id;
            }
          })
        })
      } else {
        console.log("No data");
      }
    }).catch(function (error) {
      console.log(error);
    })
  }
}
// ======================== VOIVODESHIP CLASS =====================
class Voivodeship {
  constructor(name, unitID = "no Data") {
    this.name = name;
    this.unitID = unitID;
  }
}



// ======================== START HERE =====================
main = new Main();
main.setVoivodeships();
main.setVoivodeshipsUnit();
main.setVoivodeshipsOnClick();