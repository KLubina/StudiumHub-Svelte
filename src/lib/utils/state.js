// src/lib/utils/state.js

/**
 * Normalisiert die Rohdaten einer Hochschule.
 * @param {any} raw - Die rohen JSON-Daten der Hochschule.
 * @param {string} type - Der Typ der Hochschule ('uni' oder 'fh').
 * @returns {any} Die normalisierte Hochschule.
 */
export function normalizeInstitution(raw, type) {
  const rawCategories = raw.kategorien || [];
  return {
    name: raw.name,
    website: raw.website,
    type: type,
    categories: rawCategories.map(
      /** @param {any} kat */ (kat) => normalizeCategory(kat),
    ),
  };
}

/**
 * Normalisiert eine einzelne Kategorie.
 * @param {any} kat - Die rohe Kategorie.
 * @returns {any} Die strukturierte Kategorie.
 */
function normalizeCategory(kat) {
  /** @type {any} */
  const category = { name: kat.name };

  if (kat.unterkategorien) {
    category.subcategories = kat.unterkategorien.map(
      /** @param {any} uk */ (uk) => ({
        name: uk.name,
        programs: normalizePrograms(uk.studiengaenge),
      }),
    );
  }
  if (kat.studiengaenge) {
    category.programs = normalizePrograms(kat.studiengaenge);
  }
  return category;
}

/**
 * Normalisiert eine Liste von Studiengängen.
 * @param {any[]} [studiengaenge=[]] - Array von rohen Studiengängen.
 * @returns {any[]}
 */
function normalizePrograms(studiengaenge = []) {
  return studiengaenge.map((p) => ({
    ...p,
    description: p.beschreibung,
    degree: p.grad,
  }));
}

/**
 * Prüft, ob es sich bei dem Studiengang um ein Nebenfach (Minor) handelt.
 * @param {any} program - Das Studiengang-Objekt.
 * @returns {boolean}
 */
export function isMinor(program) {
  const ectsText = program.ects || program.degree || "";
  const numbers = ectsText.match(/\d+/g);
  if (!numbers) return false;

  // Typisiert den Parameter 'n' innerhalb von map explizit als String/Nummer, um Fehler 7006 zu beheben
  const parsedNumbers = numbers.map(
    /** @param {string} n */ (n) => parseInt(n, 10),
  );
  const maxValue = Math.max(...parsedNumbers);

  return maxValue <= 60;
}
