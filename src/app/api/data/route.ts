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
        const [companies, projects, contents, calendars, campaignsRaw, adsetsRaw, adsRaw] = await Promise.all([
            Company.find({}),
            Project.find({}),
            EditorialContent.find({}),
            Calendar.find({}),
            Campaign.find({}),
            AdSet.find({}),
            Ad.find({})
        ]);

        // 3. Reconstrucción del árbol relacional V3 en memoria para la UI temporal
        const adsList = adsRaw.map(a => a.toObject());
        const adSetList = adsetsRaw.map(s => {
            const sObj = s.toObject();
            return { ...sObj, anuncios: adsList.filter(a => a.conjunto_id === sObj._id.toString() || a.conjunto_id === sObj.id) };
        });
        const campaigns = campaignsRaw.map(c => {
            const cObj = c.toObject();
            return { ...cObj, conjuntos: adSetList.filter(s => s.campana_id === cObj._id.toString() || s.campana_id === cObj.id) };
        });

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
