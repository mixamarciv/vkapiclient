<script>
  import { vkrulesStore } from "../socket.js";
  import TemplateMain from "../TemplateMain.svelte";
  import Rule from "./Rule.svelte";
</script>

<TemplateMain>
  <div class="container mt-2">
    {#if $vkrulesStore.loading}
      <h3>загрузка параметров</h3>
    {:else}
      {#if $vkrulesStore.isupdated}
        <button
          type="button"
          class="btn btn-primary btn-lg my-2"
          on:click={() => {
            $vkrulesStore.sendRules();
          }}>
          сохранить и запустить обновленные критерии
        </button>
      {/if}

      {#each $vkrulesStore.rules as rule, i (rule.tag)}
        <Rule {i} {rule} />
      {/each}

      <button
        type="button"
        class="btn btn-primary btn-lg mr-3"
        on:click={() => {
          $vkrulesStore.addRule({ value: '' });
        }}>
        добавить критерии
      </button>

      {#if $vkrulesStore.isupdated}
        <button
          type="button"
          class="btn btn-primary btn-lg"
          on:click={() => {
            $vkrulesStore.sendRules();
          }}>
          сохранить и запустить обновленные критерии
        </button>
      {/if}
    {/if}
  </div>
</TemplateMain>
