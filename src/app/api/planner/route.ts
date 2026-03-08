import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Planner } from '@/models';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const data = await req.json();

        const newTask = await Planner.create({
            proyecto: data.proyecto,
            contenido: data.contenido,
            formato: data.formato || 'Formatos Varios',
            grabacion: data.grabacion || 'N/A',
            publicacion: data.publicacion || 'N/A',
            responsable: data.responsable || 'Sin asignar',
            estado: data.estado || 'Por grabar'
        });

        return NextResponse.json({
            success: true,
            task: { ...newTask.toObject(), id: newTask._id.toString() }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
