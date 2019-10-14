<script>
  import ResultAttach from "./ResultAttach.svelte";
  import moment from "moment";
  export let i = 0;
  export let d = {};
  let hidetext = 1;
</script>

<style>
  .showhidetext {
    display: inline-block;
    text-decoration: lightblue;
    cursor: pointer;
    background: #16182c;
  }
  .showhidetext:hover {
    text-decoration-line: underline;
    background: #1e2047;
  }
</style>

<div class="alert alert-dismissible alert-primary">
  <div class="d-flex justify-content-between bd-highlight py-0 my-0">
    <div class="p-0 bd-highlight ">
      <big>
        <span class="badge badge-dark">[{i + 1}]</span>
        <span class="badge badge-dark">{d.type}</span>
      </big>
    </div>

    <div class="p-0 bd-highlight text-muted">{d.date}</div>
  </div>
  <div>
    критерии:
    {#each d.tags as tag, i}
      {#if i > 0},{/if}
      <span>"{tag}"</span>
    {/each}
  </div>
  <div>
    автор:
    <a href={d.url_author} target="_blank">{d.url_author}</a>
  </div>

  <div>
    url:
    <a href={d.url} target="_blank">{d.url}</a>
  </div>

  {#if d.text}
    <div class="card border-secondary mb-3">
      <div class="card-header py-0 my-0">text</div>
      <div class="card-body py-0 my-0">
        <p class="card-text py-0 my-0">
          {#if hidetext && d.text.length > 1000}
            {@html d.text.substr(0, 1000)}
            <span
              class="showhidetext"
              on:click={() => {
                console.log('aaaaaaaaaaaa');
                hidetext = 0;
              }}>
              [вывести весь текст..]
            </span>
          {:else}
            {@html d.text}
            {#if d.text.length > 1000}
              <span
                class="showhidetext"
                on:click={() => {
                  hidetext = 1;
                }}>
                [скрыть часть текста..]
              </span>
            {/if}
          {/if}
        </p>
      </div>
    </div>
  {/if}

  {#if d.attachments && d.attachments.length > 0}
    <div class="d-flex flex-wrap bd-highlight mb-3">
      {#each d.attachments as attach, n}
        <div class="p-2 bd-highlight">
          <ResultAttach {attach} i={n} />
        </div>
      {/each}
    </div>
  {/if}

</div>

<!--
<div class="alert alert-dismissible alert-primary">[{i}]{data}</div>

<div class="alert alert-dismissible alert-primary">
  [{i}]
  <pre>{d.attachmentsJSON}</pre>
</div>

<div class="alert alert-dismissible alert-primary">
  [{i}]
  <pre>{d.attachmentsJSON2}</pre>
</div>
-->
