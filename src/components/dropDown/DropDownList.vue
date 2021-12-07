<template>
  <div class="options-wrapper">
    <DropDownOption
      v-for="option in filteredOptions"
      :key="option"
      :item="option"
      :isSelected="isSelectedOption(option)"
      @click="selectOption"
      @keypress.native.enter.prevent="selectOption(option)"
    />
  </div>
</template>

<script>
import DropDownOption from './DropDownOption.vue'

export default {
  name: 'DropdownList',
  components: {
    DropDownOption
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    searchText: {
      type: String
    },
    selected: {
      type: [String, Number, Object]
    }
  },
  computed: {
    searchTextLower() {
      return this.searchText.toLowerCase().trim()
    },
    filteredOptions() {
      if (!this.searchText) {
        return this.options
      }
      return this.options.filter(option => option.toLowerCase().indexOf(this.searchTextLower) >= 0)
    }
  },
  methods: {
    isSelectedOption(option) {
      return option === this.selected
    },
    selectOption(val) {
      this.$emit('optionSelected', val)
    }
  }
}
</script>

<style scoped>
.options-wrapper {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  top: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 5px;
  border: 2px solid rgb(221, 230, 240);
}
</style>
