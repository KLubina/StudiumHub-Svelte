<script>
  // Svelte 5 Props Definition
  let { currentView = $bindable(), filters = $bindable(), showMinors = $bindable(), allData } = $props();

  // Dynamische Kategorien für das Dropdown sammeln
  let categories = $derived(() => {
    const set = new Set();
    allData.forEach(inst => {
      inst.categories.forEach(cat => set.add(cat.name));
    });
    return Array.from(set).sort();
  });
</script>

<div class="view-toggle">
  <button 
    class="view-btn {currentView === 'institution' ? 'active' : ''}" 
    onclick={() => currentView = 'institution'}
  >
    Nach Hochschule
  </button>
  <button 
    class="view-btn {currentView === 'category' ? 'active' : ''}" 
    onclick={() => currentView = 'category'}
  >
    Nach Kategorie
  </button>
  <button 
    class="view-btn {currentView === 'all_visualizations' ? 'active' : ''}" 
    onclick={() => currentView = 'all_visualizations'}
  >
    Visualisierungen
  </button>
</div>

{#if currentView !== 'all_visualizations'}
  <div class="filter-container">
    <div class="filter-group">
      <label for="typeFilter">Typ:</label>
      <select id="typeFilter" bind:value={filters.type}>
        <option value="">-- Alle Typen --</option>
        <option value="uni">Universität (Uni)</option>
        <option value="fh">Fachhochschule (FH)</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="institutionFilter">Hochschule:</label>
      <select id="institutionFilter" bind:value={filters.institution}>
        <option value="">-- Alle Hochschulen --</option>
        <option value="group_zurich">📍 Zürich (ETH, UZH, ZHAW, FHNW)</option>
        {#each allData as inst}
          <option value={inst.name}>
            {inst.type === 'uni' ? '[Uni]' : '[FH]'} {inst.name}
          </option>
        {/each}
      </select>
    </div>

    {#if currentView === 'institution'}
      <div class="filter-group">
        <label for="categoryFilter">Kategorie:</label>
        <select id="categoryFilter" bind:value={filters.category}>
          <option value="">-- Alle Kategorien --</option>
          {#each categories() as catName}
            <option value={catName}>{catName}</option>
          {/each}
        </select>
      </div>
    {/if}

    <div class="checkbox-group">
      <input type="checkbox" id="showMinors" bind:checked={showMinors} />
      <label for="showMinors">Nebenfächer (≤ 60 ECTS) anzeigen</label>
    </div>
  </div>
{/if}