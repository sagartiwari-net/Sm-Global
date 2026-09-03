import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineX, HiMinus, HiPlus } from 'react-icons/hi'
import { closeBag, openLogin } from '../features/ui/uiSlice'
import { removeFromBag, updateQty, selectBagTotal } from '../features/bag/bagSlice'

export default function BagDrawer() {
  const open = useSelector((s) => s.ui.bagOpen)
  const items = useSelector((s) => s.bag.items)
  const total = useSelector(selectBagTotal)
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!open) return null

  const placeOrder = () => {
    dispatch(closeBag())
    if (!user) dispatch(openLogin())
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close bag"
        onClick={() => dispatch(closeBag())}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-smm-border px-4 py-4">
          <h2 className="text-lg font-bold">
            My Bag ({items.reduce((s, i) => s + i.qty, 0)})
          </h2>
          <button type="button" onClick={() => dispatch(closeBag())} aria-label="Close">
            <HiOutlineX size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="mb-2 text-lg font-bold">Your bag is empty</p>
              <p className="mb-6 text-sm text-smm-muted">Add items that you like to your shopping bag.</p>
              <button
                type="button"
                onClick={() => dispatch(closeBag())}
                className="rounded border border-smm-pink px-6 py-2.5 text-sm font-bold uppercase text-smm-pink"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 border border-smm-border p-3">
                  <img
                    src={item.image || item.fallback}
                    alt={item.name}
                    className="h-24 w-20 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.brand}</p>
                    <p className="truncate text-xs text-smm-muted">{item.name}</p>
                    <p className="mt-1 text-sm font-bold">₹{item.price}</p>
                    {item.size && (
                      <p className="text-xs text-smm-muted">Size: {item.size}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded border p-1"
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}
                      >
                        <HiMinus size={12} />
                      </button>
                      <span className="text-sm font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        className="rounded border p-1"
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                      >
                        <HiPlus size={12} />
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs font-semibold text-smm-pink"
                        onClick={() => dispatch(removeFromBag(item.id))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-smm-border p-4">
            <div className="mb-3 flex justify-between text-sm font-bold">
              <span>Total MRP</span>
              <span>₹{total}</span>
            </div>
            <button
              type="button"
              onClick={placeOrder}
              className="w-full rounded bg-smm-pink py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-smm-pink-dark"
            >
              Place Order
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
