//Admin Pro inventario
import { api } from "../services/api";
import { useState, useEffect } from "react";

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                const data = await api.get("/productos/obtener");
                setProductos(data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar productos:", err);
                setError("No se pudieron cargar los productos");
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
            <p className="mt-4 text-slate-600">Bienvenido al sistema de productos. Selecciona una opción del menú.</p>
            
            {loading && <p className="mt-4 text-blue-600">Cargando productos...</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            
            {!loading && !error && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productos.map((producto) => (
                        <div key={producto.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                            <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-48 object-cover rounded-md mb-4" />
                            <h2 className="text-xl font-semibold text-slate-800">{producto.nombre}</h2>
                            <p className="text-slate-600 mt-2">{producto.descripcion}</p>
                            <p className="text-green-600 font-bold mt-4">${producto.precio}</p>
                            <p className="text-slate-600 mt-1">Stock: {producto.stock}</p>
                            <p className="text-slate-600 mt-1">Categoría: {producto.categoria}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {!loading && !error && productos.length === 0 && (
                <p className="mt-4 text-slate-600">No hay productos disponibles.</p>
            )}
        </div>
    );
};

export default Productos;


