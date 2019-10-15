<script>
  import { vkdataStore } from "../socket.js";
  import TemplateMain from "../TemplateMain.svelte";
  import Result from "./Result.svelte";
</script>

<TemplateMain>
  <div class="container my-2">
    {#if $vkdataStore.loading}
      <h3>загрузка правил</h3>
    {:else}
      {#each $vkdataStore.data as data, i}
        <Result {i} d={data} />
      {/each}
    {/if}
  </div>
</TemplateMain>
