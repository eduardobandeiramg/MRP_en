<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>
      <v-icon left>{{ snackbar.icon }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>

    <v-card flat class="gestao-pecas-container">
      <v-card-title>
        <h1>Gestão de Peças</h1>
        <v-spacer></v-spacer>
        <v-btn class="mb-12" color="primary" @click="abrirModalIncluir">Adicionar Peça</v-btn>
      </v-card-title>

      <!-- Tabela de Peças -->
      <v-card-text>
        <v-text-field v-model="search" label="Pesquisar" prepend-inner-icon="mdi-magnify"></v-text-field>
        <v-data-table :headers="headers" :items="pecas" :search="search" class="elevation-1 tabela-escura">
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-content-end">
              <v-btn color="blue" @click="abrirModalEditar(item)">
                <v-icon>mdi-pencil</v-icon> Editar
              </v-btn>
              <v-btn color="red" @click="abrirModalExcluir(item)">
                <v-icon>mdi-delete</v-icon> Excluir
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal para incluir ou editar peça -->
    <v-dialog v-model="modalVisivel" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ modalTitulo }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="novaPeca.description"
              label="Nome da Peça"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="novaPeca.code"
              label="Código da Peça"
              :rules="[rules.required, rules.codeFormat]"
              required
            ></v-text-field>
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
        <v-card-text>Deseja realmente excluir a peça <strong>{{ pecaParaExcluir?.description }}</strong>?</v-card-text>
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
import pecaService from '@/services/Pecas';

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
      pecas: [],
      novaPeca: { description: '', code: '' },
      modalVisivel: false,
      modalExcluirVisivel: false,
      modalTitulo: 'Incluir Nova Peça',
      editando: false,
      pecaParaExcluir: null,
      headers: [
        { align: 'center', title: 'Nome da Peça', key: 'description' },
        { align: 'center', title: 'Código da Peça', key: 'code' },
        { align: 'center', title: 'Ações', key: 'actions', sortable: false, width: "150px"  },
      ],
      rules: {
        required: value => !!value || 'Este campo é obrigatório.',
        codeFormat: value => /^[A-Z0-9]+$/.test(value) || 'Código deve conter apenas letras maiúsculas e números.',
      },
    };
  },
  computed: {
    isFormValid() {
      if(this.editando){
        return true
      }
      return this.novaPeca.description && this.novaPeca.code && this.$refs.form.validate();
    },
  },
  methods: {
    abrirModalIncluir() {
      this.modalTitulo = 'Incluir Nova Peça';
      this.editando = false;
      this.limparFormulario();
      this.modalVisivel = true;
    },
    abrirModalEditar(item) {
      this.modalTitulo = 'Editar Peça';
      this.editando = true;
      this.novaPeca = { ...item };
      this.modalVisivel = true;
    },
    fecharModal() {
      this.modalVisivel = false;
      this.limparFormulario();
    },
    abrirModalExcluir(item) {
      this.pecaParaExcluir = item;
      this.modalExcluirVisivel = true;
    },
    fecharModalExcluir() {
      this.modalExcluirVisivel = false;
      this.pecaParaExcluir = null;
    },
    limparFormulario() {
      this.novaPeca = { description: '', code: '' };
    },
    async carregarPecas() {
      try {
        this.pecas = await pecaService.getMaterials();
      } catch (error) {
        this.exibirSnackbar(this.pecas.response.data.message, 'red', 'mdi-alert');
      }
    },
    async salvar() {
      try {
        if (this.editando) {
          await pecaService.updateMaterial(this.novaPeca.id, this.novaPeca);
        } else {
          await pecaService.addMaterial(this.novaPeca);
        }
        this.fecharModal();
        this.carregarPecas();
        this.exibirSnackbar('Peça salva com sucesso', 'green', 'mdi-check-circle');
      } catch (error) {
        this.exibirSnackbar(error.response.data.message, 'red', 'mdi-alert');
      }
    },
    async confirmarExcluir() {
      try {
        await pecaService.deleteMaterial(this.pecaParaExcluir.id);
        this.fecharModalExcluir();
        this.carregarPecas();
        this.exibirSnackbar('Peça excluída com sucesso', 'green', 'mdi-check-circle');
      } catch (error) {
        this.exibirSnackbar(error.response.data.message, 'red', 'mdi-alert');
      }
    },
    exibirSnackbar(message, color, icon) {
      this.snackbar = { show: true, message, color, icon };
    },
  },
  mounted() {
    this.carregarPecas();
  },
};
</script>

<style scoped>
.gestao-pecas-container {
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
