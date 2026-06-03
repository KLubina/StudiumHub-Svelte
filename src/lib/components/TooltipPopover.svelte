<script lang="ts">
  export let tooltip: Record<string, any> | null = null;

  // Nutzen von Optional Chaining bei der Zuweisung zur Absicherung gegen Null-Werte
  $: module = tooltip?.module;
  $: details = tooltip?.details;
  $: adjustedX = tooltip ? ((tooltip.x + 320 > window.innerWidth) ? (tooltip.x - 640) : tooltip.x) : 0;
</script>

{#if tooltip && module}
  <div 
    id="tooltip" 
    class="tooltip-container" 
    style="position: absolute; left: {adjustedX}px; top: {tooltip.y}px; display: block;"
    on:click|stopPropagation
    on:keydown|stopPropagation
    role="tooltip"
    tabindex="-1"
  >
    <h3>{module?.name}</h3>
    <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">{module?.ects || 0} KP</div>

    {#if details}
      {#if details?.kurzbeschreibung}
        <h4>Kurzbeschreibung</h4>
        <p>{details.kurzbeschreibung}</p>
      {/if}

      {#if details?.inhalt}
        <h4>Inhalte</h4>
        <p style="white-space: pre-wrap; font-size: 0.85em; line-height: 1.3;">{details.inhalt}</p>
      {/if}

      {#if details?.vorlesungslink || details?.skript || details?.pruefungen || details?.link || details?.kurslink}
        <h4>Ressourcen</h4>
        {#if details?.vorlesungslink}
          <p><a href={details.vorlesungslink} target="_blank" rel="noreferrer">🎥 Vorlesungsvideos</a></p>
        {/if}
        {#if details?.skript}
          <p><a href={details.skript} target="_blank" rel="noreferrer">📄 Skript</a></p>
        {/if}
        {#if details?.pruefungen}
          <p><a href={details.pruefungen} target="_blank" rel="noreferrer">📝 Alte Prüfungen</a></p>
        {/if}
        {#if details?.link}
          <p><a href={details.link} target="_blank" rel="noreferrer">📖 VVZ Seite</a></p>
        {/if}
        {#if details?.kurslink}
          <p><a href={details.kurslink} target="_blank" rel="noreferrer">📚 Kursunterlagen</a></p>
        {/if}
        {/if}
    {:else}
      <p style="color: #999; font-size: 0.9em;">Keine weiteren Details verfügbar</p>
    {/if}
  </div>
{/if}