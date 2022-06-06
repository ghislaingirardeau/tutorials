<template>
  <v-row>
    <v-col cols="6">
      <h2>Valeur relative au pret</h2>
      <v-text-field
        v-model="loan.amount"
        label="Loan amount"
        required
      ></v-text-field>
      <v-text-field v-model="loan.rate" label="Rate" required></v-text-field>
      <v-text-field v-model="loan.year" label="Year" required></v-text-field>
    </v-col>
    <v-col cols="6">
      <h2>recap du pret</h2>
      <p>Nombre de paiement : {{ loan.year * 12 }}</p>
      <p>montant echeance: {{ mensualite }}</p>
      <p>interest total: {{ interestTotal }}</p>
      <p>total du pret: {{ totalLoan }}</p>
    </v-col>
    <v-simple-table v-if="loan.amount != null">
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
            <td>{{ item.dep }}</td>
            <td>{{ item.capital }}</td>
            <td>{{ item.interest }}</td>
            <td>{{ item.final }}</td>
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
      loan: {
        amount: null,
        rate: null,
        year: null,
      },
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
      this.interestTotal = 0
      for (let index = 0; index < years.length; index++) {
        /* let solde */
        if (index === 0) {
          years[index] = {
            dep: this.loan.amount,
            capital:
              this.mensualite -
              ((this.loan.rate / 12) * this.loan.amount) / 100,
            interest: ((this.loan.rate / 12) * this.loan.amount) / 100,
            final:
              this.loan.amount -
              (this.mensualite -
                ((this.loan.rate / 12) * this.loan.amount) / 100),
          };
          /* solde = years[index].dep - years[index].final */
        } else {
          let solde = years[index - 1].final;
          years[index] = {
            dep: solde,
            capital: this.mensualite - ((this.loan.rate / 12) * solde) / 100,
            interest: ((this.loan.rate / 12) * solde) / 100,
            final:
              solde - (this.mensualite - ((this.loan.rate / 12) * solde) / 100),
          };
        }
        this.interestTotal = this.interestTotal + years[index].interest
      }
      return years;
    },
    totalLoan() {
        let total = parseInt(this.loan.amount) + parseInt(this.interestTotal)
        return total
    }
  },
};
</script>

<style lang="scss" scoped>
</style>