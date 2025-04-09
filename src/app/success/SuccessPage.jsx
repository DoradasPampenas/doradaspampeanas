"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mensaje, setMensaje] = useState("Confirmando el pago...");

  useEffect(() => {
    const procesarPago = async () => {
      const mpPaymentId = searchParams.get("payment_id");

      if (!mpPaymentId) {
        setMensaje("Error: no se encontró el ID de pago.");
        return;
      }

      try {
        // 🔍 Buscar la venta pendiente
        const ventasSnap = await getDocs(collection(db, "ventas"));
        const ventaDoc = ventasSnap.docs.find((doc) => {
          const data = doc.data();
          return data.estado === "pendiente" && !data.estadoPagoWeb;
        });

        if (!ventaDoc) {
          setMensaje("No se encontró una venta pendiente.");
          return;
        }

        // ✅ Actualizar venta
        await updateDoc(doc(db, "ventas", ventaDoc.id), {
          estado: "pagado",
          estadoPagoWeb: "aprobado",
          mercadoPagoId: mpPaymentId,
        });

        setMensaje("🎉 ¡Pago aprobado! Tu compra fue registrada.");
      } catch (error) {
        console.error("Error al actualizar la venta:", error.message);
        setMensaje("Hubo un problema al confirmar tu pago.");
      }
    };

    procesarPago();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-bold mb-3">Pago con Mercado Pago</h1>
        <p className="text-gray-600">{mensaje}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Volver al menú
        </button>
      </div>
    </div>
  );
}