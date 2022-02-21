export default {
  layout: {
    webTitle: 'Mon site e-commerce'
  },
  index: {
    h1: 'Listes de tous les produits',
    search: 'Rechercher',
    category: 'Catégorie'
  },
  navBar: [
      {
        icon: 'mdi-apps',
        title: 'Accueil',
        to: '/'
      },
      {
        icon: 'mdi-format-list-checkbox',
        title: 'Produits',
        to: '/stripeAPI'
      },
      {
        icon: 'mdi-cart',
        title: 'Village',
        to: '/stripeJS'
      }
  ]
}
