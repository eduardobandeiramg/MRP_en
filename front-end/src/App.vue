<template>
  <v-app id="app">
    <div class="navbar-container">
      <NavBar />
    </div>
    <!-- Conteúdo centralizado -->
    <div class="content-container">
      <router-view />
    </div>
  </v-app>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
export default {
  name: "App",

  data() {
    return {
      loggedIn: false,
      user: undefined,
    };
  },
  components: {
    NavBar,
  },
};
</script>



<style scoped>
#app {
  background: #1e1e1e;
}
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: flex-start; /* Navbar no topo */
}

/* Container da navbar, ficará no topo da página */
.navbar-container {
  flex-shrink: 0; /* A navbar não deve encolher */
  background-color: #353535;
}

/* Estilos na main view */
.content-container {
  /* flex-grow: 1;  */
  display: flex;
  justify-content: center;
  align-items: center; /* Centraliza vertical e horizontalmente */
  width: 100%; /* Garante que o conteúdo ocupe toda a largura da tela */
}

</style>
