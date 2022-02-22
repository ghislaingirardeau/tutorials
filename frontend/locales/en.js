export default {
  layout: {
    webTitle: 'My e-commerce webite'
  },
  index: {
    h1: 'All products list',
    search: 'Search',
    category: 'Category',
    currency: "$",
    cardMore: "Learn more",
    cardCart: "Add cart",
    cardTitle: "Origin",
    cardClose: "Close"
  },
  navBar: [
      {
        icon: 'mdi-apps',
        title: 'Welcome',
        to: '/'
      },
      {
        icon: 'mdi-format-list-checkbox',
        title: 'Products',
        to: '/stripeAPI'
      },
      {
        icon: 'mdi-cart',
        title: 'Village',
        to: '/stripeJS'
      }
  ]
}