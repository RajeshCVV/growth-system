import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Strategy } from '@/models';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const { id, ...data } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'ID de estrategia requerido' }, { status: 400 });
        }

        const updatedStrategy = await Strategy.findByIdAndUpdate(id, data, { new: true });

        return NextResponse.json({ success: true, strategy: updatedStrategy });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const data = await req.json();

        const newStrategy = await Strategy.create(data);

        return NextResponse.json({ success: true, strategy: newStrategy }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        await Strategy.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Estrategia eliminada' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
