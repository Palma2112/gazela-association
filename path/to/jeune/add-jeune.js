// add-jeune.js
import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client";

import {
  db,
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
} from "./firebase.js";

function FormJeune() {
  const initialState = {
    nom: "",
    age: "",
    telephone: "",
    programme: "",
    statut: "actif",
    dernierePresence: "",
    description: "",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [editID, setEditID] = useState(null);

  useEffect(() => {
    // si localStorage contient editID, on charge le document
    const id = localStorage.getItem("editID");
    if (id) {
      setEditID(id);
      localStorage.removeItem("editID");
      loadJeune(id);
    }
  }, []);

  async function loadJeune(id) {
    setLoading(true);
    try {
      const ref = doc(db, "jeunes", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          nom: data.nom || "",
          age: data.age ?? "",
          telephone: data.telephone || "",
          programme: data.programme || "",
          statut: data.statut || "actif",
          dernierePresence: data.dernierePresence || "",
          description: data.description || "",
        });
      } else {
        alert("Jeune introuvable.");
      }
    } catch (err) {
      console.error("Erreur de chargement:", err);
      alert("Impossible de charger le jeune.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validPhone(phone) {
    if (!phone) return true; // facultatif
    const re = /^[0-9]{7,15}$/; // accepte entre 7 et 15 chiffres
    return re.test(phone);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nom.trim()) {
      alert("Le nom est requis.");
      return;
    }
    if (!validPhone(form.telephone)) {
      alert(
        "Le téléphone doit contenir seulement des chiffres (7 à 15 chiffres)."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nom: form.nom.trim(),
        age: form.age === "" ? null : Number(form.age),
        telephone: form.telephone || "",
        programme: form.programme || "",
        statut: form.statut || "actif",
        dernierePresence:
          form.dernierePresence || new Date().toISOString().split("T")[0],
        description: form.description || "",
        updatedAt: serverTimestamp(),
      };

      if (editID) {
        const ref = doc(db, "jeunes", editID);
        await updateDoc(ref, payload);
        alert("Jeune mis à jour.");
      } else {
        const col = collection(db, "jeunes");
        await addDoc(col, { ...payload, createdAt: serverTimestamp() });
        alert("Jeune ajouté.");
      }

      // retour à la liste
      window.location.href = "jeune.html";
    } catch (err) {
      console.error("Erreur enregistrement:", err);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="card p-4 shadow-sm"
      style={{ maxWidth: 700 }}
      onSubmit={handleSubmit}
    >
      {loading && <div className="alert alert-info">Traitement en cours…</div>}

      <div className="mb-3">
        <label className="form-label">Nom *</label>
        <input
          name="nom"
          className="form-control"
          value={form.nom}
          onChange={updateField}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Âge</label>
        <input
          type="number"
          name="age"
          className="form-control"
          min="0"
          value={form.age ?? ""}
          onChange={updateField}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Téléphone</label>
        <input
          type="tel"
          name="telephone"
          className="form-control"
          value={form.telephone}
          onChange={updateField}
          placeholder="Ex: 0341234567"
        />
        <div className="form-text">Chiffres seulement, 7 à 15 chiffres.</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Programme</label>
        <input
          name="programme"
          className="form-control"
          value={form.programme}
          onChange={updateField}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          value={form.description}
          onChange={updateField}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Statut</label>
        <select
          name="statut"
          className="form-select"
          value={form.statut}
          onChange={updateField}
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
          <option value="suspendu">Suspendu</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Dernière présence</label>
        <input
          type="date"
          name="dernierePresence"
          className="form-control"
          value={form.dernierePresence}
          onChange={updateField}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {editID ? "Mettre à jour" : "Enregistrer"}
      </button>

      <button
        type="button"
        className="btn btn-secondary w-100 mt-2"
        onClick={() => (window.location.href = "jeune.html")}
        disabled={loading}
      >
        Annuler
      </button>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(React.createElement(FormJeune));
