<template functional>
  <table>
    <thead>
      <tr>
        <th>{{ props.reverse ? props.secondCurrency : props.firstCurrency }}</th>
        <th>{{ props.reverse ? props.firstCurrency : props.secondCurrency }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="option in props.convertationOptions" :key="option">
        <td>{{ option }}</td>
        <td v-if="props.reverse" :class="{ 'cell-loading': props.loading }">
          {{ props.loading ? 'load...' : ((1 / props.cost) * option).toFixed(2) }}
        </td>
        <td v-else :class="{ 'cell-loading': props.loading }">
          {{ props.loading ? 'load...' : (props.cost * option).toFixed(2) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'BaseTable',
  functional: true,
  props: {
    firstCurrency: {
      type: String,
      required: true
    },
    secondCurrency: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    reverse: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    convertationOptions: {
      type: Array,
      default: () => [1, 5, 10, 25, 50, 100, 500, 1000, 5000]
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}

th {
  font-weight: 500;
  border-bottom: 2px solid grey;
  min-width: 75px;
}

tr:not(last-child) td {
  border-bottom: 1px solid rgb(223, 223, 223);
}

td {
  padding: 4px;
}

.cell-loading {
  background: linear-gradient(
    90deg,
    rgba(235, 237, 241, 1) 0%,
    rgba(255, 255, 255, 0.20351890756302526) 25%,
    rgba(235, 237, 241, 1) 50%,
    rgba(255, 255, 255, 0.20351890756302526) 100%
  );
  color: #fff;
  animation: gradient 1s linear infinite;
  background-size: 400%;
}

@keyframes gradient {
  0% {
    background-position: 0%;
  }
  50% {
    background-position: 100%;
  }
  100% {
    background-position: 0%;
  }
}
</style>
