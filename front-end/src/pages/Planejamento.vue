<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>
      <v-icon left>{{ snackbar.icon }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>
    
    <v-row>
      <v-col class="title" cols="12">
        <h1 class="headline text-center">Planejamento da Produção</h1>
      </v-col>
    </v-row>

    <v-divider color="info" :thickness="3" class="my-5 border-opacity-50"></v-divider>

    <v-row>
      <v-col cols="12" style="min-height: 73vh;">
        <vue-cal
          ref="calendar"
          locale="pt-br"
          :time="false"
          show-week-numbers
          events-count-on-year-view
          active-view="month"
          :disable-views="['year', 'years']"
          :events="calendar.events"
          @view-change="onViewChange"
          @cell-click="openModal"
          @event-click="openEventModal"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="modal.show" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Planejamento para {{ modal.selectedDate }}</v-card-title>
        <v-card-text>
          <v-form ref="planningForm" v-model="form.valid">
            <v-autocomplete
              v-model="form.data.productId"
              :items="form.products"
              item-value="id"
              :item-title="product => product.code + ' - ' + product.description"
              label="Produto"
              placeholder="Selecione um produto"
              :loading="form.loadingProducts"
              :rules="[v => !!v || 'Produto é obrigatório']"
            ></v-autocomplete>

            <v-text-field
              v-model="form.data.quantity"
              label="Quantidade"
              type="number"
              placeholder="Insira a quantidade"
              :rules="[v => v > 0 || 'A quantidade deve ser superior a 0']"
            ></v-text-field>

            <v-autocomplete
              v-model="form.data.productionLineId"
              :items="form.productionLines"
              item-value="lineId"
              item-title="name"
              label="Linha de Produção"
              placeholder="Selecione uma linha de produção"
              :loading="form.loadingLines"
              :rules="[v => !!v || 'Linha de produção é obrigatória']"
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="addPlanning" :disabled="!form.valid">Salvar</v-btn>
          <v-btn color="blue darken-1" text @click="closeModal">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="eventModal.show" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Detalhes do Planejamento</v-card-title>
        <v-card-text>
          <p><strong>Data:</strong> {{ eventModal.data.date }}</p>
          <p><strong>Produto:</strong> {{ eventModal.data.product }}</p>
          <p><strong>Linha:</strong> {{ eventModal.data.line }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="closeEventModal">Voltar</v-btn>
          <v-btn color="red" text @click="openDeleteConfirmation">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog.show" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmação de Exclusão</v-card-title>
        <v-card-text>
          Deseja excluir o planejamento do produto {{ eventModal.data.product }}
          para o dia {{ eventModal.data.date }} na linha {{ eventModal.data.line }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="confirmDelete">Excluir</v-btn>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog">Não</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import planejamentoService from '@/services/Planejamento';
  import produtoService from '@/services/Produtos';
  import linhaService from '@/services/Linha';
  import VueCal from 'vue-cal'
  import 'vue-cal/dist/vuecal.css'

  export default {
    components: { VueCal },
    data: () => ({
      i18nPT: {
        weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        months: [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        year: 'Ano',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        today: 'Hoje',
        noEvent: 'Nenhum evento',
        allDay: 'Dia inteiro',
        deleteEvent: 'Excluir',
        createEvent: 'Criar evento',
        dateFormat: 'DD/MM/YYYY'
      },
      snackbar: {
        show: false,
        message: '',
        icon: '',
        color: '',
      },
      modal: {
        show: false,
        selectedDate: null,
      },
      calendar: {
        events: []
      },
      form: {
        valid: false,
        data: {
          productId: null,
          quantity: null,
          productionLineId: null,
        },
        products: [],
        productionLines: [],
        loadingProducts: false,
        loadingLines: false,
      },
      eventModal: {
        show: false,
        data: {
          id: null,
          date: '',
          product: '',
          line: ''
        }
      },
      deleteDialog: {
        show: false
      }
    }),
    mounted() {
      const today = new Date();
      this.loadEventsForPeriod('month', today);
    },
    methods: {
      onViewChange({ view, startDate }) {
        const newDate = new Date(startDate);
        this.loadEventsForPeriod(view, newDate);
      },
      async loadEventsForPeriod(view, date) {
        let startDate, endDate;

        if (view === 'month') {
          startDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}`;
        } else if (view === 'week') {
          const day = date.getDay();
          const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(date.setDate(diffToMonday));
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          startDate = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
          endDate = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;
        } else if (view === 'day') {
          startDate = endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        await this.fetchEvents(startDate, endDate);
      },
      async fetchEvents(startDate, endDate) {
        try {
          const productionPlans = await planejamentoService.getProductionPlansByDates(startDate, endDate);
          this.calendar.events = productionPlans.map(plan => {
            const [year, month, day] = plan.datePrev.split('-').map(Number);
            return {
              id: plan.id,
              start: new Date(year, month - 1, day, 0, 0, 0),
              end: new Date(year, month - 1, day, 23, 59, 59),
              title: plan.product.code,
              content:  `
                <strong>Quantidade:</strong> ${plan.qtd} <br>
                <strong>Produto:</strong> ${plan.product.description} <br>
                <strong>Linha:</strong> ${plan.line.name}
              `
            }
          });
        } catch (error) {
          if (error.response && error.response.status === 404) {
            this.calendar.events = [];
            this.snackbar = {
              show: true,
              message: 'Nenhum evento cadastrado para o mês selecionado.',
              icon: 'mdi-information',
              color: 'warning',
            };
            return
          }
          this.snackbar = {
            show: true,
            message: 'Erro ao buscar eventos do planejamento.',
            icon: 'mdi-alert',
            color: 'red',
          };
        }
      },
      openModal(date) {
        const clickedDate = new Date(date.setHours(0, 0, 0, 0));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (clickedDate > today) {
          this.modal.selectedDate = date.toLocaleDateString('pt-BR');
          this.modal.show = true;
          this.loadProducts();
          this.loadProductionLines();
        } else {
          this.snackbar = {
            show: true,
            message: 'Não é possível adicionar planejamento para datas passadas.',
            icon: 'mdi-alert',
            color: 'warning',
          };
        }
      },
      closeModal() {
        this.modal.show = false;
        this.resetForm();
      },
      async loadProducts() {
        this.form.loadingProducts = true;
        try {
          const products = await produtoService.getProducts();
          this.form.products = products.map(product => ({
            ...product,
            displayText: `${product.code} - ${product.description}`,
          }));
        } catch (error) {
          console.error('Erro ao carregar produtos:', error);
          this.snackbar = {
            show: true,
            message: 'Erro ao carregar produtos.',
            icon: 'mdi-alert',
            color: 'red',
          };
        } finally {
          this.form.loadingProducts = false;
        }
      },
      async loadProductionLines() {
        this.form.loadingLines = true;
        try {
          const lines = await linhaService.getAllLines();
          this.form.productionLines = lines;
        } catch (error) {
          console.error('Erro ao carregar linhas de produção:', error);
          this.snackbar = {
            show: true,
            message: 'Erro ao carregar linhas de produção.',
            icon: 'mdi-alert',
            color: 'red',
          };
        } finally {
          this.form.loadingLines = false;
        }
      },
      resetForm() {
        this.form.data = {
          productId: null,
          quantity: null,
          productionLineId: null,
        };
      },
      async addPlanning() {
        if (!this.form.valid) return;

        const formattedDate = this.modal.selectedDate.split('/').reverse().join('-');
        const payload = {
          qtd: this.form.data.quantity,
          datePrev: formattedDate,
          productId: this.form.data.productId,
          lineId: this.form.data.productionLineId,
        };

        try {
          await planejamentoService.addProductionPlan(payload);
          this.snackbar = {
            show: true,
            message: 'Planejamento adicionado com sucesso!',
            icon: 'mdi-check-circle',
            color: 'success',
          };
          this.closeModal();

          const [year, month, day] = formattedDate.split('-').map(Number);
          const planningDate = new Date(year, month - 1, day);

          const activeView = this.$refs.calendar.activeView || 'month';
          console.log(activeView, planningDate)
          this.loadEventsForPeriod(activeView, planningDate);
        } catch (error) {
          console.error('Erro ao adicionar planejamento:', error);
          this.snackbar = {
            show: true,
            message: 'Erro ao adicionar planejamento.',
            icon: 'mdi-alert',
            color: 'red',
          };
        }
      },
      openEventModal(event) {
        this.eventModal.data = {
          id: event.id,
          date: event.start.toLocaleDateString('pt-BR'),
          product: event.title,
          line: event.content.match(/Linha:<\/strong> (.+)/)[1]
        };
        this.eventModal.show = true;
      },
      closeEventModal() {
        this.eventModal.show = false;
      },
      openDeleteConfirmation() {
        this.deleteDialog.show = true;
        this.eventModal.show = false;
      },
      closeDeleteDialog() {
        this.deleteDialog.show = false;
      },
      async confirmDelete() {
        try {
          await planejamentoService.deleteProductionPlan(this.eventModal.data.id);
          this.snackbar = {
            show: true,
            message: 'Planejamento excluído com sucesso!',
            icon: 'mdi-check-circle',
            color: 'success',
          };
          this.closeDeleteDialog();
          this.closeEventModal();

          const activeView = this.$refs.calendar.activeView || 'month';
          const planningDate = new Date(this.eventModal.data.date.split('/').reverse().join('-'));
          this.loadEventsForPeriod(activeView, planningDate);
        } catch (error) {
          console.error('Erro ao excluir planejamento:', error);
          this.snackbar = {
            show: true,
            message: 'Erro ao excluir planejamento.',
            icon: 'mdi-alert',
            color: 'red',
          };
        }
      }
    },
  }
</script>

<style>
  .title {
    padding-top: 5rem;
  }
  h1 {
    color: white;
  }
  .vuecal__event {
    cursor: pointer;
    margin: 0.5rem 0;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #f5f5f5;
  }
  .vuecal__event:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #e0e0e0;
  }
  .vuecal__cell-events-count {
    background-color: green;
    color: #ffffff;
    border-radius: 50%;
    font-weight: bold;
  }
  .vuecal__event-title{
    font-weight: bolder;
    font-size: large;
    background: lightgray;
    color: black;
  }
</style>
