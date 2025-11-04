import React, { ReactElement } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import RickMorty from "../pages/RickMorty";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import CreateProduct from "../pages/CreateProduct";
import Upload from "../pages/Upload";
import NotFound from "../pages/NotFound";
import { useAppStore } from "../store/useAppStore";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
    const token = useAppStore((state) => state.token);
    return token ? children : <Navigate to="/login" />;
};

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />

                {/* Rutas protegidas */}
                <Route path="/rick-morty" element={<PrivateRoute><RickMorty /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/create-product" element={<CreateProduct />} />
                <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}
