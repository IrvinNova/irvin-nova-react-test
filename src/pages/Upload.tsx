import React, { useState, DragEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";

export default function Upload() {
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file: File) => {
        const validTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            setError("Formato no válido. Solo se permiten PNG, JPG o JPEG.");
            setImage(null);
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const removeImage = () => {
        setImage(null);
        setError(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-800 to-purple-900 text-white p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-lg text-center"
            >
                <h2 className="text-3xl font-bold mb-6 text-indigo-300">📤 Subir Imagen</h2>

                {/* Zona Drag & Drop */}
                {!image ? (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300
              ${dragging ? "border-indigo-400 bg-indigo-900/20" : "border-white/30 bg-slate-800/40"}`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                    >
                        <p className="text-lg mb-3">Arrastra y suelta una imagen aquí</p>
                        <p className="text-sm text-gray-300">o haz clic para seleccionar</p>

                        <input
                            id="fileInput"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleInputChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="bg-slate-800/60 rounded-xl border border-white/30 shadow-md overflow-hidden">
                        {/* Imagen */}
                        <div className="p-4 flex justify-center">
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full h-64 object-contain rounded-lg"
                            />
                        </div>

                        {/* Footer con botón */}
                        <div className="bg-slate-900/60 border-t border-white/20 p-4 flex justify-center">
                            <button
                                onClick={removeImage}
                                className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg shadow-md text-sm font-semibold transition"
                            >
                                Eliminar imagen
                            </button>
                        </div>
                    </div>
                )}

                {/* Mensaje de error */}
                {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
            </motion.div>
        </div>
    );
}
