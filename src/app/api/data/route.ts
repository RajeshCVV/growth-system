/**
 * API: /api/data
 * Función: Obtener todos los datos del sistema para la carga inicial.
 * Trae empresas, proyectos, planner, identidad y estrategias desde MongoDB.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company, Project, Planner, BrandIdentity, Strategy } from '@/lib/models';

export async function GET() {
    try {
        // 1. Nos aseguramos de que la conexión a MongoDB esté lista
        await connectDB();

        // 2. Realizamos las consultas en paralelo para mayor velocidad
        const [companies, projects, plannerItems, identities, strategies] = await Promise.all([
            Company.find({}),
            Project.find({}),
            Planner.find({}),
            BrandIdentity.find({}),
            Strategy.find({})
        ]);

        // 3. Mapeamos la identidad de marca en un objeto indexado por empresaId
        // Esto facilita al frontend encontrar la identidad de una empresa específica.
        const identityMap: Record<string, any> = {};
        identities.forEach(id => {
            identityMap[id.empresaId] = {
                base: id.base,
                personas: id.personas
            };
        });

        // 4. Retornamos la respuesta JSON estructurada
        return NextResponse.json({
            empresas: companies.map(c => ({ id: c.empresaId, nombre: c.nombre })),
            proyectos: projects,
            planner: plannerItems,
            identidad: identityMap,
            estrategia: strategies,
            // Métricas simuladas (puedes conectarlas a una colección real si lo deseas)
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
