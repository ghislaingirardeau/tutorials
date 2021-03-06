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
        :prefix="currency === 'Dollars' ? '$' : '៛'"
        id="loanAmountInput"
      ></v-text-field>
      <v-text-field
        v-model="loan.rate"
        label="Rate"
        suffix="%"
        required
      ></v-text-field>
      <v-text-field
        v-model="loan.year"
        label="Year"
        type="number"
        required
      ></v-text-field>

      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Date Loan Start"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" type="month" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="6">
      <h2>Recap du pret</h2>
      <v-select
        v-model="periodicity"
        :items="items"
        label="Payment Periodicity"
        item-text="state"
        item-value="value"
        return-object
        single-line
      ></v-select>

      <p>Nombre de paiement : {{ loan.year * periodicity.value }}</p>
      <p>
        Amount {{ periodicity.state }}:
        {{
          periodicity.value === 12
            ? convertNumberInput(parseInt(mensualite).toString())
            : convertNumberInput(parseInt(mensualite * 12).toString())
        }}
        {{ currency === "Dollars" ? " $" : " ៛" }}
      </p>
      <p>
        interest total:
        {{ convertNumberInput(parseInt(interestTotal).toString()) }}
        {{ currency === "Dollars" ? " $" : " ៛" }}
      </p>
      <p>
        total du pret: {{ totalLoan }}
        {{ currency === "Dollars" ? " $" : " ៛" }}
      </p>
      <v-text-field
        v-model="income"
        label="My expected income / year"
        required
      ></v-text-field>
      <p
        v-if="income > 0"
        :class="{
          'advice-green': adviceMessage.response,
          'advice-red': !adviceMessage.response,
        }"
      >
        {{ adviceMessage.message }}
      </p>
    </v-col>
    <v-col cols="12">
      <h2>My amortizable table</h2>
      <v-simple-table
        v-if="loan.amount != null && loan.rate != null && loan.year != null"
        fixed-header
        height="300px"
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Date</th>
              <th class="text-left">Depart</th>
              <th class="text-left">Capital</th>
              <th class="text-left">interest</th>
              <th class="text-left">Final</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in amortissement" :key="i">
              <td>
                {{ item.date }}
              </td>
              <td>
                {{
                  currency === "Dollars"
                    ? parseFloat(item.loanBegin).toFixed(2)
                    : parseInt(item.loanBegin)
                }}
              </td>
              <td>
                {{
                  currency === "Dollars"
                    ? item.capital.toFixed(2)
                    : parseInt(item.capital)
                }}
              </td>
              <td>
                {{
                  currency === "Dollars"
                    ? item.interest.toFixed(2)
                    : parseInt(item.interest)
                }}
              </td>
              <td>
                {{
                  currency === "Dollars"
                    ? item.loanFinal.toFixed(2)
                    : parseInt(item.loanFinal)
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      currencyList: ["Riels", "Dollars"],
      currency: "Dollars",
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      loan: {
        amount: 10000,
        rate: 5.5,
        year: 2,
      },
      periodicity: { state: "Monthly", value: 12 },
      items: [
        { state: "Monthly", value: 12 },
        { state: "Yearly", value: 1 },
      ],
      interestTotal: 0,
      income: 0,
    };
  },
  computed: {
    mensualite() {
      // interet + capital
      let calcul =
        (parseInt(this.loan.amount.toString().replaceAll(" ", "")) *
          (this.loan.rate / 100)) /
        12 /
        (1 - (1 + this.loan.rate / 100 / 12) ** (-12 * this.loan.year));
      if (calcul) {
        return this.currency === "Dollars"
          ? parseFloat(calcul).toFixed(2)
          : parseInt(calcul);
      } else {
        return 0;
      }
    },
    amortissement() {
      let years = new Array(this.loan.year * 12);
      this.interestTotal = 0;
      const amortTable = (i, amountMonthly, dateParams) => {
        years[i] = {
          date: dateParams.toISOString().substr(0, 7),
          loanBegin: amountMonthly,
          capital:
            this.mensualite - ((this.loan.rate / 12) * amountMonthly) / 100,

          interest: ((this.loan.rate / 12) * amountMonthly) / 100,
          loanFinal:
            amountMonthly -
            (this.mensualite - ((this.loan.rate / 12) * amountMonthly) / 100),
        };
      };
      for (let index = 0; index < years.length; index++) {
        let today = new Date(this.date);
        today.setMonth(today.getMonth() + index);
        if (index === 0) {
          let amount = this.loan.amount.toString().replaceAll(" ", "");
          amortTable(index, amount, today);
        } else {
          let solde = years[index - 1].loanFinal;
          amortTable(index, solde, today);
        }
        this.interestTotal =
          this.interestTotal + parseFloat(years[index].interest);
      }
      return years;
    },
    totalLoan() {
      let total =
        parseInt(this.loan.amount.toString().replaceAll(" ", "")) +
        parseFloat(this.interestTotal);
      let totalFormated = this.convertNumberInput(parseInt(total).toString());
      if (totalFormated != "NaN") {
        return totalFormated;
      } else {
        return 0;
      }
    },
    adviceMessage() {
      let result = ((this.mensualite * 12) / this.income) * 100;
      if (result < 50) {
        return {
          message: "Your loan is good balance",
          response: true,
        };
      } else {
        return {
          message: "Your loan is dangerous",
          response: false,
        };
      }
    },
  },
  methods: {
    convertNumberInput(value) {
      if (value.length > 3 && value.length < 7) {
        let a = value.slice(-3);
        let b = value.slice(0, -3);
        return b.concat(" ", a);
      } else if (value.length > 6) {
        let a = value.slice(-3);
        let b = value.slice(0, -6);
        let c = value.slice(-6, -3);
        return b.concat(" ", c, " ", a);
      } else {
        return value;
      }
    },
  },
  mounted() {
    const loanValue = document.getElementById("loanAmountInput");
    loanValue.addEventListener("focusin", (event) => {
      this.loan.amount = this.loan.amount.toString().replaceAll(" ", "");
    });

    loanValue.addEventListener("focusout", (e) => {
      this.loan.amount = this.convertNumberInput(e.target.value);
    });
  },
};
</script>

<style lang="scss" scoped>
.advice-green {
  color: green;
}
.advice-red {
  color: red;
}
</style>