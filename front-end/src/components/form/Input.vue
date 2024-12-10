<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <b-form-input
            type="text"
            v-model="inputModel"
            min="0"
            :disabled="disabled"
            :placeholder="placeholder">
        </b-form-input>
    </div>
</template>
<script>
    export default {
        name: 'Sring',
        props: {
            placeholder: String,
            title: String,
            value: String,
            disabled: Boolean
        },
        methods: {
            clearInput() {
                this.inputModel = null;
            }
        },
        data() {
            return {
                inputModel: this.value
            };
        },
        watch: {
            value(newValue) {
                this.inputModel = newValue;
            },
            inputModel(newValue) {
                this.$emit('input', newValue);
            }
        }
    }
</script>