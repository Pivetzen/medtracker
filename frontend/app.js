const API = window.location.origin;

// Carregar medicamentos
async function loadMeds() {
  try {
    const res = await fetch(`${API}/meds`);
    const meds = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    meds.forEach(med => {
      const next = med.last_taken + med.interval * 3600000;
      const remaining = next - Date.now();

      const minutes = Math.max(0, Math.round(remaining / 60000));

      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${med.name}</strong> 
        - Próxima dose em ${minutes} min
        <button onclick="takeMed(${med.id})">Tomar</button>
      `;

      list.appendChild(li);

      if (remaining <= 0) notify(med.name);
    });

  } catch (error) {
    console.error("Erro ao carregar medicamentos:", error);
  }
}

// Adicionar medicamento
async function addMed() {
  const name = document.getElementById("name").value;
  const interval = document.getElementById("interval").value;

  if (!name || !interval) {
    alert("Preencha todos os campos");
    return;
  }

  await fetch(`${API}/meds`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, interval })
  });

  document.getElementById("name").value = "";
  document.getElementById("interval").value = "";

  loadMeds();
}

// Registrar uso
async function takeMed(id) {
  await fetch(`${API}/take/${id}`, { method: "POST" });
  loadMeds();
}

// Notificação
function notify(name) {
  if (Notification.permission === "granted") {
    new Notification(`Hora de tomar ${name}`);
  }
}

// Solicitar permissão
if ("Notification" in window) {
  Notification.requestPermission();
}

// Atualiza a cada 1 minuto
setInterval(loadMeds, 60000);

// Inicial
loadMeds();
