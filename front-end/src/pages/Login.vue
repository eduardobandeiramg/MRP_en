<template>
  <div class="login-container">
    <form @submit.prevent="loginUser">
      <h2>Login</h2>
      <div class="input-wrapper">
        <label for="username">Usuário:</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div class="input-wrapper">
        <label for="password">Senha:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Entrar</button>

      <!-- Exibe a mensagem de sucesso ou erro -->
      <p v-if="message" :class="{ 'success-message': success, 'error-message': !success }">
        {{ message }}
      </p>

      <div class="links-container">
        <router-link to="/cadastro" class="link-left">Não possuo<br>cadastro</router-link>
        <router-link to="/recuperar-senha" class="link-right">Esqueci<br>minha senha</router-link>
      </div>
    </form>
  </div>
</template>



<script>
import { login } from '@/services/auth'; // Importe a função de login do auth.js

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      success: false,
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await login(this.username, this.password);
        if (response.status === 201) {
          const token = response.data.token;
          localStorage.setItem('authToken', token); // Salva o token no localStorage
          this.message = 'Login bem-sucedido!';
          this.success = true;

          // Redireciona para a página inicial após 2 segundos
          setTimeout(() => {
            this.$router.push('/menu');
          }, 2000);
        } else {
          this.message = 'Erro desconhecido no login';
          this.success = false;
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.message = error.response.data.message;
        } else {
          this.message = 'Erro ao fazer login.';
        }
        this.success = false;
      }
    },
  },
};
</script>



<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background: #333;
  color: white;
  text-align: center;
  border-radius: 8px;
}

.input-wrapper {
  margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: none;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success-message {
  color: green;
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 20px;
}

.links-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.link-left,
.link-right {
  color: #aaa;
  font-size: 0.9em;
  text-decoration: none;
  text-align: center;
}

.link-left:hover,
.link-right:hover {
  color: white;
}
</style>
