<template>
  <div id="app">
    <h1>CURRENCY CONVERTER</h1>
    <BaseSection :title="appConstants.SETTINGS" :class="settingsSectionClasses">
      <template #content>
        <label>
          <input type="checkbox" :checked="listSection" @change="toggleListSectionVisibility" />
          List
        </label>
        <label>
          <input
            type="checkbox"
            :checked="historySection"
            @change="toggleHistorySectionVisibility"
          />
          History
        </label>
        <div
          ref="opener"
          class="opener"
          v-click-outside="toggleSettingsVisibility"
          @click.stop="toggleSettingsVisibility"
        >
          <IconSettings />
        </div>
      </template>
    </BaseSection>
    <BaseSection :title="appConstants.CONVERTER">
      <template #content>
        <div>
          <div class="current-rate">
            {{ currentRateString }}
          </div>
          <div class="input-block">
            <BaseInput
              :value="baseCurrencyQuantity"
              :isLoading="isLoading"
              :disabled="isLoading"
              class="currency-input"
              @valueUpdated="updateBaseCurrencyAmount"
            />
            <DropDown
              class="currency-selector"
              :options="currencies"
              :selected="baseCurrency"
              :useSearch="true"
              :isLoading="isLoading"
              @selectionUpdated="changeCurrency($event, appConstants.BASE)"
            />
          </div>
          <SwitchButton @click="changeCurrencies" :isLoading="isLoading" />
          <div class="input-block">
            <BaseInput
              :value="secondCurrencyQuantityDisplayValue"
              :isLoading="isLoading"
              :disabled="isLoading"
              class="currency-input"
              :readonly="true"
            />
            <DropDown
              class="currency-selector"
              :options="currencies"
              :selected="secondCurrency"
              :useSearch="true"
              :isLoading="isLoading"
              @selectionUpdated="changeCurrency($event, appConstants.SECOND)"
            />
          </div>
        </div>
      </template>
    </BaseSection>
    <BaseSection
      v-if="listSection"
      :closable="true"
      :title="appConstants.OPTIONS"
      @closeSection="toggleListSectionVisibility"
    >
      <template #content>
        <div class="opt-wrapper">
          <div class="left-side">
            <BaseTable
              :firstCurrency="baseCurrency"
              :secondCurrency="secondCurrency"
              :cost="currencyRate"
              :loading="isLoading"
            />
          </div>
          <div class="right-side">
            <BaseTable
              :firstCurrency="baseCurrency"
              :secondCurrency="secondCurrency"
              :cost="currencyRate"
              :reverse="true"
              :loading="isLoading"
            />
          </div>
        </div>
      </template>
    </BaseSection>
    <BaseSection
      v-if="historySection"
      :closable="true"
      :title="appConstants.HISTORY"
      @closeSection="toggleHistorySectionVisibility"
    >
      <template #content>
        <HistoryChart :historyData="historyDataCurrency" :labels="labels" />
      </template>
    </BaseSection>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { sub, format } from 'date-fns'
import { getLatestData, getHistoryData } from '/src/utils/fetchData.js'
import BaseSection from '/src/components/BaseSection.vue'
import BaseInput from '/src/components/BaseInput.vue'
import BaseTable from '/src/components/BaseTable.vue'
import SwitchButton from '/src/components/SwitchButton.vue'
import DropDown from '/src/components/dropDown/DropDownInput.vue'
import HistoryChart from '/src/components/HistoryChart.vue'
import IconSettings from '/src/assets/icons/settings.svg'
import {
  USD,
  RUB,
  LATEST,
  HISTORY,
  BASE,
  SECOND,
  OPTIONS,
  CONVERTER,
  SETTINGS
} from '/src/assets/constants.js'

export default {
  name: 'App',
  components: {
    BaseSection,
    BaseInput,
    BaseTable,
    DropDown,
    SwitchButton,
    HistoryChart,
    IconSettings
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      latestData: null,
      historicalData: null,
      today: format(new Date(), 'yyyy-MM-dd'),
      dateFrom: format(sub(new Date(), { days: 9 }), 'yyyy-MM-dd'),
      baseCurrency: USD,
      secondCurrency: RUB,
      currencies: [],
      baseCurrencyQuantity: 1,
      convertationOptions: [1, 5, 10, 25, 50, 100, 500, 1000, 5000],
      listSection: false,
      historySection: false,
      settingsIsOpen: false,
      isLoading: false
    }
  },
  beforeCreate() {
    this.appConstants = {
      USD,
      RUB,
      LATEST,
      HISTORY,
      BASE,
      SECOND,
      OPTIONS,
      CONVERTER,
      SETTINGS
    }
  },
  async created() {
    try {
      const [latestData, historicalData] = await Promise.all([
        this.getCosts(LATEST),
        this.getCosts(HISTORY)
      ])
      this.latestData = latestData
      this.historicalData = historicalData
      this.currencies = this.getCurrenciesList(latestData)
      this.checkAndReplaceCurrency(BASE)
      this.checkAndReplaceCurrency(SECOND)
    } catch (err) {
      console.warn(err)
    }
  },
  computed: {
    settingsSectionClasses() {
      return {
        'settings-section': true,
        open: this.settingsIsOpen
      }
    },
    currencyRate() {
      return this.latestData?.[this.secondCurrency] ?? 0
    },
    currentRateString() {
      return this.isLoading
        ? 'LOAD DATA...'
        : `1 ${this.baseCurrency} = ${this.currencyRate.toFixed(2)} ${this.secondCurrency}`
    },
    secondCurrencyQuantity() {
      return this.currencyRate ? this.currencyRate * this.baseCurrencyQuantity : 0
    },
    secondCurrencyQuantityDisplayValue() {
      return this.isLoading ? 'Loading...' : +this.secondCurrencyQuantity.toFixed(2)
    },
    labels() {
      return this.historicalData ? Object.keys(this.historicalData) : []
    },
    historyDataCurrency() {
      if (!this.historicalData) {
        return []
      } else {
        const mapFunc = dateObj => {
          let rate = dateObj[this.secondCurrency]
          return (this.baseCurrency !== USD ? rate / dateObj[this.baseCurrency] : rate).toFixed(2)
        }
        return Object.values(this.historicalData).map(mapFunc)
      }
    }
  },
  methods: {
    isCurrencyInList(currency) {
      return this.currencies.includes(currency)
    },
    getRandomCurrency() {
      const idx = Math.floor(Math.random() * this.currencies.length)
      return this.currencies[idx]
    },
    checkAndReplaceCurrency(type) {
      if (!this.isCurrencyInList(this[`${type}Currency`])) {
        this[`${type}Currency`] = this.getRandomCurrency()
      }
    },
    toggleSettingsVisibility(evt) {
      const target = evt.target
      const isTogglerClick = () => {
        const closest = target.closest('.opener')
        return closest || target === opener
      }
      const isSectionSettingsClick = () => {
        const closest = evt.target.closest('.settings-section')
        return closest || target.classList.contains('settings-section')
      }
      if (isTogglerClick()) {
        this.settingsIsOpen = !this.settingsIsOpen
      } else if (!isSectionSettingsClick()) {
        this.settingsIsOpen = false
      }
      evt.stopPropagation()
    },
    toggleListSectionVisibility() {
      this.listSection = !this.listSection
    },
    toggleHistorySectionVisibility() {
      this.historySection = !this.historySection
    },
    updateBaseCurrencyAmount(amount) {
      this.baseCurrencyQuantity = amount
    },
    getCurrenciesList(latestData) {
      return Object.keys(latestData).sort()
    },
    async getCosts(type) {
      try {
        this.isLoading = true
        if (type === LATEST) {
          return await getLatestData(this.baseCurrency)
        } else {
          return await getHistoryData(USD, this.dateFrom, this.today)
        }
      } catch (err) {
        console.warn(err)
      } finally {
        this.isLoading = false
      }
    },
    async changeCurrency(currency, currencyType) {
      this[`${currencyType}Currency`] = currency
      this.latestData = await this.getCosts(LATEST)
    },
    async changeCurrencies() {
      const tempCurrency = this.secondCurrency
      this.secondCurrency = this.baseCurrency
      this.baseCurrency = tempCurrency
      this.latestData = await this.getCosts(LATEST)
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 8px;
  height: 100vh;
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: #6969dd #e0e0e0;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: darkgrey;
  }

  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
}

.current-rate {
  margin: 12px auto;
}

.input-block {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
}

.currency-selector {
  flex-basis: 120px;
  flex-shrink: 0;
}

.opt-wrapper {
  display: flex;
  flex-wrap: nowrap;
}

.left-side,
.right-side {
  width: 50%;
}
</style>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  background: rgb(235, 237, 241);
  overflow: hidden;
}

input[type='number'] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.section.settings-section {
  position: fixed;
  left: 8px;
  right: 8px;
  top: -95px;
  margin: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgb(161, 171, 192) 0%, rgba(100, 117, 143, 1) 100%);
  color: rgb(235, 235, 235);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: 0 1px 4px 1px #ccc;
  transition: transform 0.3s;

  label,
  input {
    cursor: pointer;
  }
}

.opener {
  position: absolute;
  height: 30px;
  width: 50px;
  bottom: -30px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  box-shadow: 0 2px 2px 0 #ccc;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #64758f;
  cursor: pointer;

  svg {
    fill: rgb(235, 235, 235);
  }
}

.settings-section.open {
  transform: translateY(70px);
}

.currency-input {
  flex-basis: 200px;
  flex-shrink: 1;
  flex-grow: 1;
}

.left-side tr td:last-child {
  border-right: 1px solid rgb(223, 223, 223);
}
</style>
