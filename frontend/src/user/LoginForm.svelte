<script>
  import TemplateMain from "../TemplateMain.svelte";
  import { userStore } from "./userStore.js";

  import { fly, fade } from "svelte/transition";
  import { fetchJSON } from "../fnc.js";
  //import io from "socket.io-client";

  let inputLoginText = $userStore.login;
  let inputPassText;
  let loading = 0;
  let successLogin = 0;
  let error = 0;

  function onInputLogin(event) {
    if (event.which == 13) return;
  }
  async function onSubmitFormLogin(event) {
    console.log("попытка авторизации");
    loading = 1;
    successLogin = 0;
    error = 0;
    event.preventDefault();

    let u = { login: inputLoginText, pass: inputPassText };
    let d = await fetchJSON("/login", u);
    if (d.error) {
      error = d.error;
    } else {
      successLogin = 1;
      const u = d.user;
      $userStore.setUserData(u.id, u.name, u.login);
    }
    loading = 0;
  }
</script>

<style>
  .form-signin {
    width: 100%;
    max-width: 420px;
    padding: 15px;
    margin: auto;
  }

  .form-label-group {
    position: relative;
    margin-bottom: 1rem;
  }

  .form-label-group > input,
  .form-label-group > label {
    height: 3.125rem;
    padding: 0.75rem;
  }

  .form-label-group > label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0; /* Override default `<label>` margin */
    line-height: 1.5;
    color: #495057;
    pointer-events: none;
    cursor: text; /* Match the input under the label */
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
  }

  .form-label-group input::-webkit-input-placeholder {
    color: transparent;
  }

  .form-label-group input:-ms-input-placeholder {
    color: transparent;
  }

  .form-label-group input::-ms-input-placeholder {
    color: transparent;
  }

  .form-label-group input::-moz-placeholder {
    color: transparent;
  }

  .form-label-group input::placeholder {
    color: transparent;
  }

  .form-label-group input:not(:placeholder-shown) {
    padding-top: 1.25rem;
    padding-bottom: 0.25rem;
  }

  .form-label-group input:not(:placeholder-shown) ~ label {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 12px;
    color: #777;
  }

  /* Fallback for Edge
-------------------------------------------------- */
  @supports (-ms-ime-align: auto) {
    .form-label-group > label {
      display: none;
    }
    .form-label-group input::-ms-input-placeholder {
      color: #777;
    }
  }

  /* Fallback for IE
-------------------------------------------------- */
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    .form-label-group > label {
      display: none;
    }
    .form-label-group input:-ms-input-placeholder {
      color: #777;
    }
  }
</style>

<TemplateMain>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <form class="form-signin" on:submit={onSubmitFormLogin}>
          <div class="text-center mb-4">
            <div
              in:fade={{ delay: 200, duration: 3000 }}
              out:fade={{ duration: 0 }}>
              <img
                class="mb-4"
                src="./images/favicon.png"
                width="72"
                height="72"
                alt="лого" />
            </div>

            <div
              in:fly={{ x: 120, delay: 100, duration: 800 }}
              out:fade={{ duration: 0 }}>
              <h1 class="h3 mb-3 font-weight-normal">авторизация</h1>
            </div>
          </div>

          <div
            in:fly={{ x: 120, delay: 300, duration: 800 }}
            out:fade={{ duration: 0 }}>
            <div class="form-label-group">
              <input
                type="login"
                id="inputEmail"
                class="form-control"
                placeholder="логин"
                required
                autofocus1="1"
                bind:value={inputLoginText}
                on:keydown={onInputLogin} />
              <label for="inputEmail">логин</label>
            </div>
          </div>

          <div
            in:fly={{ x: 120, delay: 500, duration: 800 }}
            out:fade={{ duration: 0 }}>
            <div class="form-label-group">
              <input
                type="password"
                id="inputPassword"
                class="form-control"
                placeholder="пароль"
                required
                autocomplete="false"
                bind:value={inputPassText}
                on:keydown={onInputLogin} />
              <label for="inputPassword">пароль</label>
            </div>
          </div>

          <div
            in:fly={{ x: 120, delay: 700, duration: 800 }}
            out:fade={{ duration: 0 }}>
            <button
              class="btn btn-lg btn-primary btn-block"
              class:disabled={loading}
              type="submit">
              {#if loading}загрузка..{:else}войти{/if}
            </button>
          </div>

          <div
            in:fly={{ y: 200, delay: 1000, duration: 800 }}
            out:fade={{ duration: 0 }}>
            {#if error}
              <div>
                <div
                  class="p-3 m-3 alert alert-dismissible fade show alert-danger"
                  role="alert">
                  <button
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    on:click={() => {
                      error = 0;
                    }}>
                    <span aria-hidden="true">×</span>
                  </button>
                  <strong>ОШИБКА</strong>
                  <p>
                    {#if error.errcode}
                      <b>{error.errcode}</b>
                    {/if}
                    {error.message}
                  </p>
                </div>
              </div>
            {/if}

            {#if successLogin}
              <div>
                <div
                  class="p-3 m-3 alert alert-dismissible fade show alert-success"
                  role="alert">
                  <button
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    on:click={() => {
                      successLogin = 0;
                    }}>
                    <span aria-hidden="true">×</span>
                  </button>
                  <strong>Авторизация пройдена успешно</strong>
                  <p>
                    вы авторизовались под учетной записью: {$userStore.name}
                  </p>
                </div>
              </div>
            {/if}
          </div>

        </form>
      </div>
    </div>
  </div>
</TemplateMain>
