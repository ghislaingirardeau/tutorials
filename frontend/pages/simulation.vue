<template>
  <v-row>
    <v-col cols="6">
      <h2>Valeur relative au pret</h2>
      <v-select
        v-model="currency"
        :items="currencyList"
        label="currency"
        single-line
      ></v-select>

      <v-text-field
        v-model="loan.amount"
        label="Loan amount"
        required
      ></v-text-field>
      <v-text-field v-model="loan.rate" label="Rate" required></v-text-field>
      <v-text-field v-model="loan.year" label="Year" required></v-text-field>
      <v-select
        v-model="periodicity"
        :items="items"
        label="Payment Periodicity"
        item-text="state"
        item-value="value"
        return-object
        single-line
      ></v-select>
    </v-col>
    <v-col cols="6">
      <h2>recap du pret</h2>
      <p>Nombre de paiement : {{ loan.year * periodicity.value }}</p>
      <p>montant echeance: {{ mensualite }}</p>
      <p>interest total: {{ interestTotal.toFixed(2) }}</p>
      <p>total du pret: {{ totalLoan }}</p>
    </v-col>
    <v-simple-table
      v-if="loan.amount != null && loan.rate != null && loan.year != null"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Depart</th>
            <th class="text-left">Capital</th>
            <th class="text-left">interest</th>
            <th class="text-left">Final</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in amortissement" :key="i">
            <td>{{ item.loanBegin }}</td>
            <td>{{ item.capital }}</td>
            <td>{{ item.interest }}</td>
            <td>{{ item.loanFinal }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
        currencyList: ['Riels', 'Dollars'],
        currency: 'Dollars',
      loan: {
        amount: null,
        rate: null,
        year: null,
      },
      periodicity: { state: "Monthly", value: 12 },
      items: [
        { state: "Monthly", value: 12 },
        { state: "Trimester", value: 4 },
        { state: "Yearly", value: 1 },
      ],
      interestTotal: 0,
    };
  },
  computed: {
    mensualite() {
      // interet + capital
      let calcul =
        (this.loan.amount * (this.loan.rate / 100)) /
        12 /
        (1 - (1 + this.loan.rate / 100 / 12) ** (-12 * this.loan.year));
      return parseInt(calcul);
    },
    amortissement() {
      let years = new Array(this.loan.year * 12);
      this.interestTotal = 0;
      for (let index = 0; index < years.length; index++) {
        const amortTable = (amountMonthly) => {
          years[index] = {
            loanBegin: this.moneyConvert(amountMonthly),
            capital: this.moneyConvert(this.mensualite - ((this.loan.rate / 12) * amountMonthly) / 100),
              
            interest: this.moneyConvert(((this.loan.rate / 12) * amountMonthly) / 100),
            loanFinal: this.moneyConvert(amountMonthly -
              (this.mensualite - ((this.loan.rate / 12) * amountMonthly) / 100)),
          };
        };
        if (index === 0) {
          amortTable(this.loan.amount);
        } else {
          let solde = years[index - 1].loanFinal;
          amortTable(solde);
        }
        this.interestTotal =
          this.interestTotal + parseFloat(years[index].interest);
      }
      return years;
    },
    totalLoan() {
      let total = parseInt(this.loan.amount) + parseInt(this.interestTotal);
      return total;
    },
  },
  methods: {
      moneyConvert(a) {
          if (this.currency === 'Dollars') {
              return parseFloat(a).toFixed(2)
          } else {
              return parseInt(a)
          }
      }
  },
};
</script>

<style lang="scss" scoped>
</style>