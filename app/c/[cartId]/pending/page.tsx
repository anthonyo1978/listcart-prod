import { notFound, redirect } from 'next/navigation'
import { getCartById } from '@/lib/actions'
import PendingClient from './PendingClient'

export default async function CartPendingPage({
  params,
}: {
  params: Promise<{ cartId: string }>
}) {
  const { cartId } = await params
  const cart = await getCartById(cartId)

  if (!cart) {
    notFound()
  }

  return <PendingClient cartId={cart.id} friendlyId={cart.friendlyId} />
}

