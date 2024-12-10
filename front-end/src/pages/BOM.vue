<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>
      <v-icon left>{{ snackbar.icon }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>

    <v-row>
      <v-col class="title" cols="12">
        <h1 class="headline text-center">Hierarquia de Materiais</h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="10" md="5">
        <v-autocomplete
          v-model="buildOfMaterialFilter.selectedProductId"
          :items="buildOfMaterialFilter.products"
          item-title="displayText"
          item-value="id"
          label="Filtrar Produto"
          placeholder="Digite para buscar..."
          variant="underlined"
          solo
          hide-details
          dense
          clearable
        ></v-autocomplete>
      </v-col>

      <v-col cols="2" style="align-content: end;">
        <v-btn size="small" color="blue" @click="onProductSelected">
          <v-icon>mdi-magnify</v-icon> Filtrar
        </v-btn>
      </v-col>
    </v-row>

    <v-divider color="info" :thickness="3" class="my-5 border-opacity-50"></v-divider>

    <div v-if="!hasFilter" class="instruction-message">
      <p>Por favor, selecione um produto para visualizar sua estrutura.</p>
    </div>

    <v-row v-else>

      <v-col cols="12">
        <v-treeview
          :items="tree.items"
          activatable
          open-on-click
          :load-children="fetchLazyChildren"
          item-title="name"
          item-value="id"
          :open.sync="tree.openNodes"
          dense
          transition
        >
          <template v-slot:prepend="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  size="x-small"
                  color="green"
                  class="mr-2"
                  v-on="on"
                  @click.stop="openProductModal(item)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Adicionar Sub-item</span>
            </v-tooltip>

            <v-tooltip bottom v-if="item.id !== filteredProduct.id">
              <template v-slot:activator="{ on }">
                <v-btn
                  size="x-small"
                  color="red"
                  class="mr-2"
                  v-on="on"
                  @click.stop="confirmDelete(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Excluir Item</span>
            </v-tooltip>

          </template>
        </v-treeview>
      </v-col>
    </v-row>


    <v-dialog v-model="dialog.save.show" max-width="600px">
      <v-card>
        <v-card-title>Adicionar Material para {{ buildOfMaterialFilter.selectedProduct.name }}</v-card-title>
        <v-card-text>
          <v-form ref="productForm">
            <v-text-field
              :model-value="buildOfMaterialFilter.selectedProduct.name"
              label="Produto"
              readonly
            ></v-text-field>

            <v-text-field
              v-if="dialog.save.parentMaterial"
              :model-value="dialog.save.parentMaterial"
              label="Material Pai"
              readonly
            ></v-text-field>

            <v-text-field
              label="Quantidade"
              v-model.number="dialog.save.quantity"
              type="number"
              :rules="[value => value > 0 || 'A quantidade deve ser maior que 0']"
              min="1"
            ></v-text-field>

            <v-autocomplete
              v-model="dialog.save.materialInput.selectedMaterialId"
              :items="dialog.save.materialInput.materials"
              item-title="displayText"
              item-value="id"
              label="Selecione o material"
              placeholder="Digite para buscar..."
              :rules="[v => !!v || 'Material é obrigatório']"
              required
              solo
              hide-details
              dense
              clearable
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="closeModal">Cancelar</v-btn>
          <v-btn color="green" @click="handleSave">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="dialog.confirmDelete.show" max-width="500px">
      <v-card>
        <v-card-title class="headline">Exclusão</v-card-title>
        <v-card-text>
          <v-icon color="red" left>mdi-alert-circle</v-icon>
          Deseja excluir o material {{ dialog.confirmDelete.materialName }} da hierarquia?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="closeDeleteModal">Cancelar</v-btn>
          <v-btn color="red" @click="deleteItem">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import produtoService from '@/services/Produtos';
import buildOfMaterialService from '@/services/BOM';
import materialService from '@/services/Pecas';

export default {
  data: () => ({
    snackbar: {
      show: false,
      message: '',
      icon: '',
      color: '',
    },
    buildOfMaterialFilter: {
      selectedProductId: null,
      selectedProduct: {},
      products: []
    },
    filteredProduct: {
      id: null,
      name: ""
    },
    dialog: {
      save: {
        materialInput: {
          selectedMaterialId: null,
          materials: []
        },
        quantity: 1,
        show: false,
      },
      confirmDelete: {
        show: false,
        buildOfMaterialId: null,
        materialName: ""
      }
    },
    tree: {
      items: [],
      openNodes: [],
    },
    hasFilter: false
  }),
  computed: {
    isFormValid() {
      return !!this.dialog.save.quantity && !!this.dialog.save.materialInput.selectedMaterialId;
    },
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async onProductSelected() {
      if (!this.buildOfMaterialFilter.selectedProductId) {
        this.snackbar.message = "Por favor, selecione um produto antes de buscar.";
        this.snackbar.color = "orange darken-2";
        this.snackbar.icon = "mdi-alert";
        this.snackbar.show = true;
        return;
      }

      this.hasFilter = true;
      const selectedProduct = this.buildOfMaterialFilter.products.find(
        (product) => product.id === this.buildOfMaterialFilter.selectedProductId
      );
      if (selectedProduct) {
        this.filteredProduct = {
          id: selectedProduct.id,
          name: selectedProduct.displayText
        };
        this.tree.items = [
          {
            id: selectedProduct.id,
            name: selectedProduct.displayText,
            children: [],
            lazy: true,
          },
        ];

        this.tree.openNodes = [selectedProduct.id];
      }
    },
    async fetchLazyChildren(node) {
      let bomData;
      if (node.id === this.filteredProduct.id) {
        bomData = await buildOfMaterialService.getBOMByProductId(node.id);
      }else{
        bomData = await buildOfMaterialService.getBOMChildrenById(node.id);
      }
      if (bomData.length > 0) {
        node.children = bomData.map((item) => ({
          id: item.id,
          name: ` [${item.lvl}] ${item.material.code} - ${item.material.description} (${item.qtd})`,
          lazy: true,
          children: [],
        }));
      } else {
        node.children = [];
      }
    },
    async fetchProducts() {
      const response = await produtoService.getProducts()
      this.buildOfMaterialFilter.products = response.map((product) => ({
        ...product,
        displayText: `${product.code} - ${product.description}`
      }));
    },
    openProductModal(item) {
      this.buildOfMaterialFilter.selectedProduct = { ...this.tree.items[0] };
      this.dialog.save.quantity = 1;
      this.dialog.save.materialInput.selectedMaterialId = null;
      this.loadMaterials();
      if (item.id === this.buildOfMaterialFilter.selectedProductId) {
        this.dialog.save.parentBuildOfMaterialId = null;
        this.dialog.save.parentMaterial = null;
      } else{
        this.dialog.save.parentBuildOfMaterialId = item.id;
        this.dialog.save.parentMaterial = item.name;
      }
      this.dialog.save.show = true;
    },
    async loadMaterials() {
      const response = await materialService.getMaterials();
      this.dialog.save.materialInput.materials = response.map((material) => ({
        ...material,
        displayText: `${material.code} - ${material.description}`
      }));
    },
    async handleSave() {
      if (!this.isFormValid) {
        this.snackbar.message = "Preencha todos os campos obrigatórios.";
        this.snackbar.color = "orange darken-2";
        this.snackbar.icon = "mdi-alert";
        this.snackbar.show = true;
        return;
      }
      const bomData = {
        qtd: this.dialog.save.quantity,
        productId: this.buildOfMaterialFilter.selectedProduct.id,
        materialId: this.dialog.save.materialInput.selectedMaterialId,
        parentBuildOfMaterialId: this.dialog.save.parentBuildOfMaterialId || null
      };
      await buildOfMaterialService.addBOM(bomData);

      const parentNodeId = this.dialog.save.parentBuildOfMaterialId || this.buildOfMaterialFilter.selectedProductId;
      this.reloadNode(parentNodeId);

      this.snackbar.message = "Material adicionado com sucesso!";
      this.snackbar.color = "green darken-1";
      this.snackbar.icon = "mdi-check-circle";
      this.snackbar.show = true;
      this.closeModal();
    },
    closeModal() {
      this.quantity = 1;
      this.selectedMaterialId = null;
      this.dialog.save.show = false
    },
    confirmDelete(item) {
      this.dialog.confirmDelete.buildOfMaterialId = item.id;
      this.dialog.confirmDelete.materialName = item.name;
      this.dialog.confirmDelete.show = true;
    },
    closeDeleteModal() {
      this.dialog.confirmDelete.show = false;
      this.dialog.confirmDelete.buildOfMaterialId = null;
      this.dialog.confirmDelete.materialName = "";
    },
    async deleteItem() {
      await buildOfMaterialService.deleteBOM(this.dialog.confirmDelete.buildOfMaterialId);
      this.removeNode(this.tree.items, this.dialog.confirmDelete.buildOfMaterialId);
      this.tree.items = [...this.tree.items];
      this.snackbar.message = "Material excluído com sucesso!";
      this.snackbar.color = "red darken-2";
      this.snackbar.icon = "mdi-alert-circle";
      this.snackbar.show = true;
      this.closeDeleteModal();
    },
    async reloadNode(nodeId) {
      const node = this.findNode(this.tree.items, nodeId);
      if (node) {
        node.children = [];
        const children = await buildOfMaterialService.getBOMChildrenById(nodeId);
        node.children = children.map((item) => ({
          id: item.id,
          name: ` [${item.lvl}] ${item.material.code} - ${item.material.description} (${item.qtd})`,
          lazy: true,
          children: []
        }));
        this.tree.items = [...this.tree.items];
      }
    },
    findNode(nodes, nodeId) {
      for (let node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children && node.children.length) {
          const foundNode = this.findNode(node.children, nodeId);
          if (foundNode) return foundNode;
        }
      }
      return null;
    },
    removeNode(nodes, nodeId) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && nodes[i].children.length) {
          const found = this.removeNode(nodes[i].children, nodeId);
          if (found) return true;
        }
      }
      return false;
    },
  }
}
</script>

<style scoped>
  .title {
    padding-top: 5rem;
  }
  h1 {
    color: white;
  }
  .instruction-message {
    text-align: center;
    margin-top: 20px;
    font-size: 1.2em;
    color: gray;
  }
</style>
