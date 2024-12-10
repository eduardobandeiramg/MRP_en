<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>
      <v-icon left>{{ snackbar.icon }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>

    <v-card flat class="linha-container">
      <v-card-title>
        <h1>Gestão de Linhas de Produção</h1>
        <v-spacer></v-spacer>
        <v-btn class="mb-12" color="primary" @click="abrirModalIncluir"> Adicionar Linha </v-btn>
      </v-card-title>

      <!-- Tabela de Linhas -->
      <v-card-text>
        <v-text-field v-model="search" label="Pesquisar" prepend-inner-icon="mdi-magnify"></v-text-field>
        <v-data-table :items="linhas" :headers="headers" :search="search" class="elevation-1 tabela-escura">
          <template v-slot:[`item.acao`]="{ item }">
            <div class="acoes-container">
              <v-btn color="blue" @click="abrirModalEditar(item)" small>
                <v-icon>mdi-pencil</v-icon>
                Editar
              </v-btn>
              <v-btn color="red" @click="abrirModalExcluir(item)" small>
                <v-icon>mdi-delete</v-icon>
                Excluir
              </v-btn>
            </div>
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>

    <!-- Modal para incluir ou editar linha -->
    <v-dialog v-model="modalVisivel" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ modalTitulo }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="novaLinha.name" label="Nome da linha" :rules="[rules.required]"
              required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="fecharModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="salvar" :disabled="!isFormValid">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de confirmação de exclusão -->
    <v-dialog v-model="modalExcluirVisivel" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Exclusão</v-card-title>
        <v-card-text>
          Deseja realmente excluir a linha <strong>{{ linhaParaExcluir?.name }}</strong>?
        </v-card-text>
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
import linhaService from '@/services/Linha.js';

export default {
  data() {
    return {
      snackbar: {
        show: false,
        message: '',
        color: '',
        icon: '',
      },
      search: '',
      linhas: [],
      novaLinha: { name: '' },

      modalVisivel: false,
      modalExcluirVisivel: false,
      modalTitulo: 'Incluir Nova Linha',
      editando: false,
      linhaParaExcluir: null,

      headers: [
        { align: "center", title: "Nome", key: "name" },
        { align: "center", title: "Ações", key: "acao", sortable: false, width: "150px" },
      ],


      rules: {
        required: value => !!value || 'Este campo é obrigatório.',
      },
    };
  },
  computed: {
    isFormValid() {
      if (this.editando) {
        return true;
      }
      return this.novaLinha.name && this.$refs.form.validate();
    },
  },
  methods: {
    abrirModalIncluir() {
      this.modalTitulo = 'Incluir Nova Linha';
      this.editando = false;
      this.limparFormulario();
      this.modalVisivel = true;
    },
    abrirModalEditar(item) {
      this.modalTitulo = 'Editar Linha';
      this.editando = true;
      this.novaLinha = { ...item };
      this.modalVisivel = true;
    },
    fecharModal() {
      this.modalVisivel = false;
      this.limparFormulario();
    },
    abrirModalExcluir(item) {
      this.linhaParaExcluir = item;
      this.modalExcluirVisivel = true;
    },
    fecharModalExcluir() {
      this.modalExcluirVisivel = false;
      this.linhaParaExcluir = null;
    },
    limparFormulario() {
      this.novaLinha = { name: '' };
    },
    async carregarLinhas() {
      try {
        this.linhas = await linhaService.getAllLines();
      } catch (error) {
        this.exibirSnackbar('Erro ao carregar linhas.', 'red', 'mdi-alert');
      }
    },
    async salvar() {
      try {
        if (this.editando) {
          await linhaService.updateLine(this.novaLinha.lineId, this.novaLinha);
        } else {
          await linhaService.addLine(this.novaLinha);
        }
        this.fecharModal();
        this.carregarLinhas();
        this.exibirSnackbar('Linha salva com sucesso!', 'green', 'mdi-check-circle');
      } catch (error) {
        this.exibirSnackbar(error.response?.data?.message || 'Erro ao salvar linha.', 'red', 'mdi-alert');
      }
    },
    async confirmarExcluir() {
      try {
        await linhaService.deleteLine(this.linhaParaExcluir.lineId);
        this.fecharModalExcluir();
        this.carregarLinhas();
        this.exibirSnackbar('Linha excluída com sucesso!', 'green', 'mdi-check-circle');
      } catch (error) {
        this.exibirSnackbar(error.response?.data?.message || 'Erro ao excluir linha.', 'red', 'mdi-alert');
      }
    },
    exibirSnackbar(message, color, icon) {
      this.snackbar = { show: true, message, color, icon };
    },
  },
  mounted() {
    this.carregarLinhas();
  },
};
</script>

<style scoped>
.acoes-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  /* Espaçamento entre os botões */
}

.linha-container {
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
