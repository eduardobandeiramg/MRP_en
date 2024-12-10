<template>
  <v-container>
    <v-card class="menu-container">
      <v-card-title>
        <v-row>
          <v-col cols="12" md="12">
            <v-card @click="irParaServico('/funcionarios')" class="d-flex align-center justify-center">
              <v-card-title class="text-center">Gerenciar Funcionarios e Permissões de acesso</v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-card @click="irParaServico('/pecas')" class="d-flex align-center justify-center">
              <v-card-title class="text-center">Gerenciar Peças</v-card-title>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card @click="irParaServico('/produtos')" class="d-flex align-center justify-center">
              <v-card-title class="text-center">Gerenciar Produtos</v-card-title>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card @click="irParaServico('/linha')" class="d-flex align-center justify-center">
              <v-card-title class="text-center">Gerenciar Linhas</v-card-title>
            </v-card>
          </v-col>

        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-card @click="irParaServico('/planejamento')" class="d-flex align-center justify-center">
              <v-card-title class="text-center">Planejamento de Produção</v-card-title>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card @click="irParaServico('/bom')" class="d-flex align-center justify-center">
              <v-card-title class="text-center">Build of Material</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>



  </v-container>

</template>

<script>
export default {
  methods: {
    irParaServico(caminho) {
      this.$router.push(caminho); // Redireciona para o serviço correspondente
    }
  }
}
</script>

<style scoped>
.v-card {
  cursor: pointer;
  transition: 0.3s;
}

.v-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.menu-container {
  margin-top: 70px;
  padding: 20px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 8px;
}
</style>