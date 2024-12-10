<template>
  <div class="verify-code-container">
    <h1>Verificar Código</h1>
    <form @submit.prevent="verificarCodigo">
      <div class="code-inputs">
        <input
          v-for="(value, index) in codigo"
          :key="index"
          :ref="'codeInput' + index"  
          type="text"
          maxlength="1"
          v-model="codigo[index]"
          @input="autoFocus(index)"
          class="code-input"
          required
        />
      </div>
      <button type="submit" class="submit-button">Verificar Código</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      codigo: ["", "", "", "", "", ""], // Array para os 6 dígitos
    };
  },
  methods: {
    autoFocus(index) {
      // Quando o usuário digitar, move para o próximo campo automaticamente
      if (this.codigo[index].length === 1 && index < 5) {
        const nextInput = this.$refs["codeInput" + (index + 1)];
        if (nextInput && nextInput.length > 0) {
          nextInput[0].focus();  // Acessando o primeiro elemento do array
        }
      }
    },
    verificarCodigo() {
      const codigoCompleto = this.codigo.join("");
      if (codigoCompleto.length === 6) {
        // Aqui você pode adicionar a lógica de verificação do código
        // Exemplo: this.$router.push({ name: "novaSenha" });
      } else {
        alert("Por favor, insira os 6 dígitos.");
      }
    },
  },
};
</script>

<style scoped>
.verify-code-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #fff;
}

/* Estilos para os campos de código */
.code-inputs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.code-input {
  width: 45px;
  height: 45px;
  font-size: 24px;
  text-align: center;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #222;
  color: #fff;
}

button {
  background: #00b300;
  color: white;
  padding: 15px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
}

button:hover {
  background-color: #009900;
}
</style>
