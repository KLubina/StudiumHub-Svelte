<script>
  import InstitutionSection from './InstitutionSection.svelte';
  import CategorySection from './CategorySection.svelte';

  let { allData, currentView, filters, showMinors } = $props();

  /** @param {any} program */
  function isMinor(program) {
    const ectsText = program.ects || program.degree || "";
    const numbers = ectsText.match(/\d+/g);
    if (!numbers) return false;
    const maxValue = Math.max(...numbers.map((/** @type {any} */ n) => parseInt(n, 10)));
    return maxValue <= 60;
  }

  let filteredData = $derived(() => {
    let data = JSON.parse(JSON.stringify(allData));

    if (filters.type) {
      data = data.filter((/** @type {any} */ inst) => inst.type === filters.type);
    }

    if (filters.institution) {
      if (filters.institution === "group_zurich") {
        const zurichInsts = ["ETH Zürich", "Universität Zürich", "ZHAW", "Fachhochschule Nordwestschweiz"];
        data = data.filter((/** @type {any} */ inst) => zurichInsts.includes(inst.name));
      } else {
        data = data.filter((/** @type {any} */ inst) => inst.name === filters.institution);
      }
    }

    data.forEach((/** @type {any} */ inst) => {
      inst.categories = inst.categories.filter((/** @type {any} */ cat) => {
        if (currentView === 'institution' && filters.category && cat.name !== filters.category) {
          return false;
        }

        if (cat.programs) {
          cat.programs = cat.programs.filter((/** @type {any} */ p) => showMinors || !isMinor(p));
        }

        if (cat.subcategories) {
          cat.subcategories = cat.subcategories.filter((/** @type {any} */ sub) => {
            if (sub.programs) {
              sub.programs = sub.programs.filter((/** @type {any} */ p) => showMinors || !isMinor(p));
            }
            return sub.programs && sub.programs.length > 0;
          });
        }

        return (cat.programs && cat.programs.length > 0) || (cat.subcategories && cat.subcategories.length > 0);
      });
    });

    return data.filter((/** @type {any} */ inst) => inst.categories.length > 0);
  });

  let categoriesData = $derived(() => {
    const catMap = new Map();

    filteredData().forEach((/** @type {any} */ inst) => {
      inst.categories.forEach((/** @type {any} */ cat) => {
        if (!catMap.has(cat.name)) {
          catMap.set(cat.name, { name: cat.name, institutions: [] });
        }
        
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