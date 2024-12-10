<template>
  <div class="recover-container">
    <h2>Recuperar Senha</h2>
    <div class="input-wrapper">
      <label for="email">Digite seu e-mail:</label>
      <input v-model="email" type="email" id="email" required />
    </div>
    <button @click="enviarEmail">Enviar E-mail</button>

    <!-- Exibe a mensagem de sucesso ou erro -->
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script>
import { forgotPassword } from '@/services/auth'; // Importando a função forgotPassword

export default {
  data() {
    return {
      email: '',
      message: '', // Armazena a mensagem a ser exibida
      success: false // Define se a mensagem é de sucesso ou erro
    };
  },
  methods: {
    async enviarEmail() {
      try {
        const response = await forgotPassword(this.email);
        if (response.status === 201) {
          this.message = 'Se esse usuário existir, ele receberá um e-mail';
          this.success = true;
        } else {
          this.message = 'Falha ao enviar o e-mail.';
          this.success = false;
        }
      } catch (error) {
        console.error('Erro ao enviar e-mail', error);
        this.message = 'Erro ao enviar o e-mail.';
        this.success = false;
      }
    }
  }
};
</script>

<style scoped>
.recover-container {
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
input[type="email"] {
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
</style>
