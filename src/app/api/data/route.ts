/**
 * API: /api/data
 * Trae empresas, proyectos, y datos de crecimiento desde MongoDB.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company, Project, EditorialContent, Calendar, Campaign, AdSet, Ad, Metric } from '@/models';

export async function GET() {
    try {
        // 1. Nos aseguramos de que la conexión a MongoDB esté lista
        await connectDB();

        // 2. Realizamos las consultas en paralelo
        const [companies, projects, contents, calendars, campaignsRaw, adsetsRaw, adsRaw, metrics] = await Promise.all([
            Company.find({}),
            Project.find({}),
            EditorialContent.find({}),
            Calendar.find({}),
            Campaign.find({}),
            AdSet.find({}),
            Ad.find({}),
            Metric.find({})
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

        // Cálculo dinámico de Métricas Generales
        const totalLeads = metrics.reduce((acc, m) => acc + (m.leads || 0), 0);
        const totalSpend = metrics.reduce((acc, m) => acc + (m.spend || 0), 0);
        const cplPromedio = totalLeads > 0 ? (totalSpend / totalLeads) : 0;

        // Retornamos la respuesta JSON estructurada con datos V3
        return NextResponse.json({
            empresas: companies.map(c => ({ id: c.empresaId, nombre: c.nombre })),
            proyectos: projects,
            planner: calendars, // Para la UI temporal
            estrategia: campaigns, // Para la UI temporal
            metricasGenerales: {
                leads: totalLeads.toLocaleString('es-CO') || '0',
                cplPromedio: `$${cplPromedio.toFixed(2)}`,
                roi: totalSpend > 0 ? '3.2x' : '0.0x', // Simulado temporalmente
                inversion: `$${totalSpend.toLocaleString('es-CO')}`
            }
        });

    } catch (error) {
        console.error("Error en API GET /api/data:", error);
        return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
    }
}
