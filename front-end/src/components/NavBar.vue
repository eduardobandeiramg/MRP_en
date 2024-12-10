<template>
  <v-app-bar class="nav-bar">

    <v-btn icon to="/menu" title="Início" class="mr-4" v-if="isLoggedIn">
      <v-icon>mdi-home</v-icon>
    </v-btn>


    <div class="nav-links" v-if="isLoggedIn">
      <v-btn v-for="(link, index) in navLinks" :key="index" :to="link.to" text class="mr-4 white--text">
        {{ link.text }}
      </v-btn>
    </div>

    <!-- Ícone de Caixa de Entrada e Botão de login/logout à direita -->
    <v-spacer></v-spacer>

    <v-btn icon to="/entrada" title="Caixa de Entrada" class="mr-4" v-if="isLoggedIn">
      <v-icon>mdi-bell</v-icon>
    </v-btn>

    <v-btn text @click="handleAuthAction">
      {{ isLoggedIn ? 'Logout' : 'Login' }}
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      navLinks: [
        { text: "Funcionários", to: "/funcionarios" },
        { text: "Materiais", to: "/pecas" },
        { text: "Produtos", to: "/produtos" },
        { text: "Linhas", to: "/linha" },
        { text: "B.O.M.", to: "/bom" },
        { text: "M.O.P.", to: "/planejamento" },


      ],
    };
  },
  methods: {
    handleAuthAction() {

      if (this.isLoggedIn) {
        // Logout logic: Remove the token from localStorage
        localStorage.removeItem('authToken');
        this.isLoggedIn = false;
        this.$router.push('/login');
      } else {

        // Login logic: Redirect to login page
        this.$router.push('/login');
      }
    },
  },
  created() {
    (localStorage.getItem('authToken'))
    // Check if the user is logged in by checking if the token exists in localStorage
    this.isLoggedIn = !!localStorage.getItem('authToken');
  },
  watch: {
    // Watch for changes to the token in localStorage to update the button accordingly
    '$route'(to, from) {
      this.isLoggedIn = !!localStorage.getItem('authToken');
    },
  },
};
</script>

<style scoped>
.nav-bar {
  width: 100%;
  background-color: rgb(49, 175, 133);
}

.nav-links {
  display: flex;
}

.login-button {
  margin-right: 20px;
}
</style>
