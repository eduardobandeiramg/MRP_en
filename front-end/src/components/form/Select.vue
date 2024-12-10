<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <select v-model="selectedValue">
            <option disabled value="">{{ placeholder }}</option>
            <option v-for="(value, key) in selectData" :key="key" :value="key">{{ value }}</option>
        </select>
    </div>
</template>

<script>
    export default {
        name: 'Select',
        props: {
            selectData: Object,
            placeholder: String,
            title: String,
            value: Number,
        },
        methods: {
            clearSelection() {
                this.selectedValue = null;
            }
        },
        data() {
            return {
                selectedValue: this.value
            };
        },
        watch: {
            selectedValue(newValue) {
                this.$emit('input', newValue);
            },
            value(newVal) {
                this.selectedValue = newVal;
            },
        }
    }
</script>

<style scoped>
    .form-group {
        margin-bottom: 15px;
    }

    select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }
</style>