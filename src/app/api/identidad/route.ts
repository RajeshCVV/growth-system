import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { BrandIdentity } from '@/models';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const { empresaId, base, personas } = await req.json();

        if (!empresaId) {
            return NextResponse.json({ error: 'empresaId es requerido' }, { status: 400 });
        }

        const updatedIdentity = await BrandIdentity.findOneAndUpdate(
            { empresaId },
            { base, personas },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, identity: updatedIdentity });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
