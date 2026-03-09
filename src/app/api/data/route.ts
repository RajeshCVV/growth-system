/**
 * API: /api/data
 * Trae empresas, proyectos, y datos de crecimiento desde MongoDB.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company, Project, EditorialContent, Calendar, Campaign, AdSet, Ad } from '@/models';

export async function GET() {
    try {
        // 1. Nos aseguramos de que la conexión a MongoDB esté lista
        await connectDB();

        // 2. Realizamos las consultas en paralelo
        const [companies, projects, contents, calendars, campaigns] = await Promise.all([
            Company.find({}),
            Project.find({}),
            EditorialContent.find({}),
            Calendar.find({}),
            Campaign.find({})
        ]);

        // Retornamos la respuesta JSON estructurada con datos V3
        return NextResponse.json({
            empresas: companies.map(c => ({ id: c.empresaId, nombre: c.nombre })),
            proyectos: projects,
            planner: calendars, // Para la UI temporal
            estrategia: campaigns, // Para la UI temporal
            metricasGenerales: {
                leads: '1,240',
                cplPromedio: '$2.48',
                roi: '4.2x',
                inversion: '$3,000'
            }
        });

    } catch (error) {
        console.error("Error en API GET /api/data:", error);
        return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
    }
}
