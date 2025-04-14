const loading = async () => {
  const response = await fetch("https://retoolapi.dev/U0LyEZ/data");
  if (!response.ok) {
    throw new Error("Hiba történt...");
  }
  const json = await response.json();
  return json;
};

const lista = (datas) => {
  document.getElementById("adatmegjelenites").innerText = "";
  const tablazat = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headerNames = ["Márka", "Évjárat", "Teljesítmény (HP)", "Üzemanyag", "Ár ($)", "Állapot", "Váltó", "Meghajtás", "Törlés"];

  headerNames.forEach(name => {
    const th = document.createElement("th");
    th.textContent = name;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  tablazat.appendChild(thead);

  const tbody = document.createElement("tbody");
  datas.forEach(data => {
    const tr = document.createElement("tr");

    const tdBrand = document.createElement("td");
    tdBrand.textContent = data.carbrand;
    tr.appendChild(tdBrand);

    const tdYear = document.createElement("td");
    tdYear.textContent = data.year;
    tr.appendChild(tdYear);

    const tdHP = document.createElement("td");
    tdHP.textContent = data.hp;
    tr.appendChild(tdHP);

    const tdFuel = document.createElement("td");
    tdFuel.textContent = data.fuel;
    tr.appendChild(tdFuel);

    const tdPrice = document.createElement("td");
    tdPrice.textContent = `$${data.price}`;
    tr.appendChild(tdPrice);

    const tdCondition = document.createElement("td");
    tdCondition.textContent = data.condition;
    tr.appendChild(tdCondition);

    const tdShift = document.createElement("td");
    tdShift.textContent = data.shift;
    tr.appendChild(tdShift);

    const tdDif = document.createElement("td");
    tdDif.textContent = data.dif;
    tr.appendChild(tdDif);

    const tdDelete = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Törlés";

    deleteButton.addEventListener("click", async () => {
      const response = await fetch("https://retoolapi.dev/U0LyEZ/data/" + data.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        alert("Hiba történt ...");
        return;
      }
      lista(await loading());
    });

    tdDelete.appendChild(deleteButton);
    tr.appendChild(tdDelete);

    tbody.appendChild(tr);
  });

  tablazat.appendChild(tbody);
  document.getElementById("adatmegjelenites").append(tablazat);
};

document.getElementById("adatmegjelenites").innerText = "";
lista(await loading());
document.addEventListener("DOMContentLoaded", init);
