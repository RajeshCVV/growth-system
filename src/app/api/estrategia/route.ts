/**
 * API: /api/estrategia
 * Acción: Maneja la estructura de campañas, conjuntos y anuncios de Meta Ads.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Campaign, AdSet, Ad } from '@/models';

// 1. ACTUALIZAR O CREAR ESTRATEGIA (PUT)
export async function PUT(req: Request) {
    try {
        const { empresaId, conjuntos, ...campaignData } = await req.json();
        await connectDB();

        // 1. Guardar/Actualizar la Campaña principal
        let campaign = await Campaign.findOneAndUpdate(
            { empresa_id: empresaId },
            { ...campaignData, empresa_id: empresaId },
            { new: true, upsert: true }
        );

        // 2. Limpiar el historial relacional para evitar duplicados en la UI
        await AdSet.deleteMany({ campana_id: campaign._id.toString() });
        // (Sería ideal borrar los Ads también, pero los Ads antiguos quedarán huérfanos por ahora. Mejoraremos esto en el delete en cascada después).

        // 3. Insertar los Conjuntos (AdSets) y Anuncios (Ads) iterativamente
        if (conjuntos && Array.isArray(conjuntos)) {
            for (const conjunto of conjuntos) {
                const newAdSet = await AdSet.create({
                    campana_id: campaign._id.toString(),
                    nombre: conjunto.nombre,
                    tipo_segmento: conjunto.tipo_segmento,
                    audiencia: conjunto.audiencia,
                    presupuesto: conjunto.presupuesto,
                    estado: conjunto.estado
                });

                if (conjunto.anuncios && Array.isArray(conjunto.anuncios)) {
                    for (const ad of conjunto.anuncios) {
                        await Ad.create({
                            conjunto_id: newAdSet._id.toString(),
                            nombre: ad.nombre,
                            formato: ad.formato,
                            objetivo: ad.objetivo,
                            estado: ad.estado,
                            hook: ad.hook // Campo extra de ICreative fusionado temporalmente para la vista
                        });
                    }
                }
            }
        }

        return NextResponse.json({ success: true, campaign });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar estrategia' }, { status: 500 });
    }
}

// 2. CREAR DESDE CERO (POST)
export async function POST(req: Request) {
    try {
        const data = await req.json();
        await connectDB();
        const newStrategy = await Campaign.create(data);
        return NextResponse.json(newStrategy);
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear estrategia' }, { status: 500 });
    }
}

// 3. ELIMINAR ESTRATEGIA (DELETE)
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await connectDB();
        await Campaign.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar estrategia' }, { status: 500 });
    }
}
