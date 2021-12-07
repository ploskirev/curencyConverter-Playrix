<template functional>
  <section :class="{ section: true, ...data.class }">
    <h2 class="section-title">{{ props.title }}</h2>
    <button v-if="props.closable" class="close-button" @click="listeners.closeSection">
      &times;
    </button>
    <slot name="content"></slot>
  </section>
</template>

<script>
export default {
  name: 'BaseSection',
  functional: true,
  props: {
    title: {
      type: String,
      required: true
    },
    closable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  position: relative;
  margin: 20px 0;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 0 4px 1px #ccc;
  background: #fff;
}

.close-button {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 16px;
  padding: none;
  border: none;
  background: #fff;
  color: #2c3e50;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.9);
  }
}

.section-title {
  margin: 12px auto;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
}
</style>
