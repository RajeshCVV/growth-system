/**
 * CONFIGURACIÓN: MongoDB / Mongoose
 * Esta es la conexión central con la base de datos Atlas.
 * Utiliza un patrón 'singleton' para evitar múltiples conexiones en desarrollo.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor, define la variable MONGODB_URI en el panel de Vercel o en .env.local');
}

/**
 * Global se usa aquí para mantener la conexión durante la recarga de módulos (Hot Reload) 
 * en modo desarrollo de Next.js.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Si ya hay una conexión activa, la reutilizamos
  if (cached.conn) return cached.conn;

  // Si no hay conexión en curso, creamos una nueva promesa de conexión
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Evita que se queden comandos en cola si la conexión falla
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log('✅ Conexión exitosa a MongoDB Atlas');
      return mongoose;
    });
  }

  // Esperamos a que la promesa se resuelva
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
