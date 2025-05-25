const loading = async () => {
  const response = await fetch("https://retoolapi.dev/U0LyEZ/data");
  if (!response.ok) {
    throw new Error("Hiba történt...");
  }
  const json = await response.json();
  return json;
};

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 5000);
}

const createEditableCell = (value) => {
  const td = document.createElement("td");
  td.contentEditable = true;
  td.textContent = value;
  return td;
};

const createSelectCell = (value, options, isStars = false) => {
  const td = document.createElement("td");
  const select = document.createElement("select");

  let selectedValue;
  if (isStars) {
    selectedValue = typeof value === "string" ? value.split("⭐").length - 1 : parseInt(value);
  } else {
    selectedValue = value;
  }

  if (!options.includes(selectedValue)) {
    options = [selectedValue, ...options];
  }

  options.forEach(optionVal => {
    const option = document.createElement("option");
    option.value = optionVal;
    option.textContent = isStars ? "⭐".repeat(optionVal) : optionVal;
    if (optionVal == selectedValue) option.selected = true;
    select.appendChild(option);
  });

  td.appendChild(select);
  return td;
};

const lista = (datas) => {
  document.getElementById("adatmegjelenites").innerText = "";
  const tablazat = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headerNames = ["Márka", "Évjárat", "Teljesítmény (HP)", "Üzemanyag", "Ár ($)", "Állapot", "Váltó", "Meghajtás", "Műveletek"];
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

    const tdBrand = createEditableCell(data.carbrand);
    const tdYear = createEditableCell(data.year);
    const tdHP = createEditableCell(data.hp);
    const tdFuel = createSelectCell(data.fuel, ["Petrol", "Diesel"]);
    const tdPrice = createEditableCell(data.price);
    const tdCondition = createSelectCell(data.condition, [1, 2, 3, 4, 5], true);
    const tdShift = createSelectCell(data.shift, ["Manual", "Automatic"]);
    const tdDif = createSelectCell(data.dif, ["FWD", "RWD", "AWD"]);

    tr.appendChild(tdBrand);
    tr.appendChild(tdYear);
    tr.appendChild(tdHP);
    tr.appendChild(tdFuel);
    tr.appendChild(tdPrice);
    tr.appendChild(tdCondition);
    tr.appendChild(tdShift);
    tr.appendChild(tdDif);

    const tdActions = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Törlés";
    deleteButton.addEventListener("click", async () => {
      const response = await fetch("https://retoolapi.dev/U0LyEZ/data/" + data.id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        showToast("Hiba történt a törléskor!", "error");
        return;
      }
      showToast("Sikeres törlés!", "success");
      lista(await loading());
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Mentés";
    saveButton.addEventListener("click", async () => {
      const updatedData = {
        carbrand: tdBrand.textContent.trim(),
        year: tdYear.textContent.trim(),
        hp: tdHP.textContent.trim(),
        fuel: tdFuel.querySelector("select").value,
        price: tdPrice.textContent.replace("$", "").trim(),
        condition: parseInt(tdCondition.querySelector("select").value),
        shift: tdShift.querySelector("select").value,
        dif: tdDif.querySelector("select").value
      };

      const response = await fetch("https://retoolapi.dev/U0LyEZ/data/" + data.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        showToast("Hiba történt a mentéskor!", "error");
        return;
      }

      showToast("Sikeres mentés!", "success");
    });

    tdActions.appendChild(deleteButton);
    tdActions.appendChild(saveButton);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });

  tablazat.appendChild(tbody);
  document.getElementById("adatmegjelenites").appendChild(tablazat);
};

lista(await loading());

const ujAutoGombContainer = document.getElementById("uj-auto-gomb-container");
const ujAutoGomb = document.createElement("button");
ujAutoGomb.className = "uj-auto-gomb";
ujAutoGomb.textContent = "Új autó létrehozása";

ujAutoGomb.addEventListener("click", async () => {
  const ujAuto = {
    carbrand: "Új márka",
    year: "2025",
    hp: "100",
    fuel: "Petrol",
    price: "0",
    condition: 3,
    shift: "Manual",
    dif: "FWD"
  };

  const response = await fetch("https://retoolapi.dev/U0LyEZ/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ujAuto)
  });

  if (!response.ok) {
    showToast("Hiba történt az új autó létrehozásakor!", "error");
    return;
  }

  showToast("Új autó sikeresen létrehozva!", "success");
  lista(await loading());
});

ujAutoGombContainer.appendChild(ujAutoGomb);
