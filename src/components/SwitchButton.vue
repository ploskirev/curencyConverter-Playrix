<script>
import SwitchIcon from './SwitchButtonIcon.svg'

export default {
  name: 'SwitchButton',
  functional: true,
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  render(h, { props, listeners }) {
    const { click: onClick } = listeners
    const { isLoading } = props
    const classes = {
      'switch-button': true,
      loading: isLoading
    }
    return (
      <button class={classes} onClick={onClick} disabled={isLoading}>
        <SwitchIcon />
      </button>
    )
  }
}
</script>

<style lang="scss" scoped>
.switch-button {
  background: none;
  border: none;
  margin: 8px 0;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.9);
  }

  & > svg {
    fill: #64758f;
  }
}

.loading {
  animation-duration: 0.5s;
  animation-name: loading;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: normal;
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
