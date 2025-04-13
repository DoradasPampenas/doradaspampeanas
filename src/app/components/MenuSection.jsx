"use client";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";
import Modal from "./Modal";
import Carrito from "./Carrito";

export default function MenuSection() {
  const [variedades, setVariedades] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [clienteCargado, setClienteCargado] = useState(false);
  const { user } = UserAuth();

  useEffect(() => {
    const obtenerVariedades = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "variedades"));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVariedades(lista);
      } catch (error) {
        console.error("Error al obtener variedades:", error);
      }
    };

    obtenerVariedades();
  }, []);

  useEffect(() => {
    const verificarCliente = async () => {
      if (!user?.uid) return;
      const ref = doc(db, "clientes", user.uid);
      const snap = await getDoc(ref);
      setClienteCargado(snap.exists());
    };

    verificarCliente();
  }, [user]);

  const agregarAlCarrito = (item, tipo) => {
    if (!clienteCargado) return;

    const precioDocena = Number(item.precioSugeridoDocena);
    if (isNaN(precioDocena)) {
      console.warn("Precio sugerido inválido para:", item);
      return;
    }

    const precioUnidad = Math.round(precioDocena / 12);

    const nuevoItem = {
      nombre: item.descripcion || item.nombre,
      tipo,
      precioDocena,
      ...(tipo === "unidad" && { precioUnidad })
    };

    setCarrito(prev => [...prev, nuevoItem]);
  };

  const formatearPrecio = (valor) => {
    const num = Number(valor);
    return isNaN(num) ? "Precio no disponible" : `$${num.toLocaleString("es-AR")}`;
  };

  return (
    <section id="menu" className="my-12 bg-orange-50 rounded-xl shadow-xl p-6 relative">
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
  <h2 className="text-3xl sm:text-2xl font-bold text-orange-300">Doraditas de:</h2>

  <div className="flex items-center gap-4 self-end sm:self-auto">
    <div
      className="relative cursor-pointer"
      onClick={() => setMostrarCarrito(prev => !prev)}
    >
      <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-orange-300" />
      {carrito.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-300 text-white text-xs px-2 py-0.5 rounded-full">
          {carrito.length}
        </span>
      )}
    </div>

    {!clienteCargado && (
      <button
        onClick={() => setMostrarModal(true)}
        className="bg-orange-300 hover:bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm"
      >
        Cargar datos de envío
      </button>
    )}
  </div>
</div>


      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {variedades.map((item) => {
          const precioDocena = item.precioSugeridoDocena;
          const precioUnidad = Math.round(precioDocena / 12);

          return (
            <div
              key={item.id}
              style={{
                backgroundImage: `url(${item.imagenrelleno})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
    
              className=" rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
            >

            <div 
                        className="p-10">
              <h3 className="text-3xl text-center font-bold text-white">{item.nombre}</h3>
              </div>
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-full h-48 object-cover"
                />

              <div className="p-4 hover:bg-orange-100 hover:bg-opacity-40">
                <p className="text-sl text-yellow-500 mb-2">{item.descripcion}</p>

                {item.ingredientes?.length > 0 && (
                  <ul className="text-sm text-yellow-400 mb-4 list-disc list-inside">
                    {item.ingredientes.map((ing, i) => (
                      <li key={i} className="h-full p-2">{typeof ing === "string" ? ing : ing.nombre}</li>
                    ))}
                  </ul>
                )}

                <p className="text-lg font-semibold text-yellow-400 mb-2">
                  {formatearPrecio(precioDocena)} la docena
                </p>
                <p className="text-sm text-yellow-400 mb-4">
                  {formatearPrecio(precioUnidad)} c/u
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => agregarAlCarrito(item, "unidad")}
                    className={`py-2 rounded-lg font-semibold text-sm transition ${
                      clienteCargado
                        ? "bg-orange-300 hover:bg-yellow-500 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!clienteCargado}
                  >
                    x1 Unidad
                  </button>
                  <button
                    onClick={() => agregarAlCarrito(item, "docena")}
                    className={`py-2 rounded-lg font-semibold text-sm transition ${
                      clienteCargado
                        ? "bg-orange-300 hover:bg-yellow-500 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!clienteCargado}
                  >
                    x12 Docena
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {mostrarModal && (
        <Modal
          cerrar={() => {
            setMostrarModal(false);
            setClienteCargado(true);
          }}
        />
      )}

      {mostrarCarrito && (
        <Carrito carrito={carrito} setCarrito={setCarrito} />
      )}
    </section>
  );
}
