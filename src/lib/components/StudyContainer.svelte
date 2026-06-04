<script>
    import InstitutionSection from './InstitutionSection.svelte';
    import CategorySection from './CategorySection.svelte';
    import { isMinor } from '../utils/state.js';

    let { allData, currentView, filters, showMinors } = $props();

    /** @param {any} cat */
    function filterCategory(cat) {
        if (currentView === 'institution' && filters.category && cat.name !== filters.category) {
            return null;
        }

        const filteredPrograms = (cat.programs || []).filter((/** @type {any} */ p) => showMinors || !isMinor(p));

        const filteredSubcategories = (cat.subcategories || [])
            .map((/** @type {any} */ sub) => ({
                ...sub,
                programs: (sub.programs || []).filter((/** @type {any} */ p) => showMinors || !isMinor(p)),
            }))
            .filter((/** @type {any} */ sub) => sub.programs.length > 0);

        const hasPrograms      = filteredPrograms.length > 0;
        const hasSubcategories = filteredSubcategories.length > 0;

        if (!hasPrograms && !hasSubcategories) return null;

        return {
            ...cat,
            programs: filteredPrograms,
            subcategories: filteredSubcategories,
        };
    }

    function buildFilteredData() {
        /** @type {any[]} */
        let data = allData;

        if (filters.type) {
            data = data.filter((/** @type {any} */ inst) => inst.type === filters.type);
        }

        if (filters.institution === 'group_zurich') {
            const zurichInstitutions = ['ETH Zürich', 'Universität Zürich', 'ZHAW', 'Fachhochschule Nordwestschweiz'];
            data = data.filter((/** @type {any} */ inst) => zurichInstitutions.includes(inst.name));
        } else if (filters.institution) {
            data = data.filter((/** @type {any} */ inst) => inst.name === filters.institution);
        }

        return data
            .map((/** @type {any} */ inst) => ({
                ...inst,
                categories: inst.categories.map(filterCategory).filter(Boolean),
            }))
            .filter((/** @type {any} */ inst) => inst.categories.length > 0);
    }

    /** @param {any[]} filteredData */
    function buildCategoriesData(filteredData) {
        const catMap = new Map();

        filteredData.forEach((/** @type {any} */ inst) => {
            inst.categories.forEach((/** @type {any} */ cat) => {
                if (!catMap.has(cat.name)) {
                    catMap.set(cat.name, { name: cat.name, institutions: [] });
                }
                catMap.get(cat.name).institutions.push({
                    name: inst.name,
                    type: inst.type,
                    website: inst.website,
                    programs: cat.programs || [],
                    subcategories: cat.subcategories || [],
                });
            });
        });

        return Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    let filteredData   = $derived(buildFilteredData());
    let categoriesData = $derived(buildCategoriesData(filteredData));
</script>

<div id="studyProgramsContainer">
    {#if filteredData.length === 0}
        <div class="no-results">
            <p>Keine Studiengänge gefunden.</p>
            <p>Bitte versuche es mit anderen Filterkriterien.</p>
        </div>
    {:else if currentView === 'institution'}
        {#each filteredData as uni}
            <InstitutionSection {uni} />
        {/each}
    {:else}
        {#each categoriesData as category}
            <CategorySection {category} />
        {/each}
    {/if}
</div>