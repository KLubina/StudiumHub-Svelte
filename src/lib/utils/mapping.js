// src/lib/utils/mapping.js

/**
 * Eindeutige Mappings, bei denen der Studiengangsname schweizweit einzigartig ist
 * oder eine spezifische Custom-URL besitzt.
 */
export const StudiengangMapping = {
  "Gesundheitswissenschaften und Technologie": {
    key: "eth-hst",
    institution: "ETH Zürich",
  },
  "Lebensmittelwissenschaften und Ernährung": {
    key: "eth-lmw",
    institution: "ETH Zürich",
  },
  Mathematik: { key: "eth-math", institution: "ETH Zürich" },
  "Rechnergestützte Wissenschaften": {
    key: "eth-cse",
    institution: "ETH Zürich",
  },
  "Raumbezogene Ingenieurwissenschaften": {
    key: "eth-rig",
    institution: "ETH Zürich",
  },
  Maschineningenieurwissenschaften: {
    key: "eth-masch",
    institution: "ETH Zürich",
  },
  Materialwissenschaft: { key: "eth-matw", institution: "ETH Zürich" },
  Physik: { key: "eth-physik", institution: "ETH Zürich" },
  Chemieingenieurwissenschaften: { key: "eth-chab", institution: "ETH Zürich" },

  Geschichte: { key: "uzh-geschichte", institution: "Universität Zürich" },
  Politikwissenschaft: {
    key: "uzh-polisci",
    institution: "Universität Zürich",
  },
  Ethnologie: { key: "uzh-ethnologie", institution: "Universität Zürich" },
  Kommunikationswissenschaft: {
    key: "uzh-kommunikation",
    institution: "Universität Zürich",
  },
  "Populäre Kulturen": {
    key: "uzh-pop-kultur",
    institution: "Universität Zürich",
  },
  Soziologie: { key: "uzh-soziologie", institution: "Universität Zürich" },
  Rechtswissenschaft: { key: "uzh-law", institution: "Universität Zürich" },
  Psychologie: {
    key: "uzh-psychologie",
    institution: "Universität Zürich",
    customUrl:
      "study-visualization/program-specific/uzh-psychologie/index.html",
  },

  "Sport, Bewegung und Gesundheit": {
    key: "unibas-sbg",
    institution: "Universität Basel",
  },
  "Sport, Bewegung & Gesundheit": {
    key: "unibas-sbg",
    institution: "Universität Basel",
  },

  "Informatik - Teilzeit": {
    key: "fhbern-cs-tz",
    institution: "Berner Fachhochschule",
  },

  "Artificial Intelligence in Software Engineering": {
    key: "fhgr-aise",
    institution: "FH Graubünden",
  },
  "Computational and Data Science": {
    key: "fhgr-cds",
    institution: "FH Graubünden",
  },

  "Data Science": { key: "zhaw-data-science", institution: "ZHAW" },
  "Food Science": { key: "zhaw-food-science", institution: "ZHAW" },
  "Applied Digital Life Sciences": {
    key: "zhaw-applied-digital-life-sciences",
    institution: "ZHAW",
  },
  "Applied Digital Life Science": {
    key: "zhaw-applied-digital-life-sciences",
    institution: "ZHAW",
  },
  "Wirtschaftsinformatik - Business Information Systems - Teilzeit": {
    key: "zhaw-win-bis-tz",
    institution: "ZHAW",
  },
  "Wirtschaftsinformatik - Data Science - Teilzeit": {
    key: "zhaw-win-bis-tz",
    institution: "ZHAW",
  },
  "Informatik (Teilzeit)": { key: "fhzh-cs-tz", institution: "ZHAW" },
  Systemtechnik: { key: "fhzh-systemtechnik", institution: "ZHAW" },
  Medizininformatik: { key: "fhzh-medizininformatik", institution: "ZHAW" },

  "Informatik - Teilzeit - Assessment": { key: "hslu-cs-tz" },

  "Electrical and Computer Engineering": {
    key: "ost-eit",
    institution: "OST Ostschweizer Fachhochschule",
  },
  "Informatik - Assessment": {
    key: "ost-cs-assessment",
    institution: "Ostschweizer Fachhochschule",
  },

  IT: { key: "hssh-it", institution: "Hochschulinstitut Schaffhausen" },

  "Computer Engineering": {
    key: "aspira-ce",
    institution: "Aspira College Split",
  },

  Ergotherapie: { key: "zhaw-ergotherapie", institution: "ZHAW" },
  "Gesundheitsförderung und Prävention": {
    key: "zhaw-gesundheitsfoerderung",
    institution: "ZHAW",
  },
  Pflege: { key: "zhaw-pflege", institution: "ZHAW" },
  Physiotherapie: { key: "zhaw-physio", institution: "ZHAW" },
};

/**
 * Ermittelt die passende Visualisierungs-URL anhand von Studiengang und Hochschule.
 * JSDoc-Typen verhindern die TypeScript 'implicitly has any type' Fehler.
 * * @param {string} studiengangName
 * @param {string} institutionName
 * @returns {string|null}
 */
export function getLink(studiengangName, institutionName) {
  // Verhindert Fehler beim Auslesen dynamischer Properties im Compiler
  /** @type {any} */
  const mappingTable = StudiengangMapping;
  let mapping = mappingTable[studiengangName];

  if (
    mapping &&
    (!mapping.institution || mapping.institution === institutionName)
  ) {
    if (mapping.customUrl) return mapping.customUrl;
    return `study-visualization/standard/specificprogram-template.html?studiengang=${encodeURIComponent(mapping.key)}`;
  }

  // Mehrdeutige Fächer werden hier explizit nach Hochschule getrennt aufgelöst:
  if (
    studiengangName === "Elektrotechnik und Informationstechnologie" ||
    studiengangName === "Elektro- und Informationstechnik" ||
    studiengangName === "Elektrotechnik"
  ) {
    if (institutionName === "Berner Fachhochschule")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhbern-eit`;
    if (institutionName === "Hochschule Luzern")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhlu-eit`;
    if (
      institutionName === "OST Ostschweizer Fachhochschule" ||
      institutionName === "Ostschweizer Fachhochschule"
    )
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhost-eit`;
    if (institutionName === "Fachhochschule Nordwestschweiz")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhnw-eit`;
    if (institutionName === "ETH Zürich")
      return `study-visualization/standard/specificprogram-template.html?studiengang=eth-itet`;
    if (institutionName === "ZHAW")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhzh-elektrotechnik`;
  }

  if (studiengangName === "Informatik") {
    if (institutionName === "ZHAW")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhzh-cs`;
    if (institutionName === "ETH Zürich")
      return `study-visualization/standard/specificprogram-template.html?studiengang=eth-cs`;
    if (institutionName === "Universität Zürich")
      return `study-visualization/standard/specificprogram-template.html?studiengang=uzh-informatik`;
    if (institutionName === "Berner Fachhochschule")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhbern-cs`;
    if (institutionName === "Fachhochschule Nordwestschweiz")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhnw-cs`;
    if (institutionName === "Hochschule Luzern" || institutionName === "HSLU")
      return `study-visualization/standard/specificprogram-template.html?studiengang=hslu-cs`;
    if (
      institutionName === "Ostschweizer Fachhochschule" ||
      institutionName === "OST"
    )
      return `study-visualization/standard/specificprogram-template.html?studiengang=ost-cs`;
    if (institutionName === "FFHS")
      return `study-visualization/standard/specificprogram-template.html?studiengang=ffhs-informatik`;
    if (
      institutionName === "FernUniversität in Hagen" ||
      institutionName === "FernUni Hagen"
    )
      return `study-visualization/standard/specificprogram-template.html?studiengang=fernuni-hagen-cs`;
  }

  if (studiengangName === "Wirtschaftsinformatik") {
    if (institutionName === "ZHAW")
      return `study-visualization/standard/specificprogram-template.html?studiengang=zhaw-win-bis-tz`;
    if (institutionName === "Fachhochschule Nordwestschweiz")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhnw-wirtschaftsinformatik`;
  }

  if (
    studiengangName === "Betriebsökonomie" ||
    studiengangName === "Betriebsoekonomie"
  ) {
    if (institutionName === "ZHAW")
      return `study-visualization/standard/specificprogram-template.html?studiengang=zhaw-betriebsoekonomie`;
    if (institutionName === "Fachhochschule Nordwestschweiz")
      return `study-visualization/standard/specificprogram-template.html?studiengang=fhnw-betriebsoekonomie`;
  }

  if (studiengangName === "Betriebswirtschaftslehre") {
    if (institutionName === "Universität Zürich")
      return `study-visualization/standard/specificprogram-template.html?studiengang=uzh-bwl`;
    if (institutionName === "Universität St.Gallen")
      return `study-visualization/standard/specificprogram-template.html?studiengang=unisg-bwl`;
  }

  if (studiengangName === "Humanmedizin") {
    if (institutionName === "ETH Zürich")
      return `study-visualization/standard/specificprogram-template.html?studiengang=eth-humanmedizin`;
    if (institutionName === "Universität Zürich")
      return `study-visualization/standard/specificprogram-template.html?studiengang=uzh-humanmedizin`;
  }

  return null;
}
