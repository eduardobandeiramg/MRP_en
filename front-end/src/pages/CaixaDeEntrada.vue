<template>
  <v-container>
    <h1 class="text-center">Caixa de Entrada</h1>

    <!-- Bloco 1: To Production -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>Produtos para Produzir</v-card-title>
          <v-card-text>
            <v-data-table :items="toProduction" :headers="headersToProduction"
              class="elevation-1 tabela-escura"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bloco 2: On Production -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>Produtos em Produção</v-card-title>
          <v-card-text>
            <v-data-table :items="onProduction" :headers="headersToProduction"
              class="elevation-1 tabela-escura"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bloco 3: Finished Production -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>Produtos Finalizados</v-card-title>
          <v-card-text>
            <v-data-table :items="finishedProduction" :headers="headersToProduction"
              class="elevation-1 tabela-escura"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bloco 4: Status Production -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>Status dos Produtos</v-card-title>
          <v-card-text>
            <v-data-table :items="statusProduction" :headers="headersStatusProduction" class="elevation-1 tabela-escura">
              <template v-slot:[`item.acao`]="{ item }">
                <v-btn :color="isItemRead(item) ? 'red' : 'green'" @click="toggleLida(item)">
                  {{ isItemRead(item) ? 'Marcar como não lida' : 'Marcar como lida' }}
                </v-btn>
              </template>
            </v-data-table>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>



</template>

<script>
import productionService from "@/services/Producao";
import dayjs from "dayjs";

export default {
  data() {
    return {
      toProduction: [],
      onProduction: [],
      finishedProduction: [],
      statusProduction: [],
      updatedItems: new Set(),
      headersToProduction: [
        { align: "center", title: "Descrição do Produto", key: "product.description" },
        { align: "center", title: "Código do Produto", key: "product.code" },
        { align: "center", title: "Quantidade", key: "qtd" },
        { align: "center", title: "Status", key: "status" },
        { align: "center", title: "Data Prevista", key: "productionPlan.datePrev" },
      ],
      // headersOnProduction: [
      //   { align: "center", title: "Descrição do Produto", key: "product.description" },
      //   { align: "center", title: "Código do Produto", key: "product.code" },
      //   { align: "center", title: "Quantidade", key: "qtd" },
      //   { align: "center", title: "Status", key: "status" },
      //   { align: "center", title: "Data de Previsão", key: "productionPlan.qtd" },
      // ],
      // headersFinishedProduction: [
      //   { align: "center", title: "Descrição do Produto", key: "product.description" },
      //   { align: "center", title: "Código do Produto", key: "product.code" },
      //   { align: "center", title: "Quantidade", key: "qtd" },
      //   { align: "center", title: "Status", key: "status" },
      //   { align: "center", title: "Data de Previsão", key: "productionPlan.qtd" },
      // ],
      headersStatusProduction: [
        { align: "center", title: "Data de Início", key: "dateInit" },
        { align: "center", title: "Status", key: "status" },
        { align: "center", title: "Produção", key: "producao" },
        { align: "center", title: "Última Atualização", key: "datePrev" },
      ],
      pollingInterval: null, // Intervalo para polling
    };
  },
  methods: {
    async carregarToProduction() {
      try {
        const data = await productionService.getToProduction();
        this.toProduction = data;
      } catch (error) {
        console.error("Erro ao carregar 'Produtos para Produzir':", error);
      }
    },
    async carregarOnProduction() {
      try {
        const data = await productionService.getOnProduction();
        this.onProduction = data;
      } catch (error) {
        console.error("Erro ao carregar 'Produtos em Produção':", error);
      }
    },
    async carregarFinishedProduction() {
      try {
        const data = await productionService.getFinishedProduction();
        this.finishedProduction = data;
      } catch (error) {
        console.error("Erro ao carregar 'Produtos Finalizados':", error);
      }
    },
    async carregarStatusProduction() {
      try {
        const data = await productionService.getStatusProduction();
        this.statusProduction = data.map((item) => ({
          ...item,
          dateInit: this.formatarData(item.dateInit),
          datePrev: this.formatarData(item.datePrev),
          highlight: this.updatedItems.has(item.id), // Verifica se o item está destacado
        }));
      } catch (error) {
        console.error("Erro ao carregar 'Status dos Produtos':", error);
      }
    },

    formatarData(data, formato = "DD/MM/YYYY HH:mm") {
      return data ? dayjs(data).format(formato) : "N/A";
    },


    iniciarPolling() {
      this.pollingInterval = setInterval(() => {
        this.carregarToProduction();
        this.carregarOnProduction();
        this.carregarFinishedProduction();
        this.carregarStatusProduction();
      }, 1000);
    },
  },
  mounted() {
    this.carregarToProduction();
    this.carregarOnProduction();
    this.carregarFinishedProduction();
    this.carregarStatusProduction();
    this.iniciarPolling();
  },
  beforeDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.tabela-escura .v-data-table__wrapper {
  background-color: #444;
  color: #fff;
}

.tabela-escura th {
  background-color: #555;
}


</style>
