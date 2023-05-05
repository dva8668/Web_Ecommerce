import Home from "../pages/Home/Home";
import Product from "../pages/Admin/Products/Product";
import Collection from "../pages/Admin/Products/Collection";
import Dashboard from "../pages/Admin/Dashboard";
import Warehouse from "../pages/Admin/Products/Warehouse";
import User from "../pages/Admin/Users/User";
import Create from "../pages/Admin/Orders/Create";
import Order from "../pages/Admin/Orders/Order";
import Discount from "../pages/Admin/Discounts/Discount";
import PageNotFound from "../pages/PageNotFound";
import Category from "../pages/Category/Category";
import ProductPage from "../pages/Product/Product";
import Register from "../pages/Register/Register";
import CreateNewProduct from "../pages/Admin/Products/CreateNewProduct";
import EditProduct from "../pages/Admin/Components/EditProduct";
import Login from "../pages/Login/Login";
import UserSetting from "../layouts/components/User/UserSetting";
import UserOrder from "../layouts/components/User/UserOrder";
import Cart from "../pages/Cart/Cart";
import Success from "../layouts/components/Success/success";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "notfound", component: PageNotFound },
  { path: "category/:params", component: Category },
  { path: "product/:id", component: ProductPage },
  { path: "register", component: Register },
  { path: "login", component: Login },
  { path: "profile", component: UserSetting },
  { path: "orders", component: UserOrder },
  { path: "cart", component: Cart },
  { path: "success", component: Success },
];

const privateRoutes = [
  { path: "dashboard", component: Dashboard },
  { path: "dashboard/orders", component: Order },
  { path: "dashboard/create-order", component: Create },
  { path: "dashboard/products", component: Product },
  { path: "dashboard/collections", component: Collection },
  { path: "dashboard/create-new-product", component: CreateNewProduct },
  { path: "dashboard/edit-product/:id", component: EditProduct },
  { path: "dashboard/warehouse", component: Warehouse },
  { path: "dashboard/users", component: User },
  { path: "dashboard/discounts", component: Discount },
];

export { publicRoutes, privateRoutes };
