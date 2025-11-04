import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center text-white">
                <div className="flex flex-col items-center">
                    <ExclamationTriangleIcon className="w-20 h-20 text-yellow-300 mb-4" />
                    <h1 className="text-6xl font-bold mb-2">404</h1>
                    <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
                    <p className="text-gray-200 mb-8">
                        Lo sentimos, la página que estás buscando no existe o fue movida.
                    </p>
                    <Link
                        to="/rick-morty"
                        className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
