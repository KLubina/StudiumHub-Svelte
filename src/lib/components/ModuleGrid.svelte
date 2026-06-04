<script lang="ts">
    import ModuleCard from './ModuleCard.svelte';

    let {
        modules = [],
        selectedWahlmodule = {},
        moduleDetails = {},
        colorConfig = {},
        activeTooltip = $bindable(null),
        activeWahlmodulDialog = $bindable(null),
    }: {
        modules: Array<Record<string, any>>,
        selectedWahlmodule: Record<string, any[]>,
        moduleDetails: Record<string, any>,
        colorConfig: Record<string, any>,
        activeTooltip: Record<string, any> | null,
        activeWahlmodulDialog: Record<string, any> | null,
    } = $props();

    // Build a lookup from category display name to its CSS class name.
    // e.g. "Fachgrundlagen & Fachergänzungen" -> "fachgrundlagen"
    let categoryClassMap = $derived(
        (colorConfig?.kategorien || []).reduce((map: Record<string, string>, cat: Record<string, any>) => {
            map[cat.name] = cat.klasse;
            return map;
        }, {} as Record<string, string>)
    );

    let groupedYears = $derived(
        modules.reduce((acc: Record<string, Record<string, any[]>>, m) => {
            const year     = m?.year     || 1;
            const semester = m?.semester || 1;
            if (!acc[year])           acc[year] = {};
            if (!acc[year][semester]) acc[year][semester] = [];
            acc[year][semester].push(m);
            return acc;
        }, {})
    );

    function triggerTooltip(event: MouseEvent, moduleItem: Record<string, any>) {
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;
        if (!target) return;

        const rect    = target.getBoundingClientRect();
        activeTooltip = {
            module:  moduleItem,
            details: moduleDetails[moduleItem.name] || null,
            x:       rect.right + 10 + window.scrollX,
            y:       rect.top        + window.scrollY,
        };
    }
</script>

<div class="specificprogram" id="specificprogram">
    {#each Object.keys(groupedYears).sort((a, b) => Number(a) - Number(b)) as year}
        <div class="jahr">
            <h3 class="year-title">{year}. Jahr</h3>

            {#each Object.keys(groupedYears[year]).sort((a, b) => Number(a) - Number(b)) as semester}
                <div class="semester">
                    <h4 class="semester-title">
                        {Number(semester) % 2 === 1 ? 'Herbstsemester' : 'Frühlingssemester'}
                    </h4>

                    <div class="module-container">
                        {#each groupedYears[year][semester] as module}
                            {#if module?.isPlaceholder}
                                <ModuleCard
                                    {module}
                                    cssClass={categoryClassMap[module.standardcategory] || 'unknown'}
                                    isPlaceholder={true}
                                    onCardClick={(e) => {
                                        e.stopPropagation();
                                        activeWahlmodulDialog = { placeholderName: module.name, source: module.wahlmodulSource };
                                    }}
                                />

                                {#if selectedWahlmodule[module.name]}
                                    <div class="wahlmodul-selected-container" style="display: contents;">
                                        {#each selectedWahlmodule[module.name] as wahlmodul}
                                            <ModuleCard
                                                module={wahlmodul}
                                                cssClass={categoryClassMap[wahlmodul.standardcategory] || 'unknown'}
                                                details={moduleDetails[wahlmodul.name]}
                                                onCardClick={(e) => triggerTooltip(e, wahlmodul)}
                                            />
                                        {/each}
                                    </div>
                                {/if}
                            {:else}
                                <ModuleCard
                                    {module}
                                    cssClass={categoryClassMap[module.standardcategory] || 'unknown'}
                                    details={moduleDetails[module.name]}
                                    onCardClick={(e) => triggerTooltip(e, module)}
                                />
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>