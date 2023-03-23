"use strict";
const input = document.getElementById("input");
const map = L.map("map", {
  center: [0, 0],
  zoom: 13,
});
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
window.addEventListener("load", getData);
input.addEventListener("focus", removeError);

async function getData() {
  try {
    const data = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_POPpJPjXj2ucPYMyDCeC8tVMia9ey&ipAddress=${input.value}`
    );
    const dataJSON = await data.json();
    if (dataJSON.hasOwnProperty("messages")) throw new Error(dataJSON.messages);
    const dataIP = [
      dataJSON.ip,
      `${dataJSON.location.city}, ${dataJSON.location.country}`,
      `UTC ${dataJSON.location.timezone}`,
      dataJSON.isp,
      [dataJSON.location.lat, dataJSON.location.lng],
    ];
    displayData(dataIP);
  } catch (error) {
    displayError(error.message);
  }
}

function displayData(data) {
  const output = document.querySelectorAll(".item");
  const wrapper = document.querySelector(".output-field");
  output.forEach((el, i) => (el.children[1].textContent = data[i]));
  displayMap(data.at(-1));
  wrapper.classList.remove("hidden");
}

function displayMap(latlng) {
  const myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconAnchor: [22, 65],
  });
  map.setView(latlng, 13);
  L.marker(latlng, { icon: myIcon }).addTo(map);
}

function displayError(msg) {
  const error = document.getElementById("input-error");
  error.textContent = msg;
}
function removeError() {
  const error = document.getElementById("input-error");
  error.textContent = "";
}
