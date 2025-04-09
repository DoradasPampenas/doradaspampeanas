import {MercadoPagoConfig , Payment} from "mercadopago";
const mercadopago = new MercadoPagoConfig({
 accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN,
});

export async function POST(request) {
  const body = await request.json();
 await new Payment(mercadopago).get(body.id);
 return Response.json({ success: true });
}