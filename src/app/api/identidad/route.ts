/**
 * API: /api/identidad
 * Acción: Actualiza la Identidad de Marca (ADN) y los Buyer Personas.
 * Utiliza 'upsert' (actualizar o crear si no existe) basado en el empresaId.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BrandIdentity } from '@/models';

export async function PUT(req: Request) {
    try {
        // Obtenemos el empresaId y los nuevos datos del cuerpo del request
        const { empresaId, base, personas } = await req.json();

        // Conexión a MongoDB
        await connectDB();

        // Buscamos por empresaId y actualizamos. 
        // { upsert: true }: Si la empresa no tiene identidad aún, la crea automáticamente.
        const updated = await BrandIdentity.findOneAndUpdate(
            { empresaId },
            { base, personas },
            { new: true, upsert: true }
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error en API PUT /api/identidad:", error);
        return NextResponse.json({ error: 'Error al actualizar identidad' }, { status: 500 });
    }
}
