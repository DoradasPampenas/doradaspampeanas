"use server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
} from "firebase/firestore";

const client = new MercadoPagoConfig({ accessToken: `${process.env.A}` });

export default async function ProductX(formData) {
  const precio = parseFloat(formData.get("precio"));
  const userId = formData.get("userId") || "anon";
  const ganaDorada = formData.get("ganaDorada") === "true"; // 👈 NUEVO

  // 🔄 Buscar info del cliente
  const clienteRef = doc(db, "clientes", userId);
  const clienteSnap = await getDoc(clienteRef);
  const clienteData = clienteSnap.exists() ? clienteSnap.data() : {};

  // 🆔 Nuevo ID para la venta
  const ventasSnap = await getDocs(collection(db, "ventas"));
  const ids = ventasSnap.docs.map(doc => doc.data().id || 0);
  const newId = Math.max(0, ...ids) + 1;

  // 🧾 Crear la venta en Firestore
  const venta = {
    id: newId,
    clienteId: userId,
    clienteNombre: clienteData.nombre || "Desconocido",
    clienteDireccion: clienteData.direccion || "Sin dirección",
    clienteTelefono: clienteData.telefono || "Sin teléfono",
    productos: [], // Podés agregar los productos después si querés
    fecha: new Date().toLocaleString(),
    estado: "pendiente",
    estadoPagoWeb: "pendiente",
    metodo: "mercadoPago",
    ganaDorada, // 👈 NUEVO campo
  };

  await addDoc(collection(db, "ventas"), venta);

  // 💰 Crear preferencia en Mercado Pago
  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: `${newId}`,
          title: "DORADAS PAMPEANAS",
          quantity: 1,
          unit_price: precio,
        },
      ],
      back_urls: {
        success: `${process.env.URL}/success`,
        failure: `${process.env.URL}/failure`,
        pending: `${process.env.URL}/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.URL}/api/payments`,
    },
  });

  // 🔁 Redirigir al checkout de Mercado Pago
  redirect(preference.init_point);
}
