// ======================== MAIN CLASS =====================
class Main {
  constructor(products = [], voivodeships = [], activeVoivodeshipID = {}) {
    this.products = products;
    this.voivodeships = voivodeships;
    this.activeVoivodeshipID = activeVoivodeshipID;
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


  setVoivodeshipsUnit() {
    axios.get('https://cors-anywhere.herokuapp.com/https://bdl.stat.gov.pl/api/v1/units?level=2&format=json&page-size=20', {
      headers: {
        'X-ClientId': '785f193c-9495-41ae-9e16-08d6b36cba0f'
      }
    }).then((response) => {
      if (response.data.totalRecords === 16) {
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
      alert(`Coś poszło nie tak lub wyczerpano limit zapytań o dane`);
    })
  };


  setProducts() {
    axios.get('https://cors-anywhere.herokuapp.com/https://bdl.stat.gov.pl/api/v1/variables?subject-id=P2456&format=json&page-size=8', {
      headers: {
        'X-ClientId': '785f193c-9495-41ae-9e16-08d6b36cba0f'
      }
    }).then((response) => {
      if (response.data.totalRecords != 0) {
        response.data.results.forEach(product => {
          const newProduct = new Product(product.n1, product.id, product.measureUnitName);
          this.products.push(newProduct);
        })
      } else {
        console.log("No data");
      }
      this.showProductsInUL();
    }).catch(function (error) {
      console.log(error);
      alert(`Coś poszło nie tak lub wyczerpano limit zapytań o dane`);
    })
  };


  setProductsValue() {
    this.products.forEach(product => {
      axios.get(`https://cors-anywhere.herokuapp.com/https://bdl.stat.gov.pl/api/v1/data/by-unit/${this.activeVoivodeshipID}?var-id=${product.id}&year=2017&format=json`, {
          headers: {
            'X-ClientId': '785f193c-9495-41ae-9e16-08d6b36cba0f'
          }
        }).then((response) => {
          if (response.data.totalRecords == 1) {
            product.value = response.data.results[0].values[0].val;
          } else {
            console.log("No data");
            product.value = "BDL no data";
          }
          this.showProductsInUL();
        }).then(() => {
          this.generateChart(this.products);
        })
        .catch(function (error) {
          console.log(error);
          alert(`Coś poszło nie tak lub wyczerpano limit zapytań o dane`);
        })
    })
    this.generateChart(this.products);
  }


  showProductsInUL() {
    const dataList = document.querySelector(".dataList");
    dataList.innerHTML = "";
    this.products.forEach(product => {
      if (product.value != "BDL no data") {
        const li = document.createElement('li');
        li.textContent = `${product.name}:${product.value} ${product.entity}`;
        dataList.appendChild(li);
      }
    })
  }


  setVoivodeshipsOnClick() {
    this.map.forEach(voivodeship => {
      voivodeship.addEventListener("click", (e) => {
        this.map.forEach(voivodeship => {
          voivodeship.classList.remove("landTagged");
        });
        e.target.classList.add("landTagged");
        document.querySelector(".voivodeship").textContent = this.voivodeships.get(e.target.id).name;
        this.activeVoivodeshipID = this.voivodeships.get(e.target.id).unitID;
        this.setProductsValue();
      })
    })
  };


  generateChart(products) {

    var oldcanv = document.getElementById('chart');
    document.querySelector(".diagrams").removeChild(oldcanv);

    var canv = document.createElement('canvas');
    canv.id = 'chart';
    document.querySelector(".diagrams").appendChild(canv);


    var ctx = document.getElementById('chart').getContext('2d');
    let chartData = [];
    let chartLabels = [];
    products.forEach(product => {
      if (product.value != "BDL no data") {
        chartData.push(product.value);
        chartLabels.push(product.name);
      }
    })
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [{
          label: '# of Votes',
          data: chartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
    });
  }

};

// ======================== VOIVODESHIP CLASS =====================
class Voivodeship {
  constructor(name, unitID = "no Data") {
    this.name = name;
    this.unitID = unitID;
  }
};

// ======================== PRODUCT CLASS =====================
class Product {
  constructor(name = "no Data", id = 0, entity = "kg", value = 0) {
    this.name = name;
    this.id = id;
    this.entity = entity;
    this.value = value;
  }
};


// ======================== START HERE =====================
main = new Main();
main.setVoivodeships();
main.setVoivodeshipsUnit();
main.setProducts();
main.setVoivodeshipsOnClick();