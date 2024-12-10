<template>
    <v-container>
      <h1 class="text-center">Relatórios</h1>
  
      <!-- Relatório 1: Diferença de Produção -->
      <v-card class="mb-4">
        <v-card-title>Diferença entre Produção e Planejamento</v-card-title>
        <v-card-text>
          <v-data-table :headers="headersDiferencaProducao" :items="diferencaProducao" class="elevation-1 tabela-escura">
          </v-data-table>
        </v-card-text>
      </v-card>
  
      <!-- Relatório 2: Estoque vs Necessidade -->
      <v-card class="mb-4">
        <v-card-title>Validação de Estoque x Necessidade</v-card-title>
        <v-card-text>
          <v-data-table :headers="headersEstoque" :items="estoqueNecessidade" class="elevation-1 tabela-escura">
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import relatorioService from '@/services/Relatorio';
  
  export default {
    data() {
      return {
        diferencaProducao: [],
        estoqueNecessidade: [],
        headersDiferencaProducao: [
          { align: 'center', title: 'Mês', key: 'mes' },
          { align: 'center', title: 'Produção Realizada', key: 'producaoReal' },
          { align: 'center', title: 'Planejamento', key: 'planejamento' },
          { align: 'center', title: 'Diferença', key: 'diferenca' },
        ],
        headersEstoque: [
          { align: 'center', title: 'Item', key: 'item' },
          { align: 'center', title: 'Quantidade no Estoque', key: 'estoque' },
          { align: 'center', title: 'Quantidade Necessária', key: 'necessario' },
          { align: 'center', title: 'Diferença', key: 'diferenca' },
        ],
      };
    },
    methods: {
      async carregarRelatorios() {
        try {
          this.diferencaProducao = await relatorioService.getDiferencaProducao();
          this.estoqueNecessidade = await relatorioService.getEstoqueNecessidade();
        } catch (error) {
          console.error('Erro ao carregar relatórios:', error);
        }
      },
    },
    mounted() {
      this.carregarRelatorios();
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
    color: #fff;
  }
  </style>
  