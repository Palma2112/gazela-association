import React, { useEffect, useState } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom/client";

import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Accordion pour chaque jeune
function JeuneAccordion({ jeune, index }) {
  const handleDelete = async () => {
    if (confirm("Supprimer ce jeune ?")) {
      await deleteDoc(doc(db, "jeunes", jeune.id));
    }
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`heading-${index}`}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${index}`}
          aria-expanded="false"
          aria-controls={`collapse-${index}`}
        >
          {jeune.nom || "—"} ({jeune.statut || "—"})
        </button>
      </h2>
      <div
        id={`collapse-${index}`}
        className="accordion-collapse collapse"
        aria-labelledby={`heading-${index}`}
      >
        <div className="accordion-body">
          <p>Âge : {jeune.age || "—"}</p>
          <p>Programme : {jeune.programme || "—"}</p>
          <p>Téléphone : {jeune.telephone || "—"}</p>
          <p>Dernière présence : {jeune.dernierePresence || "—"}</p>
          <div className="mt-2">
            <button
              className="btn btn-warning me-2"
              onClick={() => {
                localStorage.setItem("editID", jeune.id);
                window.location.href = "add-jeune.html";
              }}
            >
              Modifier
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [jeunes, setJeunes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const colRef = collection(db, "jeunes");
    const unsub = onSnapshot(colRef, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("Firestore jeunes:", data); // Vérifie que ça reçoit bien les données
      setJeunes(data);
    });
    return unsub;
  }, []);

  const filtered = jeunes.filter((j) =>
    j.nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <input
        className="form-control mb-3"
        placeholder="Rechercher un jeune"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p>Aucun jeune trouvé.</p>
      ) : (
        <div className="accordion" id="accordionJeunes">
          {filtered.map((j, i) => (
            <JeuneAccordion key={j.id} jeune={j} index={i} />
          ))}
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("react-root")).render(<App />);
