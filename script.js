function updateTauxPresence() {
	const rows = document.querySelectorAll("#tablePresence tr");
	let total = rows.length;
	let presents = 0;

	rows.forEach((row) => {
		const statutCell = row.querySelector(".statut");
		if (statutCell && statutCell.textContent.includes("Présent")) {
			presents++;
		}
	});

	let taux = total > 0 ? Math.round((presents / total) * 100) : 0;
	document.getElementById("tauxPresence").textContent = taux + "%";
}

document.getElementById("btnPresence").addEventListener("click", function () {
	const nom = prompt("Nom de la personne :");
	const activite = prompt("Activité :");
	const heure = prompt("Heure d'arrivée :");

	if (!nom) return;

	const tr = document.createElement("tr");

	tr.innerHTML = `
        <td>${nom}</td>
        <td>${activite}</td>
        <td>${heure}</td>
        <td class="statut">
            <span class="btn-emoji" data-type="present">✅</span>
            <span class="btn-emoji" data-type="absent">❌</span>
        </td>
    `;

	document.getElementById("tablePresence").appendChild(tr);

	const presentBtn = tr.querySelector('[data-type="present"]');
	const absentBtn = tr.querySelector('[data-type="absent"]');
	const statutCell = tr.querySelector(".statut");

	presentBtn.onclick = () => {
		statutCell.innerHTML = `<span class="badge" style="color:green;font-weight:bold;">Présent</span>`;
		updateTauxPresence();
	};

	absentBtn.onclick = () => {
		statutCell.innerHTML = `<span class="badge" style="color:red;font-weight:bold;">Absent</span>`;
		updateTauxPresence();
	};

	updateTauxPresence();
});

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
