'use client';
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";
import Modal from "./Modal";
import Carrito from './Carrito';

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
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

    const precioBase = Number(item.precio);
    const precioUnidad = Math.round(precioBase * 1.3);
    const precioDocena = Math.round(precioBase * 1.3 * 12);

    setCarrito(prev => [
      ...prev,
      {
        ...item,
        tipo,
        precioUnidad,
        precioDocena
      }
    ]);
  };

  return (
    <section id="menu" className="my-12 bg-orange-50 rounded-xl shadow-xl p-6 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-left text-orange-600">
          Doraditas de:
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => setMostrarCarrito(prev => !prev)}>
            <ShoppingCart className="w-8 h-8 text-orange-600" />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {carrito.length}
              </span>
            )}
          </div>

          {!clienteCargado && (
            <button
              onClick={() => setMostrarModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Cargar datos de envío
            </button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {variedades.map((item) => (
          <div
            key={item.id}
            className="bg-orange-50 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
          >
            <img
              src={item.imagen}
              alt={item.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.descripcion}</p>
              {item.ingredientes?.length > 0 && (
                <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
                  {item.ingredientes.map((ing, i) => (
                    <li key={i}>{typeof ing === "string" ? ing : ing.nombre}</li>
                  ))}
                </ul>
              )}

              <p className="text-lg font-semibold text-orange-600 mb-4">
                ${Math.round(Number(item.precio) * 1.3)}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => agregarAlCarrito(item, "unidad")}
                  className={`py-2 rounded-lg font-semibold text-sm transition ${
                    clienteCargado
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
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
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!clienteCargado}
                >
                  x12 Docena
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <Modal cerrar={() => {
          setMostrarModal(false);
          setClienteCargado(true);
        }} />
      )}

      {mostrarCarrito && (
        <Carrito carrito={carrito} setCarrito={setCarrito} />
      )}
    </section>
  );
}
