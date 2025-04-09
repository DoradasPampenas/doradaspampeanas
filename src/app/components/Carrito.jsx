"use client";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import ProductX from "./mercadopago/ProductX";

export default function Carrito({ carrito, setCarrito }) {
  const { user } = UserAuth();
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState("");

  const [ganaDorada, setGanaDorada] = useState(false);

  useEffect(() => {
    const totalUnidades = carrito.reduce((acc, item) => {
      const cantidad = item.tipo === "unidad" ? 1 : 12;
      return acc + cantidad;
    }, 0);
    setGanaDorada(totalUnidades >= 12);
  }, [carrito]);

  useEffect(() => {
    const suma = carrito.reduce((acc, item) => {
      const precio = item.tipo === "unidad" ? item.precioUnidad : item.precioDocena;
      return acc + (parseFloat(precio) || 0);
    }, 0);
    setTotal(suma);
  }, [carrito]);

  const eliminarItem = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };
  const totalUnidades = carrito.reduce((acc, item) => {
    return acc + (item.tipo === "unidad" ? 1 : 12);
  }, 0);
  
  const tieneEmpanadaDorada =
    totalUnidades >= 12 || carrito.some((item) => item.tipo === "docena");

    return (
<div className="fixed top-20 right-4 bg-orange-50 shadow-md rounded-2xl p-4 w-[360px] z-50 text-sm border border-orange-100 animate-fade-in flex flex-col justify-between max-h-[520px]">
  <div className="space-y-2 flex flex-col flex-grow overflow-hidden">
    <h2 className="text-lg font-bold text-orange-600 flex items-center gap-1">
      🛒 Tu Carrito
    </h2>

    {tieneEmpanadaDorada && (
      <p className="text-center text-orange-500 font-bold text-xs tracking-wide">
        🥟 SUMA EMPANADA DORADA
      </p>
    )}

    {carrito.length === 0 ? (
      <p className="text-orange-300 text-center italic">El carrito está vacío</p>
    ) : (
      <div className="overflow-x-auto whitespace-nowrap flex flex-col gap-3 pb-2 pr-1">
        {carrito.map((item, index) => {
          const precio = item.tipo === "unidad" ? item.precioUnidad : item.precioDocena;

          return (
            <div
              key={index}
              className="min-w-[140px] bg-white border border-orange-200 rounded-lg shadow-sm p-3 flex-shrink-0 relative"
            >
              <button
                onClick={() => eliminarItem(index)}
                className="absolute top-1 right-2 text-orange-500 hover:text-orange-600 font-bold text-base"
              >
                ×
              </button>
              <p className="font-semibold text-orange-700">{item.nombre}</p>
              <p className="text-xs text-orange-400 capitalize">{item.tipo}</p>
              <p className="text-xs text-orange-600 font-medium mt-1">
                ${parseFloat(precio)}
              </p>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {carrito.length > 0 && (
    <div className="pt-3 border-t border-orange-100 mt-2">
      <p className="text-right text-base font-bold text-orange-600">
        Total: ${total.toFixed(2)}
      </p>

      {user ? (
        <form action={ProductX} className="mt-2">
          <input type="hidden" name="ganaDorada" value={ganaDorada ? "true" : "false"} />
          <input type="hidden" name="precio" value={total} />
          <input type="hidden" name="userId" value={user.uid} />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 text-white py-2 rounded-lg font-semibold shadow-sm mt-1"
          >
            🧾 Pagar con Mercado Pago
          </button>
        </form>
      ) : (
        <p className="text-center text-orange-500 mt-2 font-medium">
          🔐 Iniciá sesión para pagar
        </p>
      )}
    </div>
  )}

  {mensaje && (
    <p className="text-center mt-3 text-orange-600 font-medium">{mensaje}</p>
  )}
</div>

    );
  }    