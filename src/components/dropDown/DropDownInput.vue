<template>
  <div ref="inputWrapper" class="dropdown-wrapper">
    <input
      :readonly="!useSearch || isLoading"
      :value="dropDownDisplayValue"
      :class="inputClasses"
      @click="openDropDown"
      @keypress.enter.prevent="openDropDown"
      @input="debouncedUpdateSearch"
    />
    <DropDownList
      v-click-outside="closeDropDown"
      v-show="isDropdownOpened"
      :options="options"
      :searchText="searchText"
      :selected="selected"
      @optionSelected="emitValue"
    />
    <div :class="dropdownIconClasses" @click="toggleDropdownShow"></div>
  </div>
</template>

<script>
import DropDownList from './DropDownList.vue'
import ClickOutside from 'vue-click-outside'
import { debounce } from '/src/utils/debounce.js'

export default {
  name: 'DropDownInput',
  components: {
    DropDownList
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: [String, Number, Object],
      required: true
    },
    useSearch: {
      type: Boolean,
      default: false
    },
    optKey: {
      type: String,
      default: 'id'
    },
    optLabel: {
      type: String,
      default: 'label'
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      isDropdownOpened: false,
      searchText: '',
      debouncedUpdateSearch: debounce(this.updateSearch, 500)
    }
  },
  computed: {
    dropDownDisplayValue() {
      if (this.useSearch) {
        return this.isDropdownOpened ? this.searchText : this.selected
      } else {
        return this.selected
      }
    },
    inputClasses() {
      return {
        'dropdown-input': true,
        'no-search': !this.useSearch,
        disabled: this.isLoading
      }
    },
    dropdownIconClasses() {
      return {
        'dropdown-icon': true,
        rotated: this.isDropdownOpened
      }
    }
  },
  methods: {
    toggleDropdownShow() {
      this.isDropdownOpened ? this.closeDropDown() : this.openDropDown()
    },
    openDropDown() {
      if (!this.isLoading) {
        this.searchText = ''
        this.isDropdownOpened = true
      }
    },
    checkAbleToClose(event) {
      if (event) {
        const target = event.target
        const condition = target.closest('.dropdown-wrapper') == this.$refs.inputWrapper
        return !condition ? true : false
      } else {
        return true
      }
    },
    closeDropDown(event) {
      if (this.checkAbleToClose(event)) {
        this.searchText = ''
        this.isDropdownOpened = false
      }
    },
    emitValue(val) {
      this.$emit('selectionUpdated', val)
      this.closeDropDown()
    },
    updateSearch(val) {
      this.searchText = val.target.value
    }
  }
}
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
}

.dropdown-input {
  width: 100%;
  text-transform: uppercase;
  height: 60px;
  border: 3px solid #ddd;
  border-left-width: 1px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 24px;
  font-weight: 700;
  line-height: 60px;
  color: #555;
  padding-left: 8px;
}

.dropdown-icon {
  border-left: 1px solid rgb(166, 180, 194);
  border-bottom: 1px solid rgb(166, 180, 194);
  transform-origin: 40% 65%;
  transform: rotate(-45deg);
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: 0;
  top: calc(50% - 7px);
  right: 15px;
  cursor: pointer;
  transition: transform 0.3s;
}

.dropdown-icon.rotated {
  transform: rotate(135deg);
}

.no-search {
  cursor: pointer;
}

.disabled {
  opacity: 0.5;
}
</style>
