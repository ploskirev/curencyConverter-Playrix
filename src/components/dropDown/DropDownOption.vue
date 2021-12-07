<script>
export default {
  name: 'DropDownOption',
  functional: true,
  props: {
    item: {
      type: String
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  render(h, { props, listeners }) {
    const optionClasses = {
      'option-wrapper': true,
      'selected-option': props.isSelected
    }
    return (
      <div tabindex="0" class={optionClasses} onClick={() => listeners.click(props.item)}>
        {props.item}
      </div>
    )
  }
}
</script>

<style scoped>
.option-wrapper {
  cursor: pointer;
  padding: 5px;
  font-size: 18px;
  font-weight: 500;
}

.option-wrapper:hover {
  background: #eeeef0;
  color: #64758f;
}

.selected-option {
  color: #eeeef0;
  background: #64758f;
}
</style>
