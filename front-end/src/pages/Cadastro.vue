<template>
  <v-container class="cadastro-container">
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>
      <v-icon left>{{ snackbar.icon }}</v-icon>
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Fechar</v-btn>
    </v-snackbar>

    <!-- Card de Cadastro -->
    <v-card class="cadastro-card">
      <v-card-title class="headline">Cadastro de Usuário</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="form.username" label="Nome do Usuário" :rules="[rules.required]"
            required></v-text-field>
          <v-text-field v-model="form.email" label="E-mail" :rules="[rules.required, rules.email]"
            required></v-text-field>
          <v-text-field v-model="form.password" label="Senha" type="password" :rules="[rules.required, rules.password]"
            required></v-text-field>
          <v-text-field v-model="form.confirmPassword" label="Confirmar Senha" type="password"
            :rules="[rules.required, rules.confirmPassword]" required></v-text-field>
          <v-select v-model="form.role" :items="roles" label="Função" :rules="[rules.required]" item-text="title"
            item-value="key" required></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="resetForm">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="registerUser" :disabled="!isFormValid">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { register } from "@/services/auth";

export default {
  data() {
    return {
      snackbar: {
        show: false,
        message: "",
        icon: "",
        color: "",
      },
      form: {
        username: "",
        email: "",
        password: "",
        role: "",
      },
      roles: [
        { title: "Administrador", key: "admin" },
        { title: "Gerente de Produção", key: "production-planner" },
        { title: "Operador de Produção", key: "production-operator" },
        { title: "Gerente de Estoque", key: "inventory-manager" },
      ],
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        email: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "E-mail inválido.",
        confirmPassword: (value) =>
          value === this.form.password || "As senhas não coincidem.",
        password: (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) ||
          "A senha deve conter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
      },

    };
  },
  methods: {
    async registerUser() {
      try {
        if (this.$refs.form.validate()) {
          console.log(this.form)
          await register(this.form);
          this.showSnackbar("Usuário registrado com sucesso!", "success");
          this.resetForm();
          this.$router.push('/login');
        } else {
          this.showSnackbar("Por favor, corrija os erros no formulário.", "error");
        }
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        const errorMessage =
          error.response?.data?.message || "Erro ao registrar o usuário.";
        this.showSnackbar(errorMessage, "error");
      }
    },
    resetForm() {
      this.form = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      };

    },
    showSnackbar(message, type) {
      this.snackbar.message = message;
      this.snackbar.icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar.color = type === "success" ? "green" : "red";
      this.snackbar.show = true;
    },
  },
  computed: {
    isFormValid() {
      return (
        this.form.username &&
        this.form.email &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email) &&
        this.form.password &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          this.form.password
        ) &&
        this.form.confirmPassword === this.form.password &&
        this.form.role
      );
    },
  },

};
</script>

<style scoped>
.cadastro-container {
  margin: 100px auto;
  padding: 20px;
}

.cadastro-card {
  width: 800px;
  padding: 30px;
  background-color: #333;
  color: white;
  border-radius: 8px;
}
</style>
