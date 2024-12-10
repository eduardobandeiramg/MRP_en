<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <b-form-input
            type="number"
            v-model="numericInputModel"
            min="0"
            :placeholder="placeholder">
        </b-form-input>
    </div>
</template>
<script>
    export default {
        name: 'Number',
        props: {
            placeholder: String,
            title: String,
            value: Number
        },
        methods: {
            clearInput() {
                this.numericInputModel = null;
            }
        },
        data() {
            return {
                numericInputModel: this.value
            };
        },
        watch: {
            value(newValue) {
                this.numericInputModel = newValue;
            },
            numericInputModel(newValue) {
                this.$emit('input', newValue);
            }
        }
    }
</script>