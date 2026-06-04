<script lang="ts">
    let {
        colorConfig = {},
        totalKP = 0,
        allActiveModules = [],
    }: {
        colorConfig: Record<string, any>,
        totalKP: number,
        allActiveModules: Array<Record<string, any>>,
    } = $props();

    // Collect the CSS class names that are actually used by the current modules.
    let usedClasses = $derived(
        new Set(allActiveModules.map(m => m?.standardcategory || 'unknown'))
    );

    // Keep only the categories from colorConfig that are actually present,
    // preserving the order defined in colorConfig rather than insertion order.
    let activeCategories = $derived(
        (colorConfig?.kategorien || []).filter(
            (cat: Record<string, any>) => usedClasses.has(cat.name)
        )
    );
</script>

<div class="farben-legende">
    <div class="legende-titel" id="legende-titel">Farben-Legende</div>
    <div id="legende">
        {#each activeCategories as cat}
            <div class="legende-item {cat.klasse}">
                <div class="legende-text">{cat.name}</div>
            </div>
        {/each}
    </div>
    <div id="kp-counter" class="kp-counter-box">
        <div id="kp-total">Gesamt: <strong>{totalKP} KP</strong> (mind. 180 KP erforderlich)</div>
    </div>
</div>