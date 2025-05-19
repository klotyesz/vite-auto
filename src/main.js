const rendezesIrany = {}; // minden mezőhöz nyomon követjük

const loading = async () => {
  const response = await fetch("https://retoolapi.dev/U0LyEZ/data");
  if (!response.ok) {
    throw new Error("Hiba történt...");
  }
  const json = await response.json();
  return json;
};

let aktualisAdatok = [];

const lista = (datas) => {
  document.getElementById("adatmegjelenites").innerText = "";
  const tablazat = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const oszlopok = [
    { label: "Márka", key: "carbrand" },
    { label: "Évjárat", key: "year" },
    { label: "Teljesítmény (HP)", key: "hp" },
    { label: "Üzemanyag", key: "fuel" },
    { label: "Ár ($)", key: "price" },
    { label: "Állapot", key: "condition" },
    { label: "Váltó", key: "shift" },
    { label: "Meghajtás", key: "dif" }
    //{ label: "Törlés", key: null }
  ];

  oszlopok.forEach(({ label, key }) => {
    const th = document.createElement("th");

    if (key) {
      const button = document.createElement("button");
      button.textContent = label;
      button.addEventListener("click", () => rendezes(key));
      th.appendChild(button);
    } else {
      th.textContent = label;
    }

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  tablazat.appendChild(thead);

  const tbody = document.createElement("tbody");
  datas.forEach(data => {
    const tr = document.createElement("tr");

    const mezok = ["carbrand", "year", "hp", "fuel", "price", "condition", "shift", "dif"];
    mezok.forEach(mezo => {
      const td = document.createElement("td");
      td.textContent = mezo === "price" ? `$${data[mezo]}` : data[mezo];
      tr.appendChild(td);
    });

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
      aktualisAdatok = await loading();
      lista(aktualisAdatok);
    });

    //tdDelete.appendChild(deleteButton);
    //tr.appendChild(tdDelete);

    tbody.appendChild(tr);
  });

  tablazat.appendChild(tbody);
  document.getElementById("adatmegjelenites").appendChild(tablazat);
};

const rendezes = (mezo) => {
  if (!rendezesIrany[mezo]) rendezesIrany[mezo] = 1;
  else rendezesIrany[mezo] *= -1;

  aktualisAdatok.sort((a, b) => {
    const aErtek = typeof a[mezo] === 'string' ? a[mezo].toLowerCase() : a[mezo];
    const bErtek = typeof b[mezo] === 'string' ? b[mezo].toLowerCase() : b[mezo];

    if (aErtek < bErtek) return -1 * rendezesIrany[mezo];
    if (aErtek > bErtek) return 1 * rendezesIrany[mezo];
    return 0;
  });

  lista(aktualisAdatok);
};


document.addEventListener("DOMContentLoaded", async () => {
  aktualisAdatok = await loading();
  lista(aktualisAdatok);
});
