<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <b-form-datepicker
            v-model="dateInputModel"
            :placeholder="placeholder"
            :min="minDate"
            :max="maxDate">
        </b-form-datepicker>
    </div>
</template>
<script>
    export default {
        name: 'Number',
        props: {
            placeholder: String,
            title: String,
            value: String,
            minDate: String,
            maxDate: String
        },
        methods: {
            clearInput() {
                this.dateInputModel = null;
            }
        },
        data() {
            return {
                dateInputModel: this.value
            };
        },
        watch: {
            value(newValue) {
                this.dateInputModel = newValue;
            },
            dateInputModel(newValue) {
                this.$emit('input', newValue);
            }
        }
    }
</script>