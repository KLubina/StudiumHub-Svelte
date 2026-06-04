<script lang="ts">
    let { generalConfig = {} }: { generalConfig: Record<string, any> } = $props();
</script>

<h1 id="specificprogram-title">{generalConfig?.title || 'Specificprogram'}</h1>
<h2 id="specificprogram-subtitle">{@html generalConfig?.subtitleHtml || 'mind. 180 KP insgesamt'}</h2>