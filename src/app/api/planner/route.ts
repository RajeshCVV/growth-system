import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Planner } from '@/models';

export const dynamic = 'force-dynamic';

// EDITAR Tarea del Planner
export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const { id, ...data } = await req.json();

        const updatedTask = await Planner.findByIdAndUpdate(id, data, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ success: true, task: updatedTask });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ELIMINAR Tarea del Planner
export async function DELETE(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        const deletedTask = await Planner.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Tarea eliminada' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
