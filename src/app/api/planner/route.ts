/**
 * API: /api/planner
 * Acción: Gestiona el calendario de contenidos mensuales.
 * Conectado a la colección 'Planners' en MongoDB.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Planner } from '@/lib/models';

// 1. CREAR TAREA DE PLANNER (POST)
export async function POST(req: Request) {
    try {
        const data = await req.json();
        await connectDB();
        const newItem = await Planner.create({
            ...data,
            id: Date.now().toString()
        });
        return NextResponse.json(newItem);
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear tarea' }, { status: 500 });
    }
}

// 2. ACTUALIZAR TAREA EXISTENTE (PUT)
export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        await connectDB();
        const updated = await Planner.findOneAndUpdate({ id }, data, { new: true });
        if (!updated) return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar tarea' }, { status: 500 });
    }
}

// 3. ELIMINAR TAREA (DELETE)
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await connectDB();
        const deleted = await Planner.findOneAndDelete({ id });
        if (!deleted) return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar tarea' }, { status: 500 });
    }
}
