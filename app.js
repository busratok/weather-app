const cardContainer = document.querySelector(".card-container");
const searchBtn = document.querySelector("#search");
const cityInput = document.getElementById("city");
const inputDiv = document.querySelector(".input-container");

let cityList = JSON.parse(localStorage.getItem("cityList")) || [];

//* Show already searched cities on window load
window.addEventListener("load", () => {
  cityList.forEach((city) => {
    printOnScreen(city);
  });
});

//******* FUNCTIONS **************/

const createCityInfo = ({
  name,
  main: { temp },
  sys: { country },
  weather: [{ icon }],
  weather: [{ description }],
}) => {
  const cityInfo = {
    name: name,
    country: country,
    temperature: Math.round(temp),
    icon: icon,
    description: description,
  };
  let flag = true;
  cityList.forEach((x) => x.name == cityInfo.name && (flag = false));
  if (flag) {
    printOnScreen(cityInfo);
    cityList.push(cityInfo);
    localStorage.setItem("cityList", JSON.stringify(cityList));
  } else {
    alreadySearchedAlert(name);
  }
};

const alreadySearchedAlert = (cityName) => {
  const alertP = document.createElement("p");
  alertP.innerText = `You already know the weather for ${cityName}, please search for another city`;
  inputDiv.append(alertP);
};

const printOnScreen = ({ name, country, temperature, icon, description }) => {
  const cardCol = document.createElement("div");
  cardCol.classList.add("col");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add(
    "card",
    "h-100",
    "shadow-lg",
    "text-center",
    "py-5",
    "d-flex",
    "flex-column",
    "justify-content-between"
  );

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("text-danger", "close-btn", "fs-4", "fw-semibold");
  closeBtn.innerText = "x";
  cardDiv.appendChild(closeBtn);

  const cityNameP = document.createElement("p");
  cityNameP.classList.add("city-name", "fw-semibold");
  cityNameP.innerText = name;

  const countryS = document.createElement("sup");
  countryS.classList.add(
    "bg-dark",
    "text-white",
    "p-1",
    "ms-1",
    "rounded",
    "fw-semibold"
  );
  countryS.innerText = country;
  cityNameP.appendChild(countryS);
  cardDiv.appendChild(cityNameP);

  const temperatureP = document.createElement("p");
  temperatureP.classList.add("fs-1", "temperature");
  temperatureP.innerText = temperature;
  cardDiv.appendChild(temperatureP);

  const iconDiv = document.createElement("div");
  const iconImg = document.createElement("img");
  iconImg.classList.add("w-50");
  iconImg.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconDiv.appendChild(iconImg);
  cardDiv.appendChild(iconDiv);

  const descriptionP = document.createElement("p");
  descriptionP.setAttribute("class", "fw-semibold");
  descriptionP.innerText = description;
  cardDiv.appendChild(descriptionP);

  cardCol.append(cardDiv);
  cardContainer.prepend(cardCol);
};

const removeCity = (e) => {
  e.target.closest("div").remove();
};

//** EVENT LISTENERS */

cardContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-btn")) {
    removeCity(e);
    cityList = cityList.filter(
      (x) =>
        x.name !=
        e.target.closest("div").querySelector(".city-name").firstChild.nodeValue
    );
    localStorage.setItem("cityList", JSON.stringify(cityList));
  }
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (cityInput.value.trim().length == 0) {
    return alert("Please enter a city name");
  } else {
    const key = "a6ea8a2670d991a9ea6b51a8cd21fc66";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${key}&units=metric`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => createCityInfo(data));
    e.target.closest("form").reset();
  }
  e.target.closest("form").querySelector("p").remove();
});
