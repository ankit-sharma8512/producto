import { ConfigProvider, App } from "antd"
import { BrowserRouter }       from "react-router-dom"
import RouteController         from "./routes"
import {
	QueryClient,
	QueryClientProvider
}                              from "react-query";
import theme                   from "../antd-theme";

const queryClient = new QueryClient();

function Application() {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ConfigProvider theme={theme}>
					<App>
						<RouteController />
					</App>
				</ConfigProvider>
			</QueryClientProvider>
		</BrowserRouter>
	)
}

export default Application
