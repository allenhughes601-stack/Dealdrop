import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    if (!process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ message: 'Server configuration error' }, {status: 503});
    }
    const authHeader = request.headers.get('authorization');

    // secure the endpoint so only your backend can tigger it
    if(authHeader !== `Bearer ${process.env.REVALIDATION_SECRET}`){
        return NextResponse.json({ message: 'Invalid token' }, {status: 401});
    }

    try{
        const body = await request.json().catch(() => ({}));
        const path = body.path || '/'
        //Purge the specific path from the next.js cache
        revalidatePath(path);

        return NextResponse.json({ revalidatePath: true, path, now: Date.now() });
    }catch(err: any){
        return NextResponse.json({ message:'Error revalidating' },{status: 500});
    }
}