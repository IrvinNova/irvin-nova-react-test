import React, { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "../api/fakeStoreApi";
import { useNavigate } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const itemsPerPage = 20;

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const res = await fetchProducts();
                setProducts(res);
                setFiltered(res);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    // Filtrar por nombre
    useEffect(() => {
        const f = products.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, products]);

    // Paginación
    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-800 to-purple-900 text-white p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Productos</h1>

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-96 px-4 py-2 mb-6 rounded-lg text-black outline-none"
            />

            {/* Loader */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg">Cargando productos...</p>
                </div>
            ) : (
                <>
                    {/* Grid de cards */}
                    <div className="grid grid-cols-5 gap-6 w-full max-w-6xl">
                        {paginatedProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="bg-slate-800 p-4 rounded-xl shadow-md cursor-pointer hover:scale-105 hover:shadow-indigo-500/40 transition-transform duration-300"
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-40 w-full object-contain mb-4"
                                />
                                <h3 className="font-semibold text-lg mb-2 truncate">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-300 mb-1 italic">
                                    {product.category}
                                </p>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                    {product.description}
                                </p>
                                <p className="font-bold text-indigo-400">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Paginación dinámica */}
                    {totalPages >= 1 && (
                        <div className="flex justify-center mt-10 space-x-3">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((num) => num >= page - 2 && num <= page + 2)
                                .map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`px-4 py-2 rounded-lg transition font-medium ${num === page
                                            ? "bg-indigo-400 text-slate-900 scale-105"
                                            : "bg-slate-700 hover:bg-indigo-500"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}

                </>
            )}
        </div>
    );
}
