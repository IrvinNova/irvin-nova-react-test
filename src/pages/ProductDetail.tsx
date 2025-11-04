import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../api/fakeStoreApi";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const res = await fetchProductById(id!);
                setProduct(res);
            } catch (err) {
                console.error("Error al cargar producto:", err);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
                <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <p className="mt-4">Cargando producto...</p>
            </div>
        );

    if (!product) return <p className="text-center text-white">Producto no encontrado.</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-800 to-purple-900 text-white flex items-center justify-center p-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl max-w-3xl w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 text-indigo-400 hover:underline"
                >
                    ← Volver
                </button>
                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-64 h-64 object-contain bg-slate-700 rounded-lg"
                    />
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                        <p className="text-gray-300 mb-2">{product.category}</p>
                        <p className="text-indigo-400 text-xl font-semibold mb-4">${product.price}</p>
                        <p className="text-gray-200">{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
