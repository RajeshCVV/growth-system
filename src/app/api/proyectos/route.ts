import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/models';

export const dynamic = 'force-dynamic';

// EDITAR Proyecto
export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const { id, ...data } = await req.json();

        const updatedProject = await Project.findByIdAndUpdate(id, data, { new: true });

        if (!updatedProject) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, project: updatedProject });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ELIMINAR Proyecto
export async function DELETE(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Proyecto eliminado' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
