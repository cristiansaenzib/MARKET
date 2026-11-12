// Textos generales de la tienda. Son de ejemplo: ajústalos a las políticas reales de ROJI.

export const site = {
  name: "ROJI",
  description: "Marcas independientes de streetwear de Bogotá en un solo lugar.",
  perks: ["Envío a toda Colombia", "Cambios hasta 15 días", "Pago contra entrega en Bogotá"],
  shipping: [
    "Bogotá: 1 a 2 días hábiles.",
    "Resto del país: 2 a 5 días hábiles.",
    "El costo del envío se confirma por WhatsApp según la ciudad.",
  ],
  returns: [
    "Tienes 15 días desde que recibes el pedido para solicitar un cambio de talla o de prenda.",
    "La prenda debe estar sin uso, con etiquetas y en su empaque original.",
    "Los productos en promoción solo tienen cambio por talla.",
  ],
};

/** Guía de tallas genérica en centímetros (medidas de la prenda). */
export const sizeGuide = {
  tops: {
    headers: ["Talla", "Pecho", "Largo", "Hombro"],
    rows: [
      ["S", "52", "70", "50"],
      ["M", "55", "72", "52"],
      ["L", "58", "74", "54"],
      ["XL", "61", "76", "56"],
    ],
  },
  bottoms: {
    headers: ["Talla", "Cintura", "Cadera", "Largo"],
    rows: [
      ["S", "76", "100", "100"],
      ["M", "80", "104", "102"],
      ["L", "86", "110", "104"],
      ["XL", "92", "116", "106"],
    ],
  },
};
