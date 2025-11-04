import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type FormValues = {
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
};

const schema = yup.object().shape({
    title: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Solo se permiten letras")
        .required("El título es obligatorio"),
    price: yup
        .number()
        .typeError("Debe ser un número")
        .positive("Debe ser positivo")
        .required("El precio es obligatorio"),
    description: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Solo se permiten letras")
        .required("La descripción es obligatoria"),
    image: yup
        .string()
        .matches(
            /^[A-Za-z0-9/:.\-_]+$/,
            "Solo se permiten caracteres alfanuméricos y de URL"
        )
        .required("La imagen es obligatoria"),
    category: yup.string().required("La categoría es obligatoria"),
});

export default function CreateProduct() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>({ resolver: yupResolver(schema) });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            setSuccess(null);
            const res = await axios.post("https://fakestoreapi.com/products", data);
            setSuccess(`Producto creado con ID: ${res.data.id}`);
            reset();

            // ⏱️ Espera 1 segundo para mostrar el mensaje y redirige
            setTimeout(() => {
                navigate("/products"); // 👈 Redirige a la vista de productos
            }, 1500);
        } catch (error) {
            console.error(error);
            setSuccess("Error al crear el producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-700"
            >
                <h2 className="text-4xl font-bold text-center mb-8 text-indigo-400">
                    🛍️ Crear Producto
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Campos del formulario */}
                    <div>
                        <label className="block mb-1 font-semibold">Título</label>
                        <input
                            {...register("title")}
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.title && (
                            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price")}
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.price && (
                            <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Imagen (URL)</label>
                        <input
                            {...register("image")}
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.image && (
                            <p className="text-red-400 text-sm mt-1">{errors.image.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Categoría</label>
                        <input
                            {...register("category")}
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.category && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-semibold">Descripción</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.description && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex justify-center">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.03 }}
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-indigo-500 hover:bg-indigo-400 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {loading ? "Creando..." : "Crear Producto"}
                        </motion.button>
                    </div>
                </form>

                {loading && (
                    <div className="flex justify-center mt-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full"
                        />
                    </div>
                )}

                {success && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-center mt-6 font-semibold ${success.includes("Error") ? "text-red-400" : "text-green-400"
                            }`}
                    >
                        {success}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
