/**
 * API: /api/proyectos
 * Acción: Crea, actualiza o elimina proyectos en MongoDB.
 * Maneja los métodos POST, PUT y DELETE.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project } from '@/models';

// 1. CREAR UN NUEVO PROYECTO (POST)
export async function POST(req: Request) {
    try {
        const data = await req.json();
        await connectDB();
        const newProject = await Project.create({
            ...data,
            id: Date.now().toString() // Genera un ID único basado en el tiempo
        });
        return NextResponse.json(newProject);
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
    }
}

// 2. ACTUALIZAR PROYECTO EXISTENTE (PUT)
export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        await connectDB();
        const updated = await Project.findOneAndUpdate({ id }, data, { new: true });
        if (!updated) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 });
    }
}

// 3. ELIMINAR PROYECTO (DELETE)
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await connectDB();
        const deleted = await Project.findOneAndDelete({ id });
        if (!deleted) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar proyecto' }, { status: 500 });
    }
}
