<template>
    <div class="form-buttons">
        <button class="submit-button" type="submit" @click="submitForm">{{ title }}</button>
    </div>
</template>
  
<script>
    export default {
        name: 'Submit',
        props: {
            title: String,
        },
        methods: {
            submitForm(event) {
                event.preventDefault();
                this.$emit('submit');
            }
        }
    }
</script>

<style scoped>
    .form-buttons {
        text-align: center;
    }
    .submit-button {
        background: #4caf50;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 3px;
        cursor: pointer;
    }
</style>
  