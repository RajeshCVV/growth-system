import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/models';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const data = await req.json();

        const newProject = await Project.create({
            empresaId: data.empresaId,
            nombre: data.nombre,
            estado: data.estado || 'Planificación',
            ticket: data.ticket || '$0',
            fechaCierre: data.fechaCierre || 'N/A',
            responsable: data.responsable || 'Sin asignar'
        });

        return NextResponse.json({
            success: true,
            project: { ...newProject.toObject(), id: newProject._id.toString() }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
