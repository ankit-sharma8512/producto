import { Suspense, lazy } from "react";
import { Route, Routes }  from "react-router";
import { Outlet }         from "react-router-dom";
import { Spin }           from "antd";
import Dashboard          from './layout/Dashboard';
import Home               from './pages/Home'

const ProductList   = lazy(() => import('./pages/product/List'));
const ProductCreate = lazy(() => import('./pages/product/Create'));
const ProductDetail = lazy(() => import('./pages/product/Detail'));

const PurchaseList   = lazy(() => import("./pages/purchase/List"));
const PurchaseDetail = lazy(() => import("./pages/purchase/Detail"));
const PurchaseCreate = lazy(() => import("./pages/purchase/Create"));
const PurchaseUpdate = lazy(() => import("./pages/purchase/Update"));

const OrderList   = lazy(() => import("./pages/order/List"));
const OrderCreate = lazy(() => import("./pages/order/Create"));
const OrderDetail = lazy(() => import("./pages/order/Detail"));
const OrderUpdate = lazy(() => import("./pages/order/Update"));

const GRNList   = lazy(() => import("./pages/grn/List"));

const BuyerList = lazy(() => import("./pages/trader/Buyer"));
const VendorList = lazy(() => import("./pages/trader/Vendor"));

/*
const ProductList = lazy(() => import('./pages/product/List'));
const ProductDetail = lazy(() => import('./pages/product/Detail'));
const Stock = lazy(() => import('./pages/product/Stock'));
const BillingList = lazy(() => import("./pages/billing/List"));
const BillingCreate = lazy(() => import("./pages/billing/Create"));
const BillingUpdate = lazy(() => import("./pages/billing/Update"));
const BillingDetail = lazy(() => import("./pages/billing/Detail"));
const BillingReport = lazy(() => import("./pages/billing/Report"));
const BuyerList = lazy(() => import("./pages/trader/Buyer"));
const VendorList = lazy(() => import("./pages/trader/Vendor"));
const PurchaseList = lazy(() => import("./pages/purchase/List"));
const PurchaseCreate = lazy(() => import("./pages/purchase/Create"));
const PurchaseDetail = lazy(() => import("./pages/purchase/Detail"));
const PurchaseUpdate = lazy(() => import("./pages/purchase/Update"));
*/

function Placeholder() {
	return (
		<Suspense fallback={<Spin/>}>
			<Outlet/>
		</Suspense>
	);
}

function RouteController() {
	return (
		<Routes>
			<Route element={<Dashboard/>}>
				<Route index element={<Home/>} />

				<Route path='product' element={<Placeholder/>}>
					<Route index                element={<ProductList />} />
					<Route path='create'        element={<ProductCreate />} />
          <Route path=':id'           element={<ProductDetail />} />
          <Route path='update/:id'    element={<ProductCreate />} />
				</Route>				
				<Route path='purchase' element={<Placeholder/>}>
          <Route index                element={<PurchaseList/>}/>
          <Route path='create'        element={<PurchaseCreate/>}/>
          <Route path=':id'           element={<PurchaseDetail/>}/>
          <Route path='update/:id'    element={<PurchaseUpdate />} />
        </Route>
        <Route path='order' element={<Placeholder/>}>
          <Route index                element={<OrderList/>}/>
          <Route path='create'        element={<OrderCreate/>}/>
          <Route path=':id'           element={<OrderDetail/>}/>
          <Route path='update/:id'    element={<OrderUpdate />} />
        </Route>
        <Route path='grn' element={<Placeholder/>}>
          <Route index                element={<GRNList />}/>
        </Route>
        <Route path='buyer' element={<Suspense fallback={<Spin />}><BuyerList /></Suspense>} />
        <Route path='vendor' element={<Suspense fallback={<Spin />}><VendorList /></Suspense>} />
				<Route path='*' element={<span style={{color:'black'}}>Invalid Path</span>} />
			</Route>
		</Routes>
	);
}

/*
function RouteController() {
  return (
    <Routes>
      <Route element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path='product' element={<Suspense fallback={<Spin />}><Outlet /></Suspense>}>
          <Route index element={<ProductList />} />
          <Route path=':_id' element={<ProductDetail />} />
        </Route>
        <Route path='stock' element={<Suspense fallback={<Spin />}><Outlet /></Suspense>}>
          <Route index element={<Stock />} />
        </Route>
        <Route path='billing' element={<Suspense fallback={<Spin />}><Outlet /></Suspense>}>
          <Route index element={<BillingList />} />
          <Route path='create' element={<BillingCreate />} />
          <Route path=':id' element={<BillingDetail />} />
          <Route path='update/:id' element={<BillingUpdate />} />
          <Route path='report' element={<BillingReport />} />
        </Route>
        <Route path='purchase' element={<Suspense fallback={<Spin />}><Outlet /></Suspense>}>
          <Route index element={<PurchaseList />} />
          <Route path='create' element={<PurchaseCreate />} />
          <Route path=':id' element={<PurchaseDetail />} />
          <Route path='update/:id' element={<PurchaseUpdate />} />
        </Route>
        <Route path='buyer' element={<Suspense fallback={<Spin />}><BuyerList /></Suspense>} />
        <Route path='vendor' element={<Suspense fallback={<Spin />}><VendorList /></Suspense>} />
      </Route>
    </Routes>
  );
}
*/
export default RouteController;
