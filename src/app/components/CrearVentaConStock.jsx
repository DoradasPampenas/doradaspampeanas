import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";

// ✅ Función principal para crear la venta
export async function crearVentaConStock(uid, carrito, metodo = "efectivo") {
  try {
    // 🔎 1. Obtener datos del cliente desde su UID
    const clienteRef = doc(db, "clientes", uid);
    const clienteSnap = await getDoc(clienteRef);

    if (!clienteSnap.exists()) {
      throw new Error("Cliente no encontrado.");
    }

    const clienteData = clienteSnap.data();

    // 🔄 2. Calcular nuevo ID de venta
    const ventasSnap = await getDocs(collection(db, "ventas"));
    const ids = ventasSnap.docs.map(doc => doc.data().id || 0);
    const newId = Math.max(0, ...ids) + 1;

    // 🧮 3. Reducir stock en cada producto del carrito
    const productosActualizados = [];

    for (const producto of carrito) {
      const variedadRef = doc(db, "variedades", producto.id);
      const variedadSnap = await getDoc(variedadRef);

      if (variedadSnap.exists()) {
        const variedadData = variedadSnap.data();
        const nuevoStock = (variedadData.stock || 0) - 1;

        // Evitar stock negativo
        if (nuevoStock < 0) {
          throw new Error(`Stock insuficiente para ${producto.descripcion}`);
        }

        // Actualizar stock en Firestore
        await updateDoc(variedadRef, { stock: nuevoStock });

        productosActualizados.push({
          ...producto,
          stockAntes: variedadData.stock,
          stockDespues: nuevoStock,
        });
      }
    }

    // 🧾 4. Armar y guardar la venta
    const venta = {
      id: newId,
      clienteId: uid,
      clienteNombre: clienteData.nombre,
      clienteDireccion: clienteData.direccion || "Sin dirección",
      clienteTelefono: clienteData.telefono || "Sin teléfono",
      productos: productosActualizados,
      fecha: new Date().toLocaleString(),
      estado: metodo === "efectivo" ? "EN EFECTIVO" : "pendiente",
      metodo,
    };

    await addDoc(collection(db, "ventas"), venta);

    console.log("✅ Venta guardada con éxito:", venta);
    return venta;

  } catch (error) {
    console.error("❌ Error al crear la venta:", error.message);
    throw error;
  }
}
