<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>
      <v-icon left>{{ snackbar.icon }}</v-icon>
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Fechar</v-btn>
    </v-snackbar>
    <v-card flat class="gestao-funcionarios-container">
      <v-card-title>
        <h1>Gestão de Funcionários</h1>
        <v-spacer></v-spacer>
        <v-btn class="mb-12" color="primary" @click="abrirModalIncluir"> Adicionar Funcionário </v-btn>
      </v-card-title>

      <!-- Tabela de Funcionários -->
      <v-card-text>
        <v-text-field v-model="search" label="Pesquisar" prepend-inner-icon="mdi-magnify"></v-text-field>
        <v-data-table :headers="headers" :items="funcionarios" :search="search" class="elevation-1 tabela-escura">
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-content-end">
              <v-spacer></v-spacer>
              <!-- <v-btn color="blue" @click="abrirModalEditar(item)">
                <v-icon>mdi-pencil</v-icon> Editar
              </v-btn> -->
              <v-btn color="red" @click="abrirModalExcluir(item)">
                <v-icon>mdi-delete</v-icon> Excluir
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para incluir ou editar funcionário -->
    <v-dialog v-model="modalVisivel" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ modalTitulo }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="novoFuncionario.username" label="Nome do Usuário" :rules="[rules.required]"
              required></v-text-field>
            <v-text-field v-model="novoFuncionario.email" label="E-mail" :rules="[rules.required, rules.email]"
              required></v-text-field>
            <v-text-field v-model="novoFuncionario.password" v-show="!editando" label="Senha" type="password"
              :rules="[rules.required, rules.password]"></v-text-field>
            <v-text-field v-model="novoFuncionario.confirmPassword" label="Confirmar Senha" type="password"
              :rules="[rules.required, rules.confirmPassword]" v-show="!editando"></v-text-field>
            <v-select v-model="novoFuncionario.role" :items="roles" label="Função" :rules="[rules.required]"
              item-text="title" item-value="key" required></v-select>
          </v-form>


        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="fecharModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="salvar">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de confirmação de exclusão -->
    <v-dialog v-model="modalExcluirVisivel" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Exclusão</v-card-title>
        <v-card-text>Deseja realmente excluir o funcionário <strong>{{ funcionarioParaExcluir?.username
            }}</strong>?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="fecharModalExcluir">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="confirmarExcluir">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import funcionarioService from '@/services/Funcionarios';

export default {
  data() {
    return {
      snackbar: {
        show: false,
        message: "",
        icon: "",
        color: "",
      },
      search: '',
      funcionarios: [],
      novoFuncionario: { username: '', email: '', password: '', confirmPassword: '', role: '' },
      roles: [
        { title: "Administrador", key: "admin" },
        { title: "Gerente de Produção", key: "production-planner" },
        { title: "Operador de Produção", key: "production-operator" },
        { title: "Gerente de Estoque", key: "inventory-manager" },
      ],
      modalVisivel: false,
      modalExcluirVisivel: false,
      modalTitulo: 'Incluir Novo Funcionário',
      editando: false,
      funcionarioParaExcluir: null,
      indexEditando: null,
      headers: [
        { align: 'center', title: 'Nome do Funcionário', key: 'username' },
        { align: 'center', title: 'E-mail', key: 'email' },
        { align: 'center', title: 'Função', key: 'role' },
        { align: 'center', title: 'Ações', key: 'actions', sortable: false, width: "150px" },
      ],
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        email: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "E-mail inválido.",
        confirmPassword: (value) =>
          value === this.novoFuncionario.password || "As senhas não coincidem.",
        password: (value) => {
          if (this.editando) {
            return true; // Senha não é obrigatória ao editar
          }
          return (
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) ||
            "A senha deve conter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
          );
        },
      },

    };

  },
  methods: {

    abrirModalIncluir() {
      this.modalTitulo = 'Incluir Novo Funcionário';
      this.editando = false;
      this.limparFormulario();
      this.modalVisivel = true;
    },
    abrirModalEditar(item) {
      this.modalTitulo = 'Editar Funcionário';
      this.editando = true;
      this.novoFuncionario = { ...item };
      this.indexEditando = this.funcionarios.indexOf(item);
      this.modalVisivel = true;
    },
    fecharModal() {
      this.modalVisivel = false;
      this.limparFormulario();
    },
    abrirModalExcluir(item) {
      this.funcionarioParaExcluir = item;
      this.modalExcluirVisivel = true;
    },
    fecharModalExcluir() {
      this.modalExcluirVisivel = false;
      this.funcionarioParaExcluir = null;
    },
    limparFormulario() {
      this.novoFuncionario = { username: '', email: '', role: '' };
      this.indexEditando = null;
    },
    async carregarFuncionarios() {
      try {
        this.funcionarios = await funcionarioService.getAllUsers();
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
      }
    },
    async salvar() {
      try {
        if (this.editando) {
          // await funcionarioService.updateUser(this.novoFuncionario.id, this.novoFuncionario);
        } else {
          await funcionarioService.registerUser(this.novoFuncionario);
        }
        this.fecharModal();
        this.carregarFuncionarios();
      } catch (error) {
        console.error('Erro ao salvar funcionário:', error);
      }
    },
    async confirmarExcluir() {
      try {
        await funcionarioService.deleteUser(this.funcionarioParaExcluir.id);
        this.fecharModalExcluir();
        this.carregarFuncionarios();
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
      }
    },
  },
  mounted() {
    this.carregarFuncionarios();
  },
  computed: {
    isFormValid() {
      return this.novoProduto.description && this.novoProduto.code && this.$refs.form.validate();
    },
  },
};
</script>

<style scoped>
.gestao-funcionarios-container {
  margin-top: 70px;
  padding: 20px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 8px;
}

.tabela-escura .v-data-table__wrapper {
  background-color: #444;
  color: #fff;
}

.tabela-escura th {
  background-color: #555;
  color: #fff;
}

.tabela-escura td {
  background-color: #444;
  color: #fff;
}

.v-btn {
  margin-right: 10px;
}
</style>
