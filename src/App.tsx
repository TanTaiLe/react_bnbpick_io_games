import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes, IRouteConfig } from "@config/router.config";
import { Notfound } from "@container/Notfound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AntdConfigProvider from "./provider/AntdConfigProvider.tsx";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AntdConfigProvider>
        <BrowserRouter basename={"/"}>
          <Routes>
            {routes.map((item: IRouteConfig) => (
              <Route
                key={item.name}
                path={item.path}
                element={item.component}
              />
            ))}

            <Route path={"*"} element={<Notfound />} />
          </Routes>
        </BrowserRouter>
      </AntdConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
