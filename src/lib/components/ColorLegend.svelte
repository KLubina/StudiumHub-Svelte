<script lang="ts">
  export let colorConfig: Record<string, any> = {};
  export let totalKP: number = 0;
  export let allActiveModules: Array<Record<string, any>> = [];

  $: activeCategories = [...new Set(allActiveModules.map(m => m?.standardcategory || 'unknown'))];

  function getCategoryLabel(catClass: string): string {
    if (colorConfig?.kategorien) {
      const found = colorConfig.kategorien.find((c: Record<string, any>) => c.klasse === catClass);
      if (found) return found.name;
    }
    return catClass;
  }
</script>

<div class="farben-legende">
  <div class="legende-titel" id="legende-titel">Farben-Legende</div>
  <div id="legende">
    {#each activeCategories as cat}
      <div class="legende-item {cat}">
        <div class="legende-text">{getCategoryLabel(cat)}</div>
      </div>
    {/each}
  </div>

  <div id="kp-counter" class="kp-counter-box">
    <div id="kp-total">Gesamt: <strong>{totalKP} KP</strong> (mind. 180 KP erforderlich)</div>
  </div>
</div>