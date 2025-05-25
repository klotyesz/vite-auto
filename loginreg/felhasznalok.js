const API_URL = "https://retoolapi.dev/FCQu2e/user";

const loading = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Hiba történt a felhasználók betöltésekor...");
  }
  return await response.json();
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

const lista = (datas) => {
  const container = document.getElementById("felhasznalok-lista");
  container.innerHTML = "";

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Felhasználónév", "Email", "Jelszó", "Műveletek"].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  datas.forEach(user => {
    const tr = document.createElement("tr");

    const tdUsername = createEditableCell(user.username);
    const tdEmail = createEditableCell(user.email);
    const tdPassword = createEditableCell(user.password);

    tr.appendChild(tdUsername);
    tr.appendChild(tdEmail);
    tr.appendChild(tdPassword);

    const tdActions = document.createElement("td");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Mentés";
    saveButton.addEventListener("click", async () => {
      const updatedData = {
        username: tdUsername.textContent.trim(),
        email: tdEmail.textContent.trim(),
        password: tdPassword.textContent.trim()
      };

      const response = await fetch(`${API_URL}/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        showToast("Hiba történt a mentés során!", "error");
        return;
      }

      showToast("Sikeres mentés!");
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Törlés";
    deleteButton.addEventListener("click", async () => {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        showToast("Hiba történt a törlés során!", "error");
        return;
      }

      showToast("Felhasználó törölve");
      lista(await loading());
    });

    tdActions.appendChild(saveButton);
    tdActions.appendChild(deleteButton);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
};

lista(await loading());
