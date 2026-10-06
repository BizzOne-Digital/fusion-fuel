import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  addCartItem,
  getCartWithTotals,
  removeCartItem,
  updateCartItemQuantity,
} from '@/lib/cart/service';
import { buildCartSessionCookie, getCartSessionId } from '@/lib/cart/session';

export async function GET() {
  try {
    const session = await auth();
    const sessionId = await getCartSessionId();
    const { cart, totals } = await getCartWithTotals(
      sessionId,
      session?.user?.role === 'customer' ? session.user.id : undefined
    );

    const response = NextResponse.json({
      items: cart.items,
      totals,
      currency: cart.currency,
    });

    if (!session?.user) {
      response.cookies.set(buildCartSessionCookie(sessionId));
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const sessionId = await getCartSessionId();
    const body = await request.json();
    const cart = await addCartItem(
      sessionId,
      body,
      session?.user?.role === 'customer' ? session.user.id : undefined
    );

    const response = NextResponse.json({ success: true, itemCount: cart.items.length });
    if (!session?.user) {
      response.cookies.set(buildCartSessionCookie(sessionId));
    }
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const sessionId = await getCartSessionId();
    const { itemId, quantity } = await request.json();
    await updateCartItemQuantity(
      sessionId,
      itemId,
      quantity,
      session?.user?.role === 'customer' ? session.user.id : undefined
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const sessionId = await getCartSessionId();
    const { itemId } = await request.json();
    await removeCartItem(
      sessionId,
      itemId,
      session?.user?.role === 'customer' ? session.user.id : undefined
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 400 });
  }
}
