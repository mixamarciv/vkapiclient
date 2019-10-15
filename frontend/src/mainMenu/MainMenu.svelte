<script>
  import { userStore } from "../user/userStore.js";
</script>

<style>
  .mynav1 {
    border: 0px;
    border-bottom: 1px;
    font-weight: bolder;
  }
</style>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark mynav1">
  <a class="navbar-brand" href="#/home">vkApiClient</a>

  <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarColor02"
    aria-controls="navbarColor02"
    aria-expanded="false"
    aria-label="Toggle navigation">
    <span class="navbar-toggler-icon" />
  </button>

  <div class="collapse navbar-collapse" id="navbarColor02">
    <ul class="navbar-nav mr-auto">
      {#if $userStore.id}
        <li class="nav-item ">
          <a class="nav-link" href="#/rules">Критерии поиска</a>
        </li>
        <li class="nav-item ">
          <a class="nav-link" href="#/results">Результаты</a>
        </li>
      {/if}
    </ul>
    <span class="form-inline my-2 my-lg-0">
      <a href="#/login" class="btn btn-primary my-2 my-sm-0" type="submit">
        {#if !$userStore.id}авторизация{:else}{$userStore.name}{/if}
      </a>
    </span>
  </div>
</nav>
