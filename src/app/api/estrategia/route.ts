/**
 * API: /api/estrategia
 * Acción: Maneja la estructura de campañas, conjuntos y anuncios de Meta Ads.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Strategy } from '@/models';

// 1. ACTUALIZAR O CREAR ESTRATEGIA (PUT)
export async function PUT(req: Request) {
    try {
        const { empresaId, ...data } = await req.json();
        await connectDB();

        // Sincroniza los cambios en la estructura jerárquica de la campaña
        const updated = await Strategy.findOneAndUpdate(
            { empresaId },
            data,
            { new: true, upsert: true }
        );

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar estrategia' }, { status: 500 });
    }
}

// 2. CREAR DESDE CERO (POST)
export async function POST(req: Request) {
    try {
        const data = await req.json();
        await connectDB();
        const newStrategy = await Strategy.create(data);
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
        await Strategy.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar estrategia' }, { status: 500 });
    }
}
