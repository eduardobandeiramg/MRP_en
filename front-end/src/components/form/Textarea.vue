<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <b-form-textarea
            v-model="textareaInputModel"
            :rows="rows"
            :placeholder="placeholder">
        </b-form-textarea>
    </div>
</template>
<script>
    export default {
        name: 'Number',
        props: {
            placeholder: String,
            title: String,
            rows: Number
        },
        methods: {
            clearTextarea() {
                this.textareaInputModel = null;
            }
        },
        data() {
            return {
                textareaInputModel: this.value
            };
        },
        watch: {
            textareaInputModel(newValue) {
                this.$emit('input', newValue);
            }
        }
    }
</script>