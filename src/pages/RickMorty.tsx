import React, { useEffect, useState, useMemo } from "react";
import { fetchCharacters } from "../api/rickApi";
import moment from "moment";
import { RMCharacter } from "../types/rm";

export default function RickMorty() {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<RMCharacter[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof RMCharacter; direction: "asc" | "desc" } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetchCharacters(page);
                setData(response.results);
                setTotalPages(response.info.pages);
            } catch (err) {
                console.error("Error loading data", err);
            } finally {
                // retraso leve para mejorar transición
                setTimeout(() => setLoading(false), 600);
            }
        };
        loadData();
    }, [page]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            const key = sortConfig.key;
            const valueA = key === "created" ? new Date(a[key]).getTime() : a[key];
            const valueB = key === "created" ? new Date(b[key]).getTime() : b[key];
            if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const handleSort = (key: keyof RMCharacter) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const renderPagination = () => {
        const range: number[] = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) range.push(i);

        return (
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-indigo-600 transition-all duration-200 disabled:opacity-40"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    ◀
                </button>

                {range.map((num) => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`px-3 py-1 rounded font-medium shadow-md transition-all duration-200 ${page === num
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-110"
                            : "bg-gray-800 text-gray-300 hover:bg-indigo-700 hover:text-white"
                            }`}
                    >
                        {num}
                    </button>
                ))}

                <button
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-indigo-600 transition-all duration-200 disabled:opacity-40"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    ▶
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white p-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center mb-10 tracking-wider animate-pulse">
                ⚛️ Rick and Morty Universe
            </h1>

            {/* 🔄 SPINNER de carga */}
            {loading ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300 text-lg">Cargando personajes...</p>
                </div>
            ) : (
                <>
                    {/* 🌌 Tabla con efecto de aparición */}
                    <div
                        className="overflow-x-auto w-full max-w-6xl opacity-0 animate-fadeInUp shadow-2xl rounded-2xl"
                        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
                    >
                        <table className="min-w-full bg-gray-900/70 rounded-2xl border border-gray-700 backdrop-blur-md overflow-hidden">
                            <thead className="bg-gradient-to-r from-indigo-800 to-purple-800">
                                <tr>
                                    {["id", "name", "species", "gender", "created"].map((key) => (
                                        <th
                                            key={key}
                                            onClick={() => handleSort(key as keyof RMCharacter)}
                                            className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer select-none hover:text-indigo-300 transition-colors"
                                        >
                                            {key}{" "}
                                            {sortConfig?.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Imagen</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedData.map((character, index) => (
                                    <tr
                                        key={character.id}
                                        className={`border-b border-gray-700 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/20 ${index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-900/50"
                                            }`}
                                    >
                                        <td className="px-6 py-3">{character.id}</td>
                                        <td className="px-6 py-3 font-medium">{character.name}</td>
                                        <td className="px-6 py-3">{character.species}</td>
                                        <td className="px-6 py-3">{character.gender}</td>
                                        <td className="px-6 py-3">{moment(character.created).format("DD/MM/YYYY")}</td>
                                        <td className="px-6 py-3">
                                            <img
                                                src={character.image}
                                                alt={character.name}
                                                loading="lazy"
                                                className="w-16 h-16 rounded-full border-2 border-indigo-400 shadow-md hover:shadow-indigo-500/40 transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-2 opacity-0 animate-fadeIn"
                                                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {renderPagination()}
                </>
            )}
        </div>
    );
}

/* ✨ Animaciones personalizadas con Tailwind */
const styles = `
@keyframes fadeIn {
  from { opacity: 0; filter: blur(6px); }
  to { opacity: 1; filter: blur(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
.animate-fadeInUp { animation: fadeInUp 0.8s ease forwards; }
`;

if (typeof document !== "undefined") {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
}
