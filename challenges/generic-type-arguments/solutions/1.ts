type GroceryStore<Name, City> = {
  name: Name;
  city: City;
};

type GroceryItem<Name, Price, InStock> = {
  name: Name;
  price: Price;
  inStock: InStock;
};

type CapreseSalad = GroceryItem<'Caprese Salad', 14.99, true>;
