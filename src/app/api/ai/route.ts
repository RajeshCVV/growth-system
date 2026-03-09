/**
 * API: /api/ai
 * Integra Google Gemini 1.5 Flash para tareas automáticas de MKT Growth.
 */

import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { actionId, empresaContext } = payload;

        // Prevención contra caídas de build/runtime en local o Vercel sin env:
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("Falta GEMINI_API_KEY. Retornando respuesta Mock.");
            return NextResponse.json({
                success: true,
                isMock: true,
                message: "⚠️ API KEY NO CONFIGURADA. Agrega GEMINI_API_KEY a Vercel o tu entorno local para ver la magia de la Inteligencia Artificial.",
                data: "[Respuesta Simulada de IA generada localmente por seguridad]"
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Configurar los Prompting Agents dependiendo de la acción:
        let systemPrompt = "Eres un Trafficker y Growth Marketer experto de MultiVela Studio, especialista en optimizar campañas en Meta Ads y crear contenido viral orgánico. Contestas siempre en español de manera profesional y muy concisa.";
        let userPrompt = "";

        switch (actionId) {
            case 'campaign':
                userPrompt = `Estructura una campaña de Meta Ads perfecta con CBO para la empresa '${empresaContext.nombre}'. 
                              Necesito obligatoriamente 3 conjuntos: 'Abierto', 'Advantage+', 'Profesiones'.
                              Para cada conjunto dame 3 ideas de Anuncios: (1) Gancho visual, (2) Prueba Social, (3) Oferta o Autoridad. 
                              Limítate a la estructura solicitada, en formato claro.`;
                break;
            case 'hooks':
                userPrompt = `Para la empresa '${empresaContext.nombre}', genera 5 ideas de "Hooks" (Ganchos de 3 segundos) extremadamente disruptivos para empezar videos o reels de Instagram orientados a captar la atención inmediatamente en un formato de anuncio pagado (Ads).`;
                break;
            case 'content':
                userPrompt = `Diseña una tabla de contenidos para 5 días hábiles de la próxima semana para '${empresaContext.nombre}'. 
                Alterna entre 80% Educativo/Inspiracional y 20% Venta Directa.
                Sugiere formato (Carrusel, Reel, Imagen estática).`;
                break;
            case 'scripts':
                userPrompt = `Escribe un guion corto de Reel (30-45 segundos) enfocado a ventas para la empresa '${empresaContext.nombre}'.
                Estructura:
                1. HOOK (2-3 seg) súper llamativo
                2. DESARROLLO (Problema - Solución rápida)
                3. CTA (Llamado a la acción)
                Incluye ideas de elementos visuales (b-roll o texto en pantalla).`;
                break;
            default:
                userPrompt = "Hola, saluda efusivamente y preséntate como el asistente IA.";
        }

        // Llamado real al LLM Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7, // Balance entre creatividad y estructura
            }
        });

        // Parseo de la respuesta (Si es objeto, si es string)
        const textResponse = response.text || "No se pudo generar una respuesta clara.";

        return NextResponse.json({
            success: true,
            isMock: false,
            data: textResponse
        });

    } catch (error: any) {
        console.error("Error crítico en /api/ai:", error.message || error);
        return NextResponse.json({ success: false, error: error.message || "Error interno del motor IA." }, { status: 500 });
    }
}
