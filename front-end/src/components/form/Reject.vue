<template>
    <div class="form-buttons">
        <button class="reject-button" type="submit" @click="submitForm">{{ title }}</button>
    </div>
</template>
  
<script>
    export default {
        name: 'Reject',
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
    .reject-button {
        background: #af4c4c;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 3px;
        cursor: pointer;
    }
</style>
  