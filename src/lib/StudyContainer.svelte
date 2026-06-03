<script>
  import InstitutionSection from './InstitutionSection.svelte';
  import CategorySection from './CategorySection.svelte';

  let { allData, currentView, filters, showMinors } = $props();

  // Hilfsfunktion: Prüft, ob ein Studiengang ein Nebenfach ist (aus filters.js)
  function isMinor(program) {
    const ectsText = program.ects || program.degree || "";
    const numbers = ectsText.match(/\d+/g);
    if (!numbers) return false;
    const maxValue = Math.max(...numbers.map(n => parseInt(n, 10)));
    return maxValue <= 60;
  }

  // Svelte 5 Reaktiver Filter (ersetzt filters.js & rendering.js Transformationen)
  let filteredData = $derived(() => {
    // Tiefe Kopie ziehen, um UI-Mutationen zu verhindern
    let data = JSON.parse(JSON.stringify(allData));

    // 1. Typ Filter (Uni/FH)
    if (filters.type) {
      data = data.filter(inst => inst.type === filters.type);
    }

    // 2. Institution / Gruppe Filter
    if (filters.institution) {
      if (filters.institution === "group_zurich") {
        const zurichInsts = ["ETH Zürich", "Universität Zürich", "ZHAW", "Fachhochschule Nordwestschweiz"];
        data = data.filter(inst => zurichInsts.includes(inst.name));
      } else {
        data = data.filter(inst => inst.name === filters.institution);
      }
    }

    // 3. Nebenfächer Filter & Kategorie Filter
    data.forEach(inst => {
      inst.categories = inst.categories.filter(cat => {
        // Falls Kategorie-Filter aktiv (nur in der Institutionen-Ansicht wichtig)
        if (currentView === 'institution' && filters.category && cat.name !== filters.category) {
          return false;
        }

        // Programme filtern (Direkte Programme)
        if (cat.programs) {
          cat.programs = cat.programs.filter(p => showMinors || !isMinor(p));
        }

        // Unterkategorien filtern
        if (cat.subcategories) {
          cat.subcategories = cat.subcategories.filter(sub => {
            if (sub.programs) {
              sub.programs = sub.programs.filter(p => showMinors || !isMinor(p));
            }
            return sub.programs && sub.programs.length > 0;
          });
        }

        // Behalten, wenn Programme oder Unterkategorien übrig sind
        return (cat.programs && cat.programs.length > 0) || (cat.subcategories && cat.subcategories.length > 0);
      });
    });

    return data.filter(inst => inst.categories.length > 0);
  });

  // Transformation für die Kategorie-Ansicht (Kategorien oben)
  let categoriesData = $derived(() => {
    const catMap = new Map();

    filteredData().forEach(inst => {
      inst.categories.forEach(cat => {
        if (!catMap.has(cat.name)) {
          catMap.set(cat.name, { name: cat.name, institutions: [] });
        }
        
        // Verpacke die Studiengänge dieser Institution für diese Kategorie
        catMap.get(cat.name).institutions.push({
          name: inst.name,
          type: inst.type,
          website: inst.website,
          programs: cat.programs || [],
          subcategories: cat.subcategories || []
        });
      });
    });

    return Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  });
</script>

<div id="studyProgramsContainer">
  {#if filteredData().length === 0}
    <div class="no-results">
      <p>Keine Studiengänge gefunden.</p>
      <p>Bitte versuche es mit anderen Filterkriterien.</p>
    </div>
  {:else}
    {#if currentView === 'institution'}
      {#each filteredData() as uni}
        <InstitutionSection {uni} />
      {/each}
    {:else}
      {#each categoriesData() as category}
        <CategorySection {category} />
      {/each}
    {/if}
  {/if}
</div>