<script>
export default {
  name: 'BaseInput',
  functional: true,
  props: {
    value: {
      type: [Number, String],
      requred: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  render(h, { props, listeners, data }) {
    const { isLoading, value } = props
    const { valueUpdated } = listeners
    const { staticClass, attrs } = data
    const checkValue = evt => {
      if (evt.key.match(/^[e-]$/)) {
        evt.preventDefault()
      }
    }
    const updateValue = evt => {
      let amount = +evt.target.value
      if (amount < 0) {
        amount *= -1
      }
      valueUpdated(amount)
    }
    const inputClasses = {
      [`${staticClass} base-input`]: true,
      disabled: isLoading
    }
    return (
      <input
        readonly={attrs.readonly}
        disabled={attrs.disabled}
        type={isLoading ? 'text' : 'number'}
        class={inputClasses}
        value={value}
        onKeydown={checkValue}
        onInput={updateValue}
      />
    )
  }
}
</script>

<style lang="scss" scoped>
.base-input {
  height: 60px;
  border: 3px solid #ddd;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 32px;
  line-height: 60px;
  padding: 0 8px;
  color: #555;
}

.disabled {
  opacity: 0.5;
}
</style>
