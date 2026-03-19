import { api } from "../services/api";
import { useState, useEffect } from "react";

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [botonCrearProducto, setbotonCrearProducto] = useState(true);
    
    // Estados para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        imagen_url: '',
        youtube_id: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                const data = await api.get("/productos");
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

    // Función para manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!formData.nombre || !formData.precio || !formData.categoria) {
            setError('Por favor completa los campos obligatorios: Nombre, Precio y Categoría');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            
            // Llamada al endpoint POST
            const resultado = await api.post('/productos/crear', {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock) || 0,
                categoria: formData.categoria,
                imagen_url: formData.imagen_url,
                youtube_id: formData.youtube_id
            });

            console.log('Producto creado:', resultado);

            // Limpiar formulario
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                categoria: '',
                imagen_url: '',
                youtube_id: ''

            });

            // Cerrar formulario
            setbotonCrearProducto(true);
            
            // Recargar la lista de productos
            const data = await api.get("/productos");
            setProductos(data);
            
            alert('✅ Producto creado exitosamente');
        } catch (err) {
            console.error('Error al crear producto:', err);
            const errorMsg = err.message || 'Error al crear el producto. Verifica que todos los campos sean correctos.';
            setError(`❌ ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
            <p className="mt-4 text-slate-600">Bienvenido al sistema de productos. Selecciona una opción del menú.</p>
            {botonCrearProducto && (
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick={() => setbotonCrearProducto(false)}>
                    Crear Producto
                </button>
            )}

            {!botonCrearProducto && (
                <div className="mt-4 p-6 border rounded-lg bg-blue-50 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Formulario de Creación de Producto</h2>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna Izquierda */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2" htmlFor="nombre">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nombre del producto"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2" htmlFor="descripcion">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Descripción del producto"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2" htmlFor="categoria">
                                        Categoría <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="categoria"
                                        value={formData.categoria}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Categoría del producto"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2" htmlFor="precio">
                                        Precio <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="precio"
                                        value={formData.precio}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Precio del producto"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2" htmlFor="stock">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        id="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Cantidad en stock"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2" htmlFor="imagen_url">
                                        URL de la Imagen
                                    </label>
                                    <input
                                        type="url"
                                        id="imagen_url"
                                        value={formData.imagen_url}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="URL de la imagen del producto"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2" htmlFor="youtube_id">
                                        ID de YouTube
                                    </label>
                                    <input
                                        type="text"
                                        id="youtube_id"
                                        value={formData.youtube_id}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="ID del video de YouTube relacionado"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Guardando...' : 'Guardar Producto'}
                            </button>
                            <button 
                                type="button"
                                className="text-slate-600 px-6 py-2 rounded-md border border-slate-300 hover:bg-slate-100 transition font-medium" 
                                onClick={() => setbotonCrearProducto(true)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                            {producto.youtube_id ? (
                                <iframe
                                width="100%"
                                height="100%"
                                    className="w-full h-48 mt-4 rounded-md"
                                    src={`https://www.youtube.com/embed/${producto.youtube_id}`}
                                    title="Video de YouTube"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />

                            ) : (
                                <img src={producto.imagen_url || "https://via.placeholder.com/150"} alt={producto.nombre} className="w-full h-48 object-cover rounded-md mt-4" />
                            )}
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


