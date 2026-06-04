// src/lib/utils/state.js

/**
 * Normalizes raw institution data from JSON into a consistent shape.
 * @param {any} raw
 * @param {string} type
 * @returns {any}
 */
export function normalizeInstitution(raw, type) {
  if (!raw) return { name: "Unbekannt", website: "", type, categories: [] };

  return {
    name: raw.name,
    website: raw.website,
    type,
    categories: (raw.kategorien || []).map(normalizeCategory),
  };
}

/**
 * @param {any} kat
 * @returns {any}
 */
function normalizeCategory(kat) {
  /** @type {any} */
  const category = { name: kat.name };

  if (kat.unterkategorien) {
    category.subcategories = kat.unterkategorien.map(
      (/** @type {any} */ uk) => ({
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
 * @param {any[]} [studiengaenge=[]]
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
 * Returns true if the program is a minor (at most 60 ECTS).
 * @param {any} program
 * @returns {boolean}
 */
export function isMinor(program) {
  const ectsText = program.ects || program.degree || "";
  const numbers = ectsText.match(/\d+/g);
  if (!numbers) return false;

  const maxValue = Math.max(
    ...numbers.map((/** @type {string} */ n) => parseInt(n, 10)),
  );
  return maxValue <= 60;
}
