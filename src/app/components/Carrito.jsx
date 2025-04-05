"use client";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

export default function Carrito({ carrito, setCarrito }) {
  const { user } = UserAuth();
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const suma = carrito.reduce((acc, item) => {
      const precio = item.tipo === "unidad" ? item.precioUnidad : item.precioDocena;
      const precioSeguro = parseFloat(precio) || 0;
      return acc + precioSeguro;
    }, 0);
    setTotal(suma);
  }, [carrito]);

  const eliminarItem = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const pagar = (metodo) => {
    if (!user) return setMensaje("🔐 Iniciá sesión para continuar.");

    const venta = {
      clienteId: user.uid,
      productos: carrito,
      total,
      metodo,
      estado: metodo === "efectivo" ? "pendiente" : "pagadoMP",
      fecha: serverTimestamp(),
    };

    addDoc(collection(db, "ventas"), venta)
      .then(() => {
        setCarrito([]);
        setMensaje("✅ Pedido registrado");
      })
      .catch(() => setMensaje("⚠️ Hubo un error al registrar el pedido"));
  };

  return (
    <div className="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-3 w-[270px] z-50 text-sm">
      <h2 className="text-xl font-semibold mb-3">🛍️ Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-400 text-center">El carrito está vacío</p>
      ) : (
        <ul className="space-y-1">
          {carrito.map((item, index) => {
            const precio = item.tipo === "unidad" ? item.precioUnidad : item.precioDocena;
            const precioSeguro = parseFloat(precio) || 0;
            return (
              <li key={index} className="flex justify-between items-center border-b pb-1">
                <div>
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-xs text-gray-500">{item.tipo}</p>
                  <p className="text-xs text-orange-500">${precioSeguro}</p>
                </div>
                <button
                  onClick={() => eliminarItem(index)}
                  className="text-red-500 text-base font-bold"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {carrito.length > 0 && (
        <div className="mt-3">
          <p className="text-right font-semibold text-green-600">
            Total: ${total.toFixed(2)}
          </p>

          <div className="grid grid-cols-1 gap-2 mt-3">
            <button
              onClick={() => pagar("efectivo")}
              className="bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-md text-sm"
            >
              Pagar en efectivo
            </button>
            <button
              onClick={() => pagar("mercadoPago")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-md text-sm"
            >
              Pagar por Mercado Pago
            </button>
          </div>
        </div>
      )}

      {mensaje && (
        <p className="text-center mt-3 text-blue-600 font-medium">{mensaje}</p>
      )}
    </div>
  );
}
